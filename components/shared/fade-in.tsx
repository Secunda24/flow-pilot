"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function FadeIn({
  children,
  delay = 0,
  className
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
