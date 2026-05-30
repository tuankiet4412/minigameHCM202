import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import timelineRoutes from './routes/timelineRoutes.js';
import journeyRoutes from './routes/journeyRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import caroRoutes from './routes/caroRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Ho Chi Minh Journey API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/journey', journeyRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/caro', caroRoutes);
app.use('/api/gallery', galleryRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
