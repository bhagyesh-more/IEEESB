"use client";

import { motion } from "framer-motion";
import React from "react";

interface HeroEntranceProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const HeroEntrance: React.FC<HeroEntranceProps> = ({
  children,
  delay = 0.2,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
