"""AI and ML analysis"""
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List
from collections import defaultdict
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score
from schemas import AIInsight, PredictionData
from models import Transaction, TransactionType

class AIAnalyzer:
    def generate_insights(self, transactions: List[Transaction]) -> List[AIInsight]:
        insights = []
        if not transactions:
            return insights
        expenses = [t for t in transactions if t.type == TransactionType.EXPENSE]
        income = [t for t in transactions if t.type == TransactionType.INCOME]
        if not expenses:
            return insights
        now = datetime.utcnow()
        current_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        previous_month_start = (current_month_start - timedelta(days=1)).replace(day=1)
        previous_month_end = current_month_start - timedelta(seconds=1)
        current_month_expense = sum(e.amount for e in expenses if e.date >= current_month_start)
        previous_month_expense = sum(e.amount for e in expenses if previous_month_start <= e.date <= previous_month_end)
        if previous_month_expense > 0:
            change_percent = ((current_month_expense - previous_month_expense) / previous_month_expense) * 100
            if change_percent > 20:
                insights.append(AIInsight(type="warning", message=f"⚠️ Your spending increased by {change_percent:.1f}%!", value=change_percent))
            elif change_percent < -20:
                insights.append(AIInsight(type="insight", message=f"✅ Great! Reduced spending by {abs(change_percent):.1f}%", value=abs(change_percent)))
        category_totals = defaultdict(float)
        for expense in expenses:
            category_totals[expense.category] += expense.amount
        if category_totals:
            highest_category = max(category_totals.items(), key=lambda x: x[1])
            insights.append(AIInsight(type="insight", message=f"📊 Highest: {highest_category[0]} (₹{highest_category[1]:.0f})", value=highest_category[1]))
        total_income = sum(e.amount for e in income)
        total_expense = sum(e.amount for e in expenses)
        if total_income > 0:
            savings_rate = ((total_income - total_expense) / total_income) * 100
            if savings_rate < 10:
                recommended_savings = total_income * 0.2
                current_savings = total_income - total_expense
                additional_needed = recommended_savings - current_savings
                insights.append(AIInsight(type="suggestion", message=f"💡 Save ₹{additional_needed:.0f} more to reach 20% goal", value=additional_needed))
        return insights[:5]
    
    def predict_expenses(self, transactions: List[Transaction]) -> List[PredictionData]:
        predictions = []
        if len(transactions) < 3:
            return predictions
        data_list = [{'date': t.date, 'month': t.date.strftime('%Y-%m'), 'amount': t.amount} for t in transactions]
        if not data_list:
            return predictions
        df = pd.DataFrame(data_list)
        monthly_data = df.groupby('month')['amount'].sum().reset_index()
        monthly_data.columns = ['month', 'expense']
        if len(monthly_data) < 3:
            return predictions
        X = np.arange(len(monthly_data)).reshape(-1, 1)
        y = monthly_data['expense'].values
        model = LinearRegression()
        model.fit(X, y)
        y_pred_train = model.predict(X)
        try:
            confidence_base = max(0, min(100, r2_score(y, y_pred_train) * 100))
        except:
            confidence_base = 50.0
        now = datetime.utcnow()
        for i in range(1, 4):
            future_month = now + timedelta(days=30*i)
            month_str = future_month.strftime('%Y-%m')
            X_pred = np.array([[len(monthly_data) + i - 1]])
            predicted_value = max(0, model.predict(X_pred)[0])
            confidence = confidence_base * (0.9 ** i)
            predictions.append(PredictionData(month=month_str, predicted_expense=predicted_value, confidence=confidence))
        return predictions

analyzer = AIAnalyzer()