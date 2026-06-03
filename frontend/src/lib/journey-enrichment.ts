import type { JourneyLocation } from '@/lib/types';

export const JOURNEY_ORDER = [
  'Vietnam',
  'USA',
  'England',
  'France',
  'Soviet Union',
  'China',
] as const;

export type EnrichedJourneyLocation = JourneyLocation & {
  order: number;
  yearLabel: string;
  keyEvents: string[];
  historicalContext: string;
  impactOnJourney: string;
  flagCode: string;
  defaultImage: string;
};

const ENRICHMENT: Record<
  string,
  Omit<EnrichedJourneyLocation, keyof JourneyLocation | 'order'>
> = {
  Vietnam: {
    yearLabel: '1890 – 1911',
    flagCode: 'vn',
    keyEvents: [
      'Born in Nghe An province',
      'Early patriotic education',
      'Departed Saigon — June 1911',
    ],
    historicalContext:
      'Nguyen Tat Thanh left Vietnam aboard the Amiral Latouche-Tréville, beginning a thirty-year quest to find a path for national salvation.',
    impactOnJourney: 'The point of departure — where love of country became a lifelong mission across continents.',
    defaultImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
  },
  USA: {
    yearLabel: '1912 – 1913',
    flagCode: 'us',
    keyEvents: [
      'Worked in Harlem, New York',
      'Observed African-American struggle',
      'Strengthened anti-colonial resolve',
    ],
    historicalContext:
      'In the United States he witnessed inequality and oppression, deepening his commitment to liberation for all peoples.',
    impactOnJourney: 'Broadened his understanding of racial injustice and the global dimensions of liberation.',
    defaultImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
  },
  England: {
    yearLabel: '1913 – 1917',
    flagCode: 'gb',
    keyEvents: [
      'Worked as a baker in London',
      'Studied Western politics',
      'Joined political organizations',
    ],
    historicalContext:
      'London exposed him to labour movements and colonial politics, shaping his understanding of imperial power structures.',
    impactOnJourney: 'Revealed the mechanics of empire and the power of organized labour movements.',
    defaultImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
  },
  France: {
    yearLabel: '1917 – 1923',
    flagCode: 'fr',
    keyEvents: [
      'Versailles petition — 1919',
      'Joined French Communist Party — 1920',
      'Organized overseas Vietnamese',
    ],
    historicalContext:
      'As Nguyen Ai Quoc in Paris, he demanded independence for Vietnam and discovered Marxism-Leninism as the path to liberation.',
    impactOnJourney: 'The ideological turning point — from patriot to revolutionary leader.',
    defaultImage: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
  },
  'Soviet Union': {
    yearLabel: '1923 – 1924',
    flagCode: 'ru',
    keyEvents: [
      'Studied at Communist University',
      'Deepened Marxist-Leninist theory',
      'Prepared revolutionary cadres',
    ],
    historicalContext:
      'Moscow provided rigorous political training and connected him to the international communist movement.',
    impactOnJourney: 'Forged the theoretical foundation for Vietnam\'s revolutionary strategy.',
    defaultImage: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80',
  },
  China: {
    yearLabel: '1924 – 1930',
    flagCode: 'cn',
    keyEvents: [
      'Founded Revolutionary Youth League — 1925',
      'Trained future leaders in Guangzhou',
      'Founded Communist Party of Vietnam — 1930',
    ],
    historicalContext:
      'China became the strategic base for organizing revolution — culminating in the founding of the Communist Party of Vietnam.',
    impactOnJourney: 'The culmination — transforming vision into an organized revolutionary force.',
    defaultImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
  },
};

export function enrichLocations(locations: JourneyLocation[]): EnrichedJourneyLocation[] {
  const byCountry = new Map(locations.map((l) => [l.country, l]));

  return JOURNEY_ORDER.map((country, order) => {
    const raw = byCountry.get(country) ?? {
      id: order + 1,
      country,
      latitude: 0,
      longitude: 0,
      description: '',
      period: ENRICHMENT[country]?.yearLabel,
    };
    // PostgreSQL DECIMAL columns are returned as strings by the pg driver.
    // Coerce to numbers here so all downstream code (Three.js math, .toFixed, etc.) is safe.
    const base = {
      ...raw,
      latitude: typeof raw.latitude === 'string' ? parseFloat(raw.latitude) : Number(raw.latitude),
      longitude: typeof raw.longitude === 'string' ? parseFloat(raw.longitude) : Number(raw.longitude),
    };
    const meta = ENRICHMENT[country];
    return {
      ...base,
      order,
      yearLabel: meta.yearLabel,
      keyEvents: meta.keyEvents,
      historicalContext: meta.historicalContext,
      impactOnJourney: meta.impactOnJourney,
      flagCode: meta.flagCode,
      defaultImage: base.image_url ?? meta.defaultImage,
      description: base.description || meta.historicalContext,
      period: base.period ?? meta.yearLabel,
    };
  });
}

export const JOURNEY_STATS = {
  countries: 6,
  durationYears: 19,
  distanceKm: 85000,
  events: 12,
  legacyScore: 100,
};
