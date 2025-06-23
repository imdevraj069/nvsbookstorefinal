"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import Image from "next/image"

const loadingMessages = [
  "Curating stories just for you...",
  "Dusting off the shelves...",
  "Turning the first page...",
  "Brewing some bookish magic...",
  "Fetching literary treasures...",
]

export function LoadingScreen({ isLoading }) {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % loadingMessages.length)
      }, 2200)
      return () => clearInterval(interval)
    }
  }, [isLoading])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-gradient-to-br from-primary/10 to-background backdrop-blur-xl flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo & name */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center"
          >
            <div className="relative w-28 h-28 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Image
                src="/logo.png"
                alt="Nvs Logo"
                width={280}
                height={280}
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-primary to-ring bg-clip-text text-transparent mb-1">
              Nvs Book Store
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base italic">
              {loadingMessages[messageIndex]}
            </p>
          </motion.div>

          {/* Custom Book Loader */}
          <motion.div
            className="mt-10 flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.span
              className="text-4xl animate-pulse"
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              📚
            </motion.span>
            <motion.span
              className="text-lg text-primary font-semibold"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              Loading Books...
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
