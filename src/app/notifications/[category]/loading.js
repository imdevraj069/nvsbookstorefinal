"use client";

import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-[60vh] w-full gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Loader2 className="animate-spin text-primary h-12 w-12" />
      <div className="text-center">
        <h2 className="text-lg font-semibold">Loading notifications...</h2>
        <p className="text-sm text-muted-foreground">
          Hang tight while we fetch the latest updates in this category.
        </p>
      </div>
    </motion.div>
  );
}
