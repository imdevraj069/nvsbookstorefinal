"use client"

import Link from "next/link"
import { Calendar, ExternalLink, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { isNotificationNew } from "@/lib/data"

export default function NotificationCard({ notification, index = 0 }) {
  const { id, title, date, category, description, pdfUrl, applyUrl, websiteUrl } = notification

  // Format date
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  // Get badge color based on category
  const getBadgeVariant = (category) => {
    switch (category.toLowerCase()) {
      case "jobs":
        return "default"
      case "results":
        return "success"
      case "admit-cards":
        return "warning"
      case "admissions":
        return "info"
      case "other":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const isNew = isNotificationNew(date)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
    >
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        <div className="flex-grow">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant={getBadgeVariant(category)}>{category}</Badge>
            {isNew && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Badge variant="destructive" className="animate-pulse">
                  NEW
                </Badge>
              </motion.div>
            )}
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              {formattedDate}
            </div>
          </div>

          <Link href={`/notification/${id}`} className="hover:underline">
            <motion.h3
              className="text-lg font-semibold mb-2"
              whileHover={{ color: "hsl(var(--primary))" }}
              transition={{ duration: 0.2 }}
            >
              {title}
            </motion.h3>
          </Link>

          <p className="text-muted-foreground mb-4 line-clamp-2">{description}</p>

          <div className="flex flex-wrap gap-2">
            {applyUrl && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="sm" asChild>
                  <a href={applyUrl} target="_blank" rel="noopener noreferrer">
                    Apply Now
                  </a>
                </Button>
              </motion.div>
            )}

            {pdfUrl && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="sm" variant="outline" asChild>
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                    <FileText className="h-4 w-4 mr-1" /> View PDF
                  </a>
                </Button>
              </motion.div>
            )}

            {websiteUrl && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="sm" variant="outline" asChild>
                  <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-1" /> Official Website
                  </a>
                </Button>
              </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="sm" variant="ghost" asChild>
                <Link href={`/notification/${id}`}>Read More</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
