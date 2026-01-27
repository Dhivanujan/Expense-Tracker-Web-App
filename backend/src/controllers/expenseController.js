import { validationResult } from 'express-validator';
import Expense from '../models/Expense.js';

export const createExpense = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, amount, category, date, description } = req.body;

  try {
    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      category,
      date,
      description,
    });

    return res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getExpenses = async (req, res) => {
  const { month } = req.query; // expected format: YYYY-MM

  try {
    const query = { user: req.user._id };

    if (month) {
      const [year, monthNumber] = month.split('-');
      const startDate = new Date(year, monthNumber - 1, 1);
      const endDate = new Date(year, monthNumber, 0, 23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const expenses = await Expense.find(query).sort({ date: -1 });
    return res.json(expenses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await Expense.findOne({ _id: id, user: req.user._id });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    const fields = ['title', 'amount', 'category', 'date', 'description'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        expense[field] = req.body[field];
      }
    });

    const updated = await expense.save();
    return res.json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await Expense.findOneAndDelete({ _id: id, user: req.user._id });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    return res.json({ message: 'Expense removed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getMonthlySummary = async (req, res) => {
  const { month } = req.query; // YYYY-MM

  if (!month) {
    return res.status(400).json({ message: 'month query param is required (YYYY-MM)' });
  }

  const [year, monthNumber] = month.split('-');
  const startDate = new Date(year, monthNumber - 1, 1);
  const endDate = new Date(year, monthNumber, 0, 23, 59, 59, 999);

  try {
    const matchStage = {
      $match: {
        user: req.user._id,
        date: { $gte: startDate, $lte: endDate },
      },
    };

    const totalResult = await Expense.aggregate([
      matchStage,
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    const byCategory = await Expense.aggregate([
      matchStage,
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    const totalAmount = totalResult[0]?.totalAmount || 0;

    return res.json({
      month,
      totalAmount,
      byCategory: byCategory.map((item) => ({
        category: item._id,
        totalAmount: item.totalAmount,
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
