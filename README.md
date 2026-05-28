# Ho Chi Minh's Journey to National Salvation (1911–1930)

A full-stack responsive educational mini website exploring President Ho Chi Minh's quest to find the path for national salvation.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, TypeScript, TailwindCSS, Framer Motion |
| Backend | Node.js, Express |
| Database | PostgreSQL (MySQL schema also provided) |
| Auth | JWT (Login/Register) |
| Maps | Leaflet.js + OpenStreetMap |

## Project Structure

```
ho-chi-minh-journey/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/              # Pages (App Router)
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # Auth context
│   │   └── lib/              # API client, types
│   └── .env.example
├── backend/                  # Express API
│   ├── src/
│   │   ├── config/           # Database connection
│   │   ├── controllers/      # Route handlers
│   │   ├── middleware/       # Auth, validation, errors
│   │   ├── routes/           # API routes
│   │   └── database/         # Setup & seed script
│   └── .env.example
├── database/
│   ├── schema.sql            # PostgreSQL schema
│   └── schema.mysql.sql      # MySQL alternative
└── README.md
```

## Features

- **Homepage** – Hero, quote, introduction, smooth animations
- **Timeline** – Animated historical events (1890–1930) with modal details
- **Journey Map** – Interactive Leaflet map with country markers
- **Ideology** – Educational articles with search & bookmarks
- **Quiz** – Random questions, timer, scoring, leaderboard
- **Gallery** – Masonry layout with image modal preview
- **Auth** – JWT registration/login, protected profile & quiz history
- **UI** – Dark/light mode, red/white/gold palette, museum-style design

## Prerequisites

- Node.js 18+
- PostgreSQL 14+ (or MySQL 8+ if using MySQL schema)

## Setup

### 1. Clone and install dependencies

```bash
cd ho-chi-minh-journey
npm run install:all
```

### 2. Configure environment

**Backend** (`backend/.env`):

```env
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/hcm_journey
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`frontend/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Create database

```bash
# PostgreSQL
createdb hcm_journey

# Run schema and seed data
cd backend
npm run db:setup
```

### 4. Start development servers

```bash
# From project root - runs both frontend and backend
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/profile` | Get profile (auth) |
| GET | `/api/articles` | List articles (?search=) |
| GET | `/api/articles/:slug` | Get article |
| POST | `/api/articles/:id/bookmark` | Toggle bookmark (auth) |
| GET | `/api/timeline` | Timeline events |
| GET | `/api/journey` | Journey locations |
| GET | `/api/quiz/questions` | Random quiz questions |
| POST | `/api/quiz/submit` | Submit quiz (auth) |
| GET | `/api/quiz/leaderboard` | Leaderboard |
| GET | `/api/gallery` | Gallery images |

## Database Tables

- `users` – Authentication
- `articles` – Ideology content
- `timeline_events` – Historical timeline
- `journey_locations` – Map markers
- `quiz_questions` – Quiz bank
- `quiz_results` – Scores & history
- `gallery_images` – Photo gallery
- `bookmarks` – User article bookmarks

## Sample Data

Running `npm run db:setup` seeds:
- 6 timeline events (1890–1930)
- 6 journey locations
- 4 ideology articles
- 12 quiz questions
- 8 gallery images

## Production Build

```bash
cd frontend && npm run build && npm start
cd backend && npm start
```

## Notes

- Requirements mention MySQL; primary implementation uses **PostgreSQL** per tech stack. Use `database/schema.mysql.sql` for MySQL.
- Historical images use Unsplash placeholders for demonstration.
- Frontend includes fallback data when API is unavailable.

## License

Educational project – for learning purposes.
