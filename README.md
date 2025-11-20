<<<<<<< HEAD
# Expense Tracker Backend API

RESTful API built with Node.js, Express, and MongoDB for managing expenses.

## Features

- Create, read, update, and delete expenses
- Filter expenses by category and date range
- Dashboard with spending analytics per category
- Input validation using express-validator
- MongoDB with Mongoose ODM

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/expense_tracker
```

For MongoDB Atlas, use:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense_tracker
```

3. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:3000`

## API Endpoints

### 1. Create Expense
```http
POST /expenses
Content-Type: application/json

{
  "amount": 50.00,
  "description": "Lunch at restaurant",
  "date": "2025-11-18T12:00:00Z",
  "category": "Food"
}
```

### 2. Get All Expenses (with optional filters)
```http
GET /expenses
GET /expenses?category=Food
GET /expenses?startDate=2025-11-01&endDate=2025-11-30
GET /expenses?category=Transport&startDate=2025-11-01
```

### 3. Get Single Expense
```http
GET /expenses/:id
```

### 4. Update Expense
```http
PUT /expenses/:id
Content-Type: application/json

{
  "amount": 55.00,
  "description": "Updated lunch expense",
  "date": "2025-11-18T12:00:00Z",
  "category": "Food"
}
```

### 5. Delete Expense
```http
DELETE /expenses/:id
```

### 6. Get Dashboard Summary
```http
GET /expenses/dashboard
```

Response:
```json
{
  "categoryBreakdown": [
    {
      "category": "Food",
      "total": 150.50,
      "count": 5
    }
  ],
  "overall": {
    "total": 500.75,
    "count": 20
  }
}
```

## Categories

Valid expense categories:
- Food
- Transport
- Entertainment
- Healthcare
- Shopping
- Bills
- Other

## Database Schema

```javascript
{
  amount: Number (required, min: 0),
  description: String (required, max: 500 chars),
  date: Date (required, default: now),
  category: String (required, enum),
  userId: String (required, default: 'default_user'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Error Responses

Validation errors return 400:
```json
{
  "errors": [
    {
      "msg": "Amount must be a positive number",
      "param": "amount"
    }
  ]
}
```

Server errors return 500:
```json
{
  "message": "Error message"
}
```
=======
# extrackerapi
>>>>>>> e63bfc7f2ff16da6cd41c9a36fb8524f9dd1191e
