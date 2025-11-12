import { PrismaClient } from "@prisma/client"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "votre@email.com" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis")
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          throw new Error("Email ou mot de passe incorrect")
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error("Email ou mot de passe incorrect")
        }

        // Return user object (will be passed to JWT callback)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      // Add user info from token to session
      if (token && session?.user) {
        session.user.id = token.id
        session.user.role = token.role || 'user'
      }
      return session
    },
    async jwt({ token, user }) {
      // Add user info to token on sign in
      if (user) {
        token.id = user.id
        token.role = user.role || 'user'
      }
      return token
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt", // Use JWT strategy for credentials provider
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}
