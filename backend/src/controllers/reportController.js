import Expense from '../models/Expense.js';
import { generateMonthlyReportPdf } from '../utils/pdfGenerator.js';

export const getMonthlyReportPdf = async (req, res) => {
  const { month } = req.query; // YYYY-MM

  if (!month) {
    return res.status(400).json({ message: 'month query param is required (YYYY-MM)' });
  }

  const [year, monthNumber] = month.split('-');
  const startDate = new Date(year, monthNumber - 1, 1);
  const endDate = new Date(year, monthNumber, 0, 23, 59, 59, 999);

  try {
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
