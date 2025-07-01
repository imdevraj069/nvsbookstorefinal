"use client";

import Link from "next/link";
import { Briefcase, GraduationCap, IdCard, Store, Frame } from "lucide-react";
import { motion } from "motion/react";
import {
  FaWhatsapp,
  FaTelegramPlane,
  FaInstagram,
  FaYoutube,
  FaFacebookF,
} from "react-icons/fa"; // make sure to install react-icons

const categories = [
  {
    title: "Jobs",
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
    title: "Photo Frames",
    description: "Get Your Customised photo Frames",
    icon: Frame,
    href: "/store?photo-frame",
    gradient: "from-emerald-500 to-teal-500",
    bgGradient:
      "from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50",
    iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
    count: "Latest Results",
  },
  {
    title: "Store",
    description: "Affordable laptops for students and professionals",
    icon: Store,
    href: "/store",
    gradient: "from-purple-500 to-pink-500",
    bgGradient:
      "from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50",
    iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",
    count: "Best Deals",
  },
  {
    title: "PVC Card",
    description: "Quality books, notes and test series for exam preparation",
    icon: IdCard,
    href: "/pvc",
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

const socials = [
  {
    name: "WhatsApp",
    icon: <FaWhatsapp className="w-4 h-4 sm:w-5 sm:h-5" />,
    href: "https://chat.whatsapp.com/KrdsIPFJVD9JFhoQ09Bt2L",
    colors: "from-green-500 to-green-700",
  },
  {
    name: "Instagram",
    icon: <FaInstagram className="w-4 h-4 sm:w-5 sm:h-5" />,
    href: "https://www.instagram.com/abhi_kumar_nvs",
    colors: "from-pink-500 to-pink-700",
  },
  {
    name: "Telegram",
    icon: <FaTelegramPlane className="w-4 h-4 sm:w-5 sm:h-5" />,
    href: "https://t.me/nvsonlinecenter",
    colors: "from-blue-500 to-blue-700",
  },
  {
    name: "YouTube",
    icon: <FaYoutube className="w-4 h-4 sm:w-5 sm:h-5" />,
    href: "https://www.youtube.com/@moryatutorial507",
    colors: "from-red-500 to-red-700",
  },
  {
    name: "Facebook",
    icon: <FaFacebookF className="w-4 h-4 sm:w-5 sm:h-5" />,
    href: "https://www.facebook.com/profile.php?id=100011305176996",
    colors: "from-blue-600 to-blue-800",
  },
];

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
        ></motion.div>

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
            >
              <Link href={category.href} className="block group">
                <div
                  className={`relative overflow-hidden rounded-xl h-full sm:rounded-2xl p-4 lg:p-6
                  
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
                      className={`${category.iconBg} p-2 lg:p-4 rounded-2xl w-10 h-10 lg:w-16 lg:h-16 flex items-center justify-center mb-6 shadow-lg`}
                      whileHover={{
                        rotate: [0, -10, 10, -5, 0],
                        scale: 1.1,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <category.icon className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
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
          className="text-center mt-4 sm:mt-6"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm lg:text-lg font-medium">
            Can't find what you're looking for? Reach out to us!
          </p>

          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 mb-12">
            {socials.map(({ name, icon, href, colors }, idx) => (
              <motion.a
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-3 py-2 sm:px-5 sm:py-3 bg-gradient-to-r ${colors} text-white rounded-md sm:rounded-full text-xs sm:text-sm font-medium hover:shadow-lg transition-all duration-300`}
              >
                {icon}
                <span className="hidden sm:inline">{name}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
