"use client";

import Image from "next/image";
import Link from "next/link";
import { motion,} from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Star, Users } from "lucide-react";

// Mock data - replace with your actual data source
const myData = {
  name: "NVS Book Store",
};

export default function HeroSection() {
  return (
    <motion.section
      className="relative w-full lg:min-h-[100vh] overflow-hidden bg-gradient-to-br from-slate-900 to-slate-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Blurred Background */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <Image
          src="/storeimage.jpg?height=1080&width=1920"
          alt="NVS Book Store Background"
          fill
          className="object-cover object-center blur-xs"
          priority
        />
        <div className="absolute inset-0" />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="space-y-6 sm:space-y-8 text-center max-w-3xl lg:max-w-4xl flex flex-col items-center">
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.8 }}
            >
              <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
              <span className="text-xs sm:text-sm text-white/90">
                Trusted by 10,000+ Students
              </span>
            </motion.div>

            <motion.h1
              className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
            >
              Welcome to{" "}
              <br/>
              {myData.name.split(" ").map((word, wordIndex) => (
                <span
                  key={wordIndex}
                  className="inline-block mr-2 text-transparent bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text"
                >
                  {word.split("").map((char, charIndex) => (
                    <motion.span
                      key={charIndex}
                      className="inline-block"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: (wordIndex * 6 + charIndex) * 0.2,
                        duration: 0.5,
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg text-center md:text-xl lg:text-2xl text-white/80 leading-relaxed"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Your trusted destination for study guides, competitive exam books,
              school textbooks, and more. We bring knowledge right to your
              doorstep.
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 lg:gap-8"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="flex items-center gap-2 text-white/90">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
                <span className="font-semibold text-sm sm:text-base">
                  5000+ Books
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
                <span className="font-semibold text-sm sm:text-base">
                  Happy Customers
                </span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0 shadow-2xl shadow-orange-500/25 text-sm sm:text-base"
                  asChild
                >
                  <Link href="/store">
                    Shop Now{" "}
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>
              </motion.div>
              {/* <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white/30 text-black dark:text-white hover:bg-white/10 backdrop-blur-sm text-sm sm:text-base"
                  asChild
                >
                  <Link href="/about">Learn More</Link>
                </Button>
              </motion.div> */}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-32 bg-gradient-to-t from-slate-900 to-transparent z-20" />
    </motion.section>
  );
}
