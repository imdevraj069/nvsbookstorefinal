"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"

export default function SignupForm({ onToggleMode }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Signup failed")

      const loginRes = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (loginRes.ok) router.push("/dashboard")
      else throw new Error("Auto-login failed")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = (provider) => {
    signIn(provider, { callbackUrl: "/dashboard" })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          placeholder="Enter your full name"
        />
      </div>

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
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          required
          placeholder="Enter your phone number"
        />
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          required
          placeholder="Enter your address"
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
          placeholder="Create a password"
        />
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
          placeholder="Confirm your password"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 dark:bg-red-950 p-3 rounded-md">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating Account..." : "Create Account"}
      </Button>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase text-muted-foreground">
          <span className="bg-background px-2">or sign up with</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => handleSocialLogin("google")}
        >
          <FcGoogle size={20} /> Google
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => handleSocialLogin("github")}
        >
          <FaGithub size={20} /> GitHub
        </Button>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={onToggleMode}
          className="text-sm text-primary hover:underline"
        >
          Already have an account? Sign in
        </button>
      </div>
    </form>
  )
}
