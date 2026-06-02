'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4" role="status" aria-label="Loading">
      <div className="relative">
        <motion.div
          className="h-14 w-14 rounded-full border-2 border-heritage-gold/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-1 rounded-full border-2 border-t-heritage-red border-r-transparent border-b-transparent border-l-transparent"
          animate={{ rotate: -360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <p className="text-sm text-muted-foreground">Loading experience...</p>
      <span className="sr-only">Loading</span>
    </div>
  );
}
