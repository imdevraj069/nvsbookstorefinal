import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import User from "@/models/user"
import connectDB from "@/lib/dbConnect"

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberme: { label: "Remember me", type: "checkbox" },
      },
      async authorize(credentials) {
        const { email, password, rememberme } = credentials

        await connectDB()

        const user = await User.findOne({ email })
        if (!user) throw new Error("User not found")

        if (user.password == null) {
          throw new Error(`Your account is authenticated via ${user.authtype}. Please use that method to login`)
        }

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) throw new Error("Invalid email or password")

        return {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          rememberme: rememberme === "true",
          image: user.image,
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, account, profile }) {
      await connectDB()

      if (user) {
        token.id = user.id || user._id?.toString()
        token.email = user.email
        token.role = user.role || "user"
        token.image = user.image || ""
        token.rememberme = user.rememberme || false

        if (token.rememberme) {
          const now = Math.floor(Date.now() / 1000)
          token.exp = now + 60 * 60 * 24 * 30
        }
        
        token.exp = null
      }

      if (
        account &&
        (account.provider === "google" || account.provider === "github")
      ) {
        const existingUser = await User.findOne({ email: token.email })

        if (!existingUser) {
          const name = profile?.name || token.name
          const image = profile?.picture || profile?.avatar_url || token.image || null

          const adminEmails = [
            "nvsbookstore@gmail.com",
            "devrajiit46@gmail.com",
            "scholarx.main@gmail.com",
          ]

          const assignedRole = adminEmails.includes(token.email) ? "admin" : "user"

          const newUser = await User.create({
            name,
            email: token.email,
            image,
            authtype: account.provider,
            role: assignedRole,
            isVerified: true,
          })

          token.id = newUser._id
          token.role = newUser.role

          const now = Math.floor(Date.now() / 1000)
          token.exp = now + 60 * 60 * 1
        } else {
          token.id = existingUser._id
          token.role = existingUser.role

          const now = Math.floor(Date.now() / 1000)
          token.exp = now + 60 * 60 * 24 * 30
        }
      }

      return token
    },

    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.email = token.email
        session.user.image = token.image
        session.user.rememberme = token.rememberme ?? false
      }

      if (token?.exp) {
        session.expires = new Date(token.exp * 1000).toISOString()
      }

      return session
    },
  },

  pages: {
    signIn: "auth/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
}
