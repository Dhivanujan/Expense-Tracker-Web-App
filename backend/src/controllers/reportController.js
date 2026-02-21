import Expense from '../models/Expense.js';
import { generateMonthlyReportPdf } from '../utils/pdfGenerator.js';
import asyncHandler from '../middleware/asyncHandler.js';
import AppError from '../utils/AppError.js';

export const getMonthlyReportPdf = asyncHandler(async (req, res) => {
  const { month } = req.query; // YYYY-MM

  if (!month) {
    throw new AppError('month query param is required (YYYY-MM)', 400);
  }

  const [year, monthNumber] = month.split('-');
  const startDate = new Date(year, monthNumber - 1, 1);
  const endDate = new Date(year, monthNumber, 0, 23, 59, 59, 999);

  const expenses = await Expense.find({
    user: req.user._id,
    date: { $gte: startDate, $lte: endDate },
  }).sort({ date: 1 });

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  const byCategoryMap = new Map();
  expenses.forEach((e) => {
    byCategoryMap.set(e.category, (byCategoryMap.get(e.category) || 0) + e.amount);
  });

  const byCategory = Array.from(byCategoryMap.entries()).map(([category, totalAmount]) => ({
    category,
    totalAmount,
  }));

  const summary = {
    month,
    totalAmount,
    byCategory,
  };

  generateMonthlyReportPdf({ res, user: req.user, month, expenses, summary });
});
