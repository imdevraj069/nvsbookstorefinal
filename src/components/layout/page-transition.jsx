"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { LoadingScreen } from "./loading-screen"

export default function PageTransition({ children }) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)

  // Handle route changes
  useEffect(() => {
    setIsLoading(true)

    // Store the current children
    setDisplayChildren(children)

    // Simulate page loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [pathname, children])

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {displayChildren}
      </motion.div>
    </>
  )
}
