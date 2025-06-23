"use client";

import Link from "next/link";
import {
  Briefcase,
  GraduationCap,
  Laptop,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { motion } from "motion/react";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa"; // make sure to install react-icons

const categories = [
  {
    title: "Government Jobs",
    description: "Latest job notifications from central and state governments",
    icon: Briefcase,
    href: "/notifications/jobs",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient:
      "from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50",
    iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
    count: "500+ Jobs",
  },
  {
    title: "Exam Results",
    description: "Check your results for various competitive exams",
    icon: GraduationCap,
    href: "/notifications/results",
    gradient: "from-emerald-500 to-teal-500",
    bgGradient:
      "from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50",
    iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
    count: "Latest Results",
  },
  {
    title: "Laptops",
    description: "Affordable laptops for students and professionals",
    icon: Laptop,
    href: "/notifications/laptops",
    gradient: "from-purple-500 to-pink-500",
    bgGradient:
      "from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50",
    iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",
    count: "Best Deals",
  },
  {
    title: "Study Materials",
    description: "Quality books, notes and test series for exam preparation",
    icon: BookOpen,
    href: "/store",
    gradient: "from-orange-500 to-red-500",
    bgGradient:
      "from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50",
    iconBg: "bg-gradient-to-br from-orange-500 to-red-500",
    count: "5000+ Books",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

export default function CategoryHighlights() {
  return (
    <section className="py-6 sm:py-8 lg:py-8 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          className="text-center mb-4 sm:mb-4"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 border border-orange-200 dark:border-orange-800 mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <BookOpen className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Popular Categories</span>
          </motion.div> */}
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          className="grid grid-cols-4 auto-rows-fr sm:grid-cols-4 gap-2 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              variants={itemVariants}
              whileHover={{
                y: -8,
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
              whileTap={{ scale: 0.98 }}
              // className={`bg-gradient-to-br ${category.bgGradient} rounded-xl h-full sm:rounded-2xl`}
            >
              <Link href={category.href} className="block group">
                <div
                  className={`relative overflow-hidden rounded-xl h-full sm:rounded-2xl p-4 sm:p-6
                  
                    border border-white/20 dark:border-slate-700/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50`}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5 dark:opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center h-full min-h-[6rem]">
                    {/* Icon */}
                    <motion.div
                      className={`${category.iconBg} p-2 sm:p-4 rounded-2xl w-10 h-10 lg:w-16 lg:h-16 flex items-center justify-center mb-6 shadow-lg`}
                      whileHover={{
                        rotate: [0, -10, 10, -5, 0],
                        scale: 1.1,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <category.icon className="w-4 h-4 lg:w-8 lg:h-8 text-white" />
                    </motion.div>
                    {/* Title */}
                    <h3 className="text-xs text-center sm:text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-slate-900 group-hover:to-slate-600 dark:group-hover:from-white dark:group-hover:to-slate-300 transition-all duration-300">
                      {category.title}
                    </h3>
                  </div>

                  {/* Hover Glow Effect */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl sm:rounded-3xl`}
                    initial={false}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-6 sm:mt-8"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg font-medium">
            Can't find what you're looking for? Reach out to us!
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
            {/* WhatsApp Button */}
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://wa.me/yourNumber" // replace with your number
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white dark:text-white rounded-full font-medium hover:shadow-lg transition-all duration-300"
            >
              <FaWhatsapp className="w-5 h-5" />
              WhatsApp Channel
            </motion.a>

            {/* Telegram Button */}
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://t.me/yourChannelUsername" // replace with your Telegram link
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white dark:text-white rounded-full font-medium hover:shadow-lg transition-all duration-300"
            >
              <FaTelegramPlane className="w-5 h-5" />
              Telegram Channel
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
