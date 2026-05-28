import { Router } from 'express';
import { getJourneyLocations } from '../controllers/journeyController.js';

const router = Router();

router.get('/', getJourneyLocations);

export default router;
