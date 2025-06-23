"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell } from "lucide-react"

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
      setEmail("")

      // Reset success message after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000)
    }, 1000)
  }

  return (
    <div className="py-12 my-8 bg-muted/30 rounded-lg">
      <div className="max-w-2xl mx-auto text-center px-4">
        <Bell className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-muted-foreground mb-6">
          Subscribe to our newsletter to receive the latest government notifications, job alerts, and exam updates
          directly in your inbox.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-grow"
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>

        {isSuccess && (
          <p className="mt-4 text-green-600 dark:text-green-400">
            Thank you for subscribing! You'll receive updates soon.
          </p>
        )}

        <p className="text-xs text-muted-foreground mt-4">
          By subscribing, you agree to our Privacy Policy and Terms of Service.
        </p>
      </div>
    </div>
  )
}
