import React from "react";
import { motion } from "framer-motion";

export const BackgroundBeams = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute h-full w-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--cyber-cyan)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--cyber-cyan)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--cyber-cyan)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.rect
          initial={{ x: "20%", y: "-100%" }}
          animate={{ y: "100%" }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
            delay: 1,
          }}
          width="1"
          height="100"
          fill="url(#beam-gradient)"
        />
        <motion.rect
          initial={{ x: "60%", y: "-100%" }}
          animate={{ y: "100%" }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
            delay: 3,
          }}
          width="1"
          height="150"
          fill="url(#beam-gradient)"
        />
        <motion.rect
          initial={{ x: "85%", y: "-100%" }}
          animate={{ y: "100%" }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
            delay: 5,
          }}
          width="1"
          height="80"
          fill="url(#beam-gradient)"
        />
      </svg>
    </div>
  );
};
