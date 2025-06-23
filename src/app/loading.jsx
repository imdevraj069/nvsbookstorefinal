"use client"

import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
    </div>
  )
}