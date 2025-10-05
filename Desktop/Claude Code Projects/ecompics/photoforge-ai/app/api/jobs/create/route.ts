import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { calculateBatchCredits, getBatchDiscountInfo, hasEnoughCredits } from "@/lib/pricing"
import { QueueService } from "@/lib/services/queue-service"
import { StorageService } from "@/lib/services/storage-service"
import { creditService } from "@/lib/services/credit-service"

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const images = formData.getAll("images") as File[]
    const backgroundPrompt = formData.get("backgroundPrompt") as string

    // Validate input
    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: "No images provided" },
        { status: 400 }
      )
    }

    if (!backgroundPrompt || backgroundPrompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Background prompt is required" },
        { status: 400 }
      )
    }

    if (images.length > 100) {
      return NextResponse.json(
        { error: "Maximum 100 images per job" },
        { status: 400 }
      )
    }

    // Get user with tier info
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        tier: true,
        creditsBalance: true,
        creditsUsedThisMonth: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Calculate credits needed
    const totalCredits = calculateBatchCredits(images.length)
    const discountInfo = getBatchDiscountInfo(images.length)
    const discount = discountInfo?.discount ? Math.round(discountInfo.discount * 100) : 0

    // Check if user has enough credits
    if (!hasEnoughCredits(user.creditsBalance, totalCredits)) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          required: totalCredits,
          available: user.creditsBalance
        },
        { status: 402 }
      )
    }

    // Initialize services
    const storageService = new StorageService()
    const queueService = new QueueService()

    // Generate job ID
    const jobId = crypto.randomUUID()

    // Upload images to S3
    const imageUrls: string[] = []
    for (let i = 0; i < images.length; i++) {
      const file = images[i]
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Generate unique filename
      const ext = file.name.split(".").pop() || "jpg"
      const filename = `${jobId}_input_${i}.${ext}`

      // Upload to S3
      const url = await storageService.uploadBuffer(buffer, filename, file.type)
      imageUrls.push(url)
    }

    // Reserve credits using credit service
    const deductResult = await creditService.deductCredits(
      user.id,
      totalCredits,
      jobId,
      `Reserved ${totalCredits} credits for ${images.length} images${discount > 0 ? ` (${discount}% discount)` : ""}`
    )

    if (!deductResult.success) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          required: totalCredits,
          available: deductResult.newBalance
        },
        { status: 402 }
      )
    }

    // Create job in database
    const job = await prisma.job.create({
      data: {
        id: jobId,
        userId: user.id,
        status: "pending",
        originalImageUrl: imageUrls[0], // First image as the original
        modelType: "realistic",
        sceneStyle: backgroundPrompt,
        quantity: images.length,
        creditsReserved: totalCredits,
        creditsConsumed: 0,
        backgroundPrompt: backgroundPrompt,
        inputImages: imageUrls,
        imageCount: images.length,
        progress: 0
      }
    })

    // Add job to Bull queue for processing
    try {
      await queueService.addJob({
        jobId: job.id,
        userId: user.id,
        backgroundPrompt,
        inputImages: imageUrls
      })

      console.log(`Job ${jobId} added to processing queue`)
    } catch (queueError: unknown) {
      console.error("Failed to add job to queue:", queueError)

      // Refund credits on queue failure using credit service
      await creditService.refundCredits(
        user.id,
        totalCredits,
        jobId,
        "Failed to queue job for processing"
      )

      // Mark job as failed
      await prisma.job.update({
        where: { id: jobId },
        data: {
          status: "failed",
          errorMessage: "Failed to queue job for processing"
        }
      })

      return NextResponse.json(
        { error: "Failed to queue job for processing" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        job: {
          id: job.id,
          status: job.status,
          imageCount: job.quantity,
          creditsReserved: job.creditsReserved
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Job creation error:", error)
    return NextResponse.json(
      { error: "An error occurred while creating the job" },
      { status: 500 }
    )
  }
}
