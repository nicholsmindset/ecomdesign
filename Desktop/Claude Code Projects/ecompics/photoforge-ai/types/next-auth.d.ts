import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      tier: string
      creditsBalance: number
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    image?: string | null
    tier?: string
    creditsBalance?: number
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    tier: string
    creditsBalance: number
  }
}
