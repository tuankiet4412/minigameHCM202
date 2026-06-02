import type { TimelineEvent } from '@/lib/types';
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
} from 'lucide-react';

export type TimelineCategory = 'all' | 'vietnam' | 'world' | 'politics' | 'organizations';

export type EnrichedTimelineEvent = TimelineEvent & {
  location: string;
  category: Exclude<TimelineCategory, 'all'>;
  icon: LucideIcon;
};

const ENRICHMENT: Record<
  number,
  Omit<EnrichedTimelineEvent, keyof TimelineEvent>
> = {
  1: { location: 'Kim Lien, Nghe An, Vietnam', category: 'vietnam', icon: Baby },
  2: { location: 'Saigon, Vietnam', category: 'vietnam', icon: Ship },
  3: { location: 'Versailles, France', category: 'politics', icon: ScrollText },
  4: { location: 'Tours, France', category: 'politics', icon: BookOpen },
  5: { location: 'Guangzhou, China', category: 'organizations', icon: Users },
  6: { location: 'Hong Kong', category: 'politics', icon: Flag },
};

export const FALLBACK_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 1,
    year: 1890,
    title: 'Birth of Ho Chi Minh',
    description: 'Born Nguyen Sinh Cung in Kim Lien village, Nghe An province.',
    details: 'Born into a patriotic scholar family that instilled early love of country and learning.',
    image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
  },
  {
    id: 2,
    year: 1911,
    title: 'Departure from Vietnam',
    description: 'Left Saigon aboard the Amiral Latouche-Tréville to seek national salvation.',
    details: 'The beginning of a thirty-year journey across continents to find a path for liberation.',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
  },
  {
    id: 7,
    year: 1912,
    title: 'Harlem, New York',
    description: 'Worked and observed the African-American struggle for equality in the United States.',
    details: 'Witnessed racial injustice and labor oppression, deepening his anti-colonial resolve.',
    image_url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
  },
  {
    id: 8,
    year: 1913,
    title: 'London Years',
    description: 'Worked as a baker and studied Western politics in England.',
    details: 'London exposed him to labor movements and the machinery of imperial power.',
    image_url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
  },
  {
    id: 9,
    year: 1917,
    title: 'Arrival in Paris',
    description: 'Settled in France as Nguyen Ai Quoc — Patriot of Vietnam.',
    details: 'Paris became the intellectual crucible for his revolutionary awakening.',
    image_url: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
  },
  {
    id: 3,
    year: 1919,
    title: 'Versailles Peace Conference',
    description: 'Submitted an eight-point petition demanding independence for Vietnam.',
    details: 'Presented the claims of the Vietnamese people to the world powers at Versailles.',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  },
  {
    id: 4,
    year: 1920,
    title: "Lenin's Thesis on National Liberation",
    description: 'Discovered the revolutionary path through Marxism-Leninism at Tours Congress.',
    details: 'Joined the French Communist Party, embracing proletarian internationalism.',
    image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
  },
  {
    id: 10,
    year: 1923,
    title: 'Communist University of the East',
    description: 'Studied revolutionary theory and strategy in Moscow.',
    details: 'Deepened Marxist-Leninist foundations and connected with the international movement.',
    image_url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80',
  },
  {
    id: 5,
    year: 1925,
    title: 'Revolutionary Youth League',
    description: 'Founded the league in Guangzhou to train future Vietnamese revolutionaries.',
    details: 'Established a cadre school that shaped an entire generation of leaders.',
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
  },
  {
    id: 11,
    year: 1927,
    title: 'Training Revolutionary Cadres',
    description: 'Organized underground networks and political education across Southeast Asia.',
    details: 'Built the organizational infrastructure for a nationwide revolutionary movement.',
    image_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
  },
  {
    id: 12,
    year: 1929,
    title: 'Unification of Communist Groups',
    description: 'Worked to unify scattered communist organizations across Indochina.',
    details: 'Laid groundwork for a single revolutionary party capable of leading the nation.',
    image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
  },
  {
    id: 6,
    year: 1930,
    title: 'Founding of the Communist Party of Vietnam',
    description: 'Unified communist organizations and founded the CPV in Hong Kong.',
    details: 'The decisive milestone — transforming vision into an organized revolutionary force.',
    image_url: 'https://images.unsplash.com/photo-1518005020951-eccb994ad75d?w=800&q=80',
  },
];

const EXTRA_ENRICHMENT: Record<number, Omit<EnrichedTimelineEvent, keyof TimelineEvent>> = {
  7: { location: 'Harlem, New York, USA', category: 'world', icon: Landmark },
  8: { location: 'London, England', category: 'world', icon: Landmark },
  9: { location: 'Paris, France', category: 'world', icon: Landmark },
  10: { location: 'Moscow, Soviet Union', category: 'world', icon: GraduationCap },
  11: { location: 'Guangzhou, China', category: 'organizations', icon: Building2 },
  12: { location: 'Southeast Asia', category: 'organizations', icon: Star },
};

export function enrichTimelineEvents(events: TimelineEvent[]): EnrichedTimelineEvent[] {
  return events
    .map((event) => {
      const meta = ENRICHMENT[event.id] ?? EXTRA_ENRICHMENT[event.id] ?? {
        location: 'Vietnam',
        category: 'vietnam' as const,
        icon: Landmark,
      };
      return { ...event, ...meta };
    })
    .sort((a, b) => a.year - b.year);
}

export const TIMELINE_STATS = {
  years: 40,
  countries: 6,
  distanceKm: 20000,
  events: 12,
  totalMilestones: 12,
};

export const TIMELINE_QUOTE = {
  text: 'Nothing is more precious than independence and freedom.',
  author: 'Ho Chi Minh',
};

export const CATEGORY_LABELS: Record<TimelineCategory, string> = {
  all: 'All Events',
  vietnam: 'Vietnam',
  world: 'World',
  politics: 'Politics',
  organizations: 'Organizations',
};
