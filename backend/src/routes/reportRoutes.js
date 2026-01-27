import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getMonthlyReportPdf } from '../controllers/reportController.js';

const router = express.Router();

router.use(protect);

router.get('/monthly', getMonthlyReportPdf);

export default router;
