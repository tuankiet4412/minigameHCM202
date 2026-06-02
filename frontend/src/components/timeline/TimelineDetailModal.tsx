'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar } from 'lucide-react';
import type { EnrichedTimelineEvent } from '@/lib/timeline-enrichment';

export default function TimelineDetailModal({
  event,
  onClose,
}: {
  event: EnrichedTimelineEvent | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {event && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]/80 p-4 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="timeline-modal-title"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[24px] border border-[#D4A74E]/25 bg-[#0B0B0B]/95 shadow-[0_32px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {event.image_url && (
              <div className="relative h-56 w-full overflow-hidden rounded-t-[24px] md:h-64">
                <Image
                  src={event.image_url}
                  alt={event.title}
                  fill
                  className="object-cover sepia-[0.2]"
                  sizes="672px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] to-transparent" />
              </div>
            )}

            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-[#A31212] to-[#D62828] px-3 py-1 text-sm font-bold text-white">
                    <Calendar className="h-3.5 w-3.5" />
                    {event.year}
                  </span>
                  <h2 id="timeline-modal-title" className="mt-4 font-display text-2xl font-bold text-[#F5C76B] md:text-3xl">
                    {event.title}
                  </h2>
                  <p className="mt-2 flex items-center gap-2 text-sm text-[#E6B85C]">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-[#D4A74E]/20 p-2 text-[#A8A8A8] transition-colors hover:border-[#D4A74E]/40 hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="mt-6 text-base leading-relaxed text-[#D9D9D9]">{event.description}</p>
              {event.details && (
                <p className="mt-4 text-sm leading-relaxed text-[#A8A8A8]">{event.details}</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
