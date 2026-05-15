"""Pydantic schemas"""
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional
from enum import Enum

class TransactionTypeEnum(str, Enum):
    INCOME = "income"
    EXPENSE = "expense"

class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserResponse(UserBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class PasswordChange(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=6)

class TransactionBase(BaseModel):
    category: str
    type: TransactionTypeEnum
    amount: float = Field(..., gt=0)
    description: Optional[str] = None
    date: Optional[datetime] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(BaseModel):
    category: Optional[str] = None
    amount: Optional[float] = Field(None, gt=0)
    description: Optional[str] = None
    date: Optional[datetime] = None

class TransactionResponse(TransactionBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    total_income: float
    total_expense: float
    remaining_balance: float
    savings_percentage: float
    this_month_income: float
    this_month_expense: float
    transactions_count: int

class CategoryBreakdown(BaseModel):
    category: str
    amount: float
    percentage: float
    count: int

class MonthlyTrend(BaseModel):
    month: str
    income: float
    expense: float
    balance: float

class AIInsight(BaseModel):
    type: str
    message: str
    value: Optional[float] = None

class PredictionData(BaseModel):
    month: str
    predicted_expense: float
    confidence: float