# Expense Tracker Web App

A complete, secure, and modern full-stack application for tracking daily expenses. Users can register, log in, manage expenses, view insightful charts, and download monthly PDF reports.

## 🚀 Features

- **Authentication**: Secure User Registration & Login with JWT and Password Hashing.
- **Expense Management**: Add, Edit, Delete, and View expenses.
- **Advanced Filtering**: Search expenses by title/description and filter by category.
- **Pagination**: Efficiently browse through large lists of expenses.
- **Visual Analytics**: Interactive Category-wise Pie Chart and Monthly Summary Cards.
- **Reports**: Download detailed Monthly Expense Reports as PDFs.
- **Responsive UI**: Modern Glassmorphism design using Tailwind CSS, fully responsive.
- **Security**: Protected with Helmet (secure headers) and Rate Limiting to prevent abuse.

## 🛠 Tech Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS** (Styling)
- **Chart.js + react-chartjs-2** (Data Visualization)
- **Axios** (API Communication)
- **React Router DOM** (Navigation)

### Backend
- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose** (Database)
- **JWT (JsonWebToken)** (Authentication)
- **Bcryptjs** (Password Encryption)
- **PDFKit** (Report Generation)
- **Helmet & Express-Rate-Limit** (Security)

## 📂 Project Structure

```
Expense Tracker Web App/
├── backend/                # Node.js + Express API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth & Error handling
│   │   ├── models/         # Mongoose Schemas (User, Expense)
│   │   ├── routes/         # API Routes
│   │   ├── utils/          # Helpers (PDF Generator)
│   │   └── server.js       # App entry point
│   ├── .env.example        # Environment variables template
│   └── package.json
│
├── frontend/               # React + Tailwind Client
│   ├── src/
│   │   ├── api/            # Axios client setup
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── state/          # Auth Context (Global State)
│   │   └── main.jsx        # React entry point
│   ├── .env.example        # Frontend config
│   ├── tailwind.config.cjs # Tailwind configuration
│   └── vite.config.mjs     # Vite configuration
└── README.md
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB (Local installation or Atlas URI)

### 1. Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   - Create a `.env` file based on `.env.example`.
   - Update `MONGO_URI` with your MongoDB connection string.
   - Set a secure `JWT_SECRET`.
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/expense-tracker
   JWT_SECRET=your_super_secret_key
   NODE_ENV=development
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   Server runs at `http://localhost:5000`.

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   - Create a `.env` file based on `.env.example`.
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   Access the app at `http://localhost:5173`.

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and get JWT

### Expenses
- `GET /api/expenses` - Get expenses (supports `month`, `page`, `limit`, `search`, `category`)
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/summary` - Get monthly totals & category breakdown

### Reports
- `GET /api/reports/monthly` - Download monthly PDF report

## 🎨 Future Improvements
- [ ] Add dark/light mode toggle (currently Dark Mode only)
- [ ] Implement email verification
- [ ] Add budget limits per category
- [ ] Support multiple currencies

---
*Built with ❤️ for learning and financial awareness.*
