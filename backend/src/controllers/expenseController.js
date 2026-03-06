import { validationResult } from 'express-validator';
import Expense from '../models/Expense.js';
import asyncHandler from '../middleware/asyncHandler.js';
import AppError from '../utils/AppError.js';

export const createExpense = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array()[0].msg, 400);
  }

  const { title, amount, category, date, description } = req.body;

  const expense = await Expense.create({
    user: req.user._id,
    title,
    amount,
    category,
    date,
    description,
  });

  res.status(201).json(expense);
});

export const getExpenses = asyncHandler(async (req, res) => {
  const { month, page = 1, limit = 10, search, category } = req.query;

  const query = { user: req.user._id };

  // Filter by month
  if (month) {
    const [year, monthNumber] = month.split('-');
    const startDate = new Date(year, monthNumber - 1, 1);
    const endDate = new Date(year, monthNumber, 0, 23, 59, 59, 999);
    query.date = { $gte: startDate, $lte: endDate };
  }

  // Search by keyword (title or description)
  if (search) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.$or = [
      { title: { $regex: escapedSearch, $options: 'i' } },
      { description: { $regex: escapedSearch, $options: 'i' } },
    ];
  }

  // Filter by category
  if (category && category !== 'All') {
    query.category = category;
  }

  // Pagination
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const expenses = await Expense.find(query)
    .sort({ date: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Expense.countDocuments(query);

  res.json({
    expenses,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    total,
  });
});

export const updateExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const expense = await Expense.findOne({ _id: id, user: req.user._id });

  if (!expense) {
    throw new AppError('Expense not found', 404);
  }

  const fields = ['title', 'amount', 'category', 'date', 'description'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      expense[field] = req.body[field];
    }
  });

  const updated = await expense.save();
  res.json(updated);
});

export const deleteExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const expense = await Expense.findOneAndDelete({ _id: id, user: req.user._id });

  if (!expense) {
    throw new AppError('Expense not found', 404);
  }

  res.json({ message: 'Expense removed' });
});

export const getMonthlySummary = asyncHandler(async (req, res) => {
  const { month } = req.query; // YYYY-MM

  if (!month) {
    throw new AppError('month query param is required (YYYY-MM)', 400);
  }

  const [year, monthNumber] = month.split('-');
  const startDate = new Date(year, monthNumber - 1, 1);
  const endDate = new Date(year, monthNumber, 0, 23, 59, 59, 999);

  const matchStage = {
    $match: {
      user: req.user._id,
      date: { $gte: startDate, $lte: endDate },
    },
  };

  const [totalResult, byCategory, dailyTrend] = await Promise.all([
    Expense.aggregate([
      matchStage,
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
        },
      },
    ]),
    Expense.aggregate([
      matchStage,
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]),
    Expense.aggregate([
      matchStage,
      {
        $group: {
          _id: { $dayOfMonth: '$date' },
          totalAmount: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const totalAmount = totalResult[0]?.totalAmount || 0;

  res.json({
    month,
    totalAmount,
    byCategory: byCategory.map((item) => ({
      category: item._id,
      totalAmount: item.totalAmount,
    })),
    dailyTrend: dailyTrend.map((item) => ({
      day: item._id,
      totalAmount: item.totalAmount,
    })),
  });
});
