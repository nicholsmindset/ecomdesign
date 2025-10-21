'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { Loader2, User, Bell, Shield, Trash2 } from 'lucide-react'

export default function SettingsPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [name, setName] = useState(session?.user?.name || '')
  const [email] = useState(session?.user?.email || '')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  if (status === 'unauthenticated') {
    redirect('/auth/signin')
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      if (response.ok) {
        await update({ name })
        toast({
          title: 'Profile updated',
          description: 'Your profile has been updated successfully',
        })
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update profile',
      })
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteAccount() {
    if (!confirm(
      'Are you sure you want to delete your account? This action cannot be undone. All your data, including jobs and credits, will be permanently deleted.'
    )) {
      return
    }

    if (!confirm('This is your final warning. Type DELETE in the next prompt to confirm.')) {
      return
    }

    const confirmation = prompt('Type DELETE to confirm account deletion:')
    if (confirmation !== 'DELETE') {
      toast({
        title: 'Cancelled',
        description: 'Account deletion cancelled',
      })
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch('/api/users/account', {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Account deleted',
          description: 'Your account has been deleted',
        })
        router.push('/')
      } else {
        throw new Error('Failed to delete account')
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete account',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle>Profile</CardTitle>
          </div>
          <CardDescription>
            Update your profile information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed. Contact support if you need to update it.
              </p>
            </div>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>
            Manage your notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Job Completion</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when your jobs are completed
              </p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Credit Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when you're running low on credits
              </p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about new features and promotions
              </p>
            </div>
            <input type="checkbox" className="h-4 w-4" />
          </div>
          <Button variant="outline" className="mt-4">
            Save Preferences
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Security</CardTitle>
          </div>
          <CardDescription>
            Manage your account security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Password</Label>
            <p className="text-sm text-muted-foreground">
              {session?.user?.email?.includes('@')
                ? 'Change your password to keep your account secure'
                : 'You signed up with Google OAuth and don\'t have a password'
              }
            </p>
            <Button variant="outline" size="sm">
              Change Password
            </Button>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Two-Factor Authentication</Label>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account
            </p>
            <Button variant="outline" size="sm">
              Enable 2FA
            </Button>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Sessions</Label>
            <p className="text-sm text-muted-foreground">
              Manage your active sessions across devices
            </p>
            <Button variant="outline" size="sm">
              View Sessions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Default Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Default Preferences</CardTitle>
          <CardDescription>
            Set your default job preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="modelType">Default Model Type</Label>
            <select
              id="modelType"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              defaultValue="realistic"
            >
              <option value="realistic">Realistic</option>
              <option value="artistic">Artistic</option>
              <option value="minimal">Minimal</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sceneStyle">Default Scene Style</Label>
            <select
              id="sceneStyle"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              defaultValue="studio"
            >
              <option value="studio">Studio</option>
              <option value="outdoor">Outdoor</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="abstract">Abstract</option>
            </select>
          </div>
          <Button variant="outline">Save Defaults</Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </div>
          <CardDescription>
            Irreversible actions that affect your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-destructive/50 p-4">
            <h3 className="font-semibold mb-2">Delete Account</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back. All your data, including jobs, credits, and subscription information will be permanently deleted.
            </p>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
