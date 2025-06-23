"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import LoginForm from "@/components/auth/login-form"
import SignupForm from "@/components/auth/signup-form"
import Image from "next/image"

export default function AuthPage() {
  const [mode, setMode] = useState("login")
  const router = useRouter()
  const { data: session, status } = useSession()

  // Redirect to dashboard if user is authenticated
  // useEffect(() => {
  //   if (status === "authenticated") {
  //     router.push("/dashboard")
  //   }
  // }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-md">
        <div className="bg-background border border-border rounded-lg shadow-lg px-8 pb-8 pt-2">
          <div className="text-center mb-8 flex flex-col items-center">
            <Image src="/logo.png" alt="Logo" width={150} height={150}></Image>
            <p className="text-muted-foreground mt-2">
              {mode === "login" ? "Welcome back!" : "Create your account"}
            </p>
          </div>

          {mode === "login" ? (
            <LoginForm onToggleMode={() => setMode("signup")} />
          ) : (
            <SignupForm onToggleMode={() => setMode("login")} />
          )}
        </div>
      </div>
    </div>
  )
}
