# Expense Tracker Web App

A secure, responsive full-stack expense tracker built with React, Node.js, Express, and MongoDB.
Users can authenticate, manage expenses, analyze spending trends, and export monthly PDF reports.

## Highlights

- Secure authentication with JWT and hashed passwords.
- Full expense CRUD (create, read, update, delete).
- Search by title/description and filter by category.
- Paginated transaction history with clear range indicators.
- Monthly insights with summary cards, category doughnut chart, and daily trend chart.
- PDF export for monthly reports.
- Improved UX flows:
  - Edit mode with cancel action.
  - Prevent future dates for expenses.
  - Validation-aware submit button states.
  - Better loading feedback and notifications.

## Tech Stack

### Frontend

- React 18 + Vite
- Tailwind CSS
- Chart.js + react-chartjs-2
- Axios
- React Router DOM

### Backend

- Node.js + Express
- MongoDB + Mongoose
- jsonwebtoken
- bcryptjs
- PDFKit
- helmet + express-rate-limit
- express-validator

## Project Structure

```text
Expense Tracker Web App/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── state/
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB local instance or MongoDB Atlas URI

## Environment Variables

### Backend (.env in backend)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=replace_with_a_strong_secret
NODE_ENV=development
```

### Frontend (.env in frontend)

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Local Development

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Start backend:

```bash
npm run dev
```

3. In a new terminal, install frontend dependencies:

```bash
cd frontend
npm install
```

4. Start frontend:

```bash
npm run dev
```

5. Open the app:

- Frontend: http://localhost:5173
- Backend API base: http://localhost:5000/api

## Build for Production

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

### Backend

```bash
cd backend
npm start
```

## API Overview

### Auth

- POST /api/auth/register
- POST /api/auth/login

### Expenses

- GET /api/expenses
  - Query params: month, page, limit, search, category
- POST /api/expenses
- PUT /api/expenses/:id
- DELETE /api/expenses/:id
- GET /api/expenses/summary
  - Query params: month (required, format YYYY-MM)

### Reports

- GET /api/reports/monthly
  - Query params: month (format YYYY-MM)
  - Returns PDF blob

## Current UX Notes

- Dashboard defaults to the current month.
- Search input is debounced for smoother API calls.
- PDF export includes loading and disabled states.
- Notifications auto-dismiss and can be manually dismissed.

## Future Improvements

- Add recurring expenses.
- Add budget goals and overspend alerts.
- Add multi-currency support.
- Add automated tests (unit and integration).

## License

This project is for educational and personal portfolio use.
