'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Sparkles, Landmark, Flag } from 'lucide-react';
import type { EnrichedJourneyLocation } from '@/lib/journey-enrichment';
import { countryLabelVi } from '@/lib/journey-enrichment';
import LuxuryPanel, { LuxuryDivider } from '@/components/journey/LuxuryPanel';

const cardVariants = {
  hidden: { opacity: 0, x: -20, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, staggerChildren: 0.07 },
  },
  exit: { opacity: 0, x: 16, filter: 'blur(4px)', transition: { duration: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function CountryInfoPanel({
  location,
}: {
  location: EnrichedJourneyLocation | null;
}) {
  const active = location ?? null;

  return (
    <LuxuryPanel label="Chương" title="Hồ sơ quốc gia" className="group">
      <div className="flex-1 overflow-y-auto p-5 md:p-6">
        <AnimatePresence mode="wait">
          {active ? (
            <motion.div
              key={active.country}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-5"
            >
              <motion.div variants={itemVariants} className="relative">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-[#D4AF37]/25 shadow-[0_0_40px_rgba(212,175,55,0.12)]">
                  <Image
                    src={active.defaultImage}
                    alt={active.country}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-[#FFD700]/30 bg-black/60 px-3 py-1.5 backdrop-blur-md">
                    <Image
                      src={`https://flagcdn.com/w40/${active.flagCode}.png`}
                      alt=""
                      width={24}
                      height={16}
                      className="rounded-sm shadow-sm"
                    />
                    <span className="text-xs font-medium text-[#FFD700]">{countryLabelVi(active.country)}</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="flex items-center gap-1.5 text-xs text-[#D4AF37]/80">
                      <MapPin className="h-3.5 w-3.5" />
                      {Number(active.latitude).toFixed(2)}°N, {Math.abs(Number(active.longitude)).toFixed(2)}°{Number(active.longitude) >= 0 ? 'E' : 'W'}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-2xl font-bold tracking-tight text-white">{countryLabelVi(active.country)}</h3>
                    <p className="mt-1.5 flex items-center gap-2 text-sm text-[#FFD700]">
                      <Calendar className="h-4 w-4" />
                      {active.yearLabel}
                    </p>
                  </div>
                  <span className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#FFD700]">
                    Điểm dừng {active.order + 1}
                  </span>
                </div>
              </motion.div>

              <LuxuryDivider />

              <motion.div variants={itemVariants} className="rounded-2xl border border-[#D4AF37]/15 bg-[#101010]/80 p-4">
                <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                  <Landmark className="h-3.5 w-3.5" />
                  Bối cảnh lịch sử
                </p>
                <p className="mt-2.5 text-sm leading-relaxed text-gray-300">{active.historicalContext}</p>
              </motion.div>

              <motion.div variants={itemVariants}>
                <p className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Sự kiện chính
                </p>
                <ul className="space-y-2">
                  {active.keyEvents.map((event, i) => (
                    <motion.li
                      key={event}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.06 }}
                      className="group/event flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3.5 py-2.5 transition-colors hover:border-[#D4AF37]/25 hover:bg-[#D4AF37]/5"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FFD700] shadow-[0_0_8px_#FFD700]" />
                      <span className="text-sm text-gray-300">{event}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={itemVariants} className="rounded-2xl border border-[#FFD700]/20 bg-gradient-to-br from-[#D4AF37]/10 to-transparent p-4">
                <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#FFD700]">
                  <Flag className="h-3.5 w-3.5" />
                  Ý nghĩa với hành trình
                </p>
                <p className="mt-2.5 text-sm italic leading-relaxed text-gray-200">{active.impactOnJourney}</p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full min-h-[320px] flex-col items-center justify-center text-center"
            >
              <div className="relative">
                <div className="h-20 w-20 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 shadow-[0_0_30px_rgba(212,175,55,0.2)]" />
                <div className="absolute inset-0 animate-ping rounded-full border border-[#FFD700]/20" style={{ animationDuration: '2s' }} />
              </div>
              <p className="mt-6 font-display text-lg text-white">Chưa chọn</p>
              <p className="mt-2 max-w-[220px] text-sm text-gray-500">
                Chọn một điểm vàng trên bản đồ để mở câu chuyện quốc gia
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LuxuryPanel>
  );
}
