'use client';

import type { LucideIcon } from 'lucide-react';
import {
  Baby,
  Ship,
  Landmark,
  BookOpen,
  ScrollText,
  Flag,
  GraduationCap,
  Users,
  Building2,
  Star,
  Swords,
  Megaphone,
  Heart,
  Crown,
  Flame,
  FileText,
  Shield,
  Globe,
  Sparkles,
} from 'lucide-react';
import type { TimelineIconKey } from '@/lib/timeline-enrichment';

export const TIMELINE_ICON_MAP: Record<TimelineIconKey, LucideIcon> = {
  baby: Baby,
  ship: Ship,
  landmark: Landmark,
  book: BookOpen,
  scroll: ScrollText,
  flag: Flag,
  graduation: GraduationCap,
  users: Users,
  building: Building2,
  star: Star,
  swords: Swords,
  megaphone: Megaphone,
  heart: Heart,
  crown: Crown,
  flame: Flame,
  filetext: FileText,
  shield: Shield,
  globe: Globe,
  sparkles: Sparkles,
};

export function getTimelineIcon(key: TimelineIconKey): LucideIcon {
  return TIMELINE_ICON_MAP[key] ?? Landmark;
}
