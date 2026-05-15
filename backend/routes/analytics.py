"""Analytics routes"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List
from schemas import DashboardStats, CategoryBreakdown, MonthlyTrend, AIInsight, PredictionData
from models import User, Transaction, TransactionType
from security import get_current_user
from database import get_db
from ai_analyzer import analyzer

router = APIRouter()

@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard_stats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    transactions = db.query(Transaction).filter(Transaction.user_id == current_user.id).all()
    total_income = sum(t.amount for t in transactions if t.type == TransactionType.INCOME)
    total_expense = sum(t.amount for t in transactions if t.type == TransactionType.EXPENSE)
    now = datetime.utcnow()
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    month_transactions = [t for t in transactions if t.date >= month_start]
    this_month_income = sum(t.amount for t in month_transactions if t.type == TransactionType.INCOME)
    this_month_expense = sum(t.amount for t in month_transactions if t.type == TransactionType.EXPENSE)
    remaining_balance = total_income - total_expense
    savings_percentage = (remaining_balance / total_income * 100) if total_income > 0 else 0
    return DashboardStats(total_income=total_income, total_expense=total_expense, remaining_balance=remaining_balance, savings_percentage=max(0, savings_percentage), this_month_income=this_month_income, this_month_expense=this_month_expense, transactions_count=len(transactions))

@router.get("/category-breakdown", response_model=List[CategoryBreakdown])
def get_category_breakdown(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    transactions = db.query(Transaction).filter(Transaction.user_id == current_user.id, Transaction.type == TransactionType.EXPENSE).all()
    total_expense = sum(t.amount for t in transactions)
    category_totals, category_counts = {}, {}
    for t in transactions:
        category_totals[t.category] = category_totals.get(t.category, 0) + t.amount
        category_counts[t.category] = category_counts.get(t.category, 0) + 1
    result = [CategoryBreakdown(category=category, amount=amount, percentage=(amount / total_expense * 100) if total_expense > 0 else 0, count=category_counts[category]) for category, amount in category_totals.items()]
    return sorted(result, key=lambda x: x.amount, reverse=True)

@router.get("/monthly-trends", response_model=List[MonthlyTrend])
def get_monthly_trends(months: int = Query(6, ge=1, le=24), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    transactions = db.query(Transaction).filter(Transaction.user_id == current_user.id).all()
    trends = {}
    now = datetime.utcnow()
    for i in range(months, 0, -1):
        target_date = now - timedelta(days=30 * i)
        month_key = target_date.strftime("%Y-%m")
        if month_key not in trends:
            trends[month_key] = {"income": 0, "expense": 0}
    for t in transactions:
        month_key = t.date.strftime("%Y-%m")
        if month_key not in trends:
            trends[month_key] = {"income": 0, "expense": 0}
        if t.type == TransactionType.INCOME:
            trends[month_key]["income"] += t.amount
        else:
            trends[month_key]["expense"] += t.amount
    result = [MonthlyTrend(month=month, income=trends[month]["income"], expense=trends[month]["expense"], balance=trends[month]["income"] - trends[month]["expense"]) for month in sorted(trends.keys())]
    return result

@router.get("/insights", response_model=List[AIInsight])
def get_insights(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    transactions = db.query(Transaction).filter(Transaction.user_id == current_user.id).all()
    insights = analyzer.generate_insights(transactions)
    return insights

@router.get("/predictions", response_model=List[PredictionData])
def get_predictions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    transactions = db.query(Transaction).filter(Transaction.user_id == current_user.id, Transaction.type == TransactionType.EXPENSE).order_by(Transaction.date).all()
    predictions = analyzer.predict_expenses(transactions)
    return predictions