'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-label="Loading">
      <motion.div
        className="h-12 w-12 rounded-full border-4 border-heritage-gold border-t-heritage-red"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
