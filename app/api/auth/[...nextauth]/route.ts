import { PrismaAdapter } from "@auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import { prisma } from "@/utils/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt"
import NextAuth from "next-auth/next"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prismaClient = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login"
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Dados de login necessários")
        }

        const user = await prismaClient.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          throw new Error("Usuário não encontrado")
        }

        const senhaCorreta = await bcrypt.compare(credentials.password, user.password)

        if (!senhaCorreta) {
          throw new Error("Senha incorreta")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      }
    })
  ],
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 