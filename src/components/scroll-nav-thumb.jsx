"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ScrollNavThumb() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [thumbPosition, setThumbPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(scrollPercent);
      setThumbPosition((scrollPercent / 100) * (window.innerHeight - 60));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleThumbDrag = (e) => {
    setIsDragging(true);
    handleThumbPosition(e);
  };

  const handleThumbPosition = (e) => {
    if (!isDragging) return;

    const scrollBar = e.currentTarget;
    const rect = scrollBar.getBoundingClientRect();
    const y = e.clientY - rect.top;

    const newPosition = Math.max(0, Math.min(y, window.innerHeight - 60));
    setThumbPosition(newPosition);

    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (newPosition / (window.innerHeight - 60)) * 100;
    window.scrollTo({
      top: (scrollPercent / 100) * docHeight,
      behavior: "smooth",
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleThumbPosition);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleThumbPosition);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div className="hidden xl:fixed xl:right-4 xl:top-1/2 xl:-translate-y-1/2 xl:flex xl:flex-col xl:items-center xl:z-40">
      {/* Scroll Bar Track */}
      <div className="relative w-1 h-64 bg-border rounded-full overflow-hidden">
        {/* Progress Bar */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-primary to-primary/50"
          animate={{ height: `${scrollProgress}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 30 }}
        />

        {/* Draggable Thumb */}
        <motion.div
          className={`absolute -left-1.5 top-0 w-4 h-16 bg-primary rounded-full shadow-lg cursor-grab active:cursor-grabbing ${
            isDragging ? "ring-2 ring-primary ring-offset-2" : ""
          }`}
          drag="y"
          dragConstraints={{
            top: 0,
            bottom: window.innerHeight - 60,
          }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          onDrag={(e, { offset }) => {
            const newPosition = Math.max(
              0,
              Math.min(offset.y, window.innerHeight - 60)
            );
            const docHeight =
              document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (newPosition / (window.innerHeight - 60)) * 100;
            window.scrollTo({
              top: (scrollPercent / 100) * docHeight,
              behavior: "auto",
            });
          }}
          style={{ y: thumbPosition }}
          whileHover={{ scale: 1.2 }}
          whileDrag={{ scale: 1.3 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>

      {/* Scroll Percentage */}
      <motion.div
        className="mt-4 text-xs font-semibold text-primary"
        animate={{ opacity: isDragging ? 1 : 0.6 }}
      >
        {Math.round(scrollProgress)}%
      </motion.div>
    </div>
  );
}
