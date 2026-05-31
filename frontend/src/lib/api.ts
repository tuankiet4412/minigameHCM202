const getApiUrl = (): string => {
  let url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    url = process.env.NODE_ENV === 'production' 
      ? 'https://minigamehcm202.onrender.com/api' 
      : 'http://localhost:5000/api';
  }
  
  // Remove trailing slash if present
  url = url.replace(/\/$/, '');
  
  // Append /api if not already present at the end of the URL
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }
  
  return url;
};

const API_URL = getApiUrl();


export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return res.json();
}

export const api = {
  auth: {
    register: (data: object) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: object) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    profile: () => apiFetch('/auth/profile'),
    updateProfile: (data: object) => apiFetch('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
  },
  articles: {
    list: (params?: string) => apiFetch(`/articles${params ? `?${params}` : ''}`),
    get: (slug: string) => apiFetch(`/articles/${slug}`),
    bookmarks: () => apiFetch('/articles/bookmarks'),
    bookmarkStatus: () => apiFetch<number[]>('/articles/bookmarks/status'),
    toggleBookmark: (id: number) => apiFetch(`/articles/${id}/bookmark`, { method: 'POST' }),
  },
  timeline: {
    list: () => apiFetch('/timeline'),
    get: (id: number) => apiFetch(`/timeline/${id}`),
  },
  journey: {
    list: () => apiFetch('/journey'),
  },
  quiz: {
    questions: (count = 10) => apiFetch(`/quiz/questions?count=${count}`),
    submit: (data: object) => apiFetch('/quiz/submit', { method: 'POST', body: JSON.stringify(data) }),
    leaderboard: () => apiFetch('/quiz/leaderboard'),
    history: () => apiFetch('/quiz/history'),
  },
  caro: {
    question: () => apiFetch('/caro/question'),
    verify: (data: object) => apiFetch('/caro/verify', { method: 'POST', body: JSON.stringify(data) }),
    createMatch: (data: object) => apiFetch('/caro/matches', { method: 'POST', body: JSON.stringify(data) }),
    matches: (limit = 20) => apiFetch(`/caro/matches?limit=${limit}`),
    leaderboard: (limit = 10) => apiFetch(`/caro/leaderboard?limit=${limit}`),
  },
  gallery: {
    list: () => apiFetch('/gallery'),
  },
};
