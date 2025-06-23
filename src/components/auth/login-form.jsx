"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"

export default function LoginForm({ onToggleMode }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === "checkbox" ? checked : value
    setFormData((prev) => ({ ...prev, [name]: newValue }))
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
      rememberMe: formData.rememberMe,
    })

    if (result?.ok) {
      router.push("/dashboard")
    } else {
      setError(result?.error || "Login failed")
    }

    setLoading(false)
  }

  const handleOAuthLogin = (provider) => {
    signIn(provider, {
      callbackUrl: "/", // Change if you want to go elsewhere
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
        id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          placeholder="Enter your email"
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          required
          placeholder="Enter your password"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="rememberMe"
          name="rememberMe"
          type="checkbox"
          checked={formData.rememberMe}
          onChange={handleInputChange}
        />
        <Label htmlFor="rememberMe">Remember Me</Label>
      </div>

      {error && <div className="text-red-600 text-sm bg-red-50 dark:bg-red-950 p-3 rounded-md">{error}</div>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing In..." : "Sign In"}
      </Button>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase text-muted-foreground">
          <span className="bg-background px-2">or sign in with</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => handleOAuthLogin("google")}
        >
          <FcGoogle size={20} /> Google
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => handleOAuthLogin("github")}
        >
          <FaGithub size={20} /> GitHub
        </Button>
      </div>

      <div className="text-center">
        <button type="button" onClick={onToggleMode} className="text-sm text-primary hover:underline">
          Don't have an account? Sign up
        </button>
      </div>
    </form>
  )
}
