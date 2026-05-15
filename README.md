# 💰 AI-Powered Expense Tracker

A modern, full-stack expense tracking application with AI-powered financial insights and machine learning predictions.

## ✨ Features

- **Smart Authentication**: Secure JWT-based login/signup
- **Dashboard**: Real-time financial overview
- **Transaction Management**: Add, edit, delete income and expenses
- **Data Visualization**: Interactive charts for analysis
- **AI Insights**: Smart recommendations
- **ML Predictions**: Forecast future expenses
- **Dark UI**: Beautiful glassmorphism design
- **Responsive**: Works on all devices

## 🛠️ Tech Stack

- Frontend: React + Tailwind CSS + Recharts
- Backend: FastAPI + SQLAlchemy
- Database: SQLite
- AI/ML: scikit-learn + pandas

## 🚀 Quick Start

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate
pip install -r requirements.txt
cp .env.example .env
python seed.py
python main.py
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## 📊 Demo Account

```
Email: demo@expensetracker.com
Password: DemoUser123
```

## 🔌 API Endpoints

- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `POST /api/transactions` - Create transaction
- `GET /api/analytics/dashboard` - Dashboard stats
- `GET /api/analytics/insights` - AI insights
- `GET /api/analytics/predictions` - ML predictions

## 📁 Project Structure

```
ai-expense-tracker/
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── routes/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 📝 License

MIT License
