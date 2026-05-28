import { Router } from 'express';
import {
  getRandomQuestions,
  submitQuiz,
  getLeaderboard,
  getUserQuizHistory,
} from '../controllers/quizController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/questions', getRandomQuestions);
router.get('/leaderboard', getLeaderboard);
router.post('/submit', authenticate, submitQuiz);
router.get('/history', authenticate, getUserQuizHistory);

export default router;
