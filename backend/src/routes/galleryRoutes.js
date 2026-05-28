import { Router } from 'express';
import { getGalleryImages } from '../controllers/galleryController.js';

const router = Router();

router.get('/', getGalleryImages);

export default router;
