import { Router } from 'express';
import { getRandomQuestion, verifyAnswer, createMatch, getUserMatches, getLeaderboard } from '../controllers/caroController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/question', getRandomQuestion);
router.post('/verify', verifyAnswer);
router.post('/matches', authenticate, createMatch);
router.get('/matches', authenticate, getUserMatches);
router.get('/leaderboard', getLeaderboard);

export default router;
