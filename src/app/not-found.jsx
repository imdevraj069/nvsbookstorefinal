import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/jobs">Browse Latest Jobs</Link>
        </Button>
      </div>
    </div>
  )
}
