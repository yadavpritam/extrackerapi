const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Transport', 'Entertainment', 'Healthcare', 'Shopping', 'Bills', 'Other'],
    trim: true
  },
  userId: {
    type: String,
    required: true,
    default: 'default_user' // For simplicity, using default user. In production, implement auth
  }
}, {
  timestamps: true
});

// Indexes for efficient filtering
expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('Expense', expenseSchema);
