const express = require('express');
const router = express.Router();
const { body, query, validationResult } = require('express-validator');
const Expense = require('../models/Expense');

// Validation middleware
const validateExpense = [
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be in ISO 8601 format'),
  body('category')
    .isIn(['Food', 'Transport', 'Entertainment', 'Healthcare', 'Shopping', 'Bills', 'Other'])
    .withMessage('Invalid category'),
  body('userId')
    .optional()
    .trim()
    .notEmpty()
];

// POST /expenses - Add a new expense
router.post('/', validateExpense, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const expense = new Expense({
      amount: req.body.amount,
      description: req.body.description,
      date: req.body.date || new Date(),
      category: req.body.category,
      userId: req.body.userId || 'default_user'
    });

    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /expenses - List or filter expenses
router.get('/', [
  query('category').optional().trim(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('userId').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { category, startDate, endDate, userId } = req.query;
    
    // Build filter query
    const filter = { userId: userId || 'default_user' };
    
    if (category) {
      filter.category = category;
    }
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /expenses/dashboard - Get spending summary
router.get('/dashboard', [
  query('userId').optional().trim()
], async (req, res) => {
  try {
    const userId = req.query.userId || 'default_user';
    
    // Aggregate total spending per category
    const categoryTotals = await Expense.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    // Calculate overall total
    const overallTotal = await Expense.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      categoryBreakdown: categoryTotals.map(cat => ({
        category: cat._id,
        total: cat.total,
        count: cat.count
      })),
      overall: overallTotal.length > 0 ? {
        total: overallTotal[0].total,
        count: overallTotal[0].count
      } : { total: 0, count: 0 }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /expenses/:id - Get a single expense
router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /expenses/:id - Edit an existing expense
router.put('/:id', validateExpense, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    expense.amount = req.body.amount;
    expense.description = req.body.description;
    expense.date = req.body.date || expense.date;
    expense.category = req.body.category;
    
    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /expenses/:id - Delete an expense
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    await expense.deleteOne();
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
