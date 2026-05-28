import { Router } from 'express';
import { getTimelineEvents, getTimelineEvent } from '../controllers/timelineController.js';

const router = Router();

router.get('/', getTimelineEvents);
router.get('/:id', getTimelineEvent);

export default router;
