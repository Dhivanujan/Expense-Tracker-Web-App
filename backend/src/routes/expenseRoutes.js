import express from 'express';
import { body } from 'express-validator';
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getMonthlySummary,
} from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
    body('category').notEmpty().withMessage('Category is required'),
    body('date').notEmpty().withMessage('Date is required'),
  ],
  createExpense
);

router.get('/', getExpenses);
router.get('/summary', getMonthlySummary);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;
