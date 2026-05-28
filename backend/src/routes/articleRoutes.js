import { Router } from 'express';
import {
  getArticles,
  getArticleBySlug,
  toggleBookmark,
  getBookmarks,
  getBookmarkStatus,
} from '../controllers/articleController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', getArticles);
router.get('/bookmarks/status', authenticate, getBookmarkStatus);
router.get('/bookmarks', authenticate, getBookmarks);
router.get('/:slug', getArticleBySlug);
router.post('/:articleId/bookmark', authenticate, toggleBookmark);

export default router;
