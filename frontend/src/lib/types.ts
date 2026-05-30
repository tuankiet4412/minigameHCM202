export interface User {
  id: number;
  username: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
}

export interface Article {
  id: number;
  slug: string;
  title: string;
  summary: string;
  content?: string;
  key_points?: string[];
  historical_context?: string;
  image_url?: string;
  category?: string;
}

export interface TimelineEvent {
  id: number;
  year: number;
  title: string;
  description: string;
  details?: string;
  image_url?: string;
}

export interface JourneyLocation {
  id: number;
  country: string;
  country_code?: string;
  latitude: number;
  longitude: number;
  description: string;
  period?: string;
  image_url?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  category?: string;
  difficulty?: string;
}

export interface CaroQuestion {
  id: number;
  question: string;
  options: string[];
  category?: string;
  difficulty?: string;
}

export interface CaroMatch {
  result: 'win' | 'lose' | 'draw';
  duration_seconds: number;
  created_at: string;
}

export interface CaroLeaderboardEntry {
  username: string;
  display_name?: string;
  duration_seconds: number;
  created_at: string;
}

export interface GalleryImage {
  id: number;
  title: string;
  description?: string;
  image_url: string;
  year?: number;
  category?: string;
}

export interface QuizResult {
  score: number;
  total_questions: number;
  time_taken?: number;
  percentage?: number;
  created_at: string;
}
