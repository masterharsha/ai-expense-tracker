"""Transaction routes"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
from schemas import TransactionCreate, TransactionUpdate, TransactionResponse
from models import User, Transaction, TransactionType
from security import get_current_user
from database import get_db

router = APIRouter()

@router.post("", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_transaction(transaction_data: TransactionCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_transaction = Transaction(user_id=current_user.id, **transaction_data.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return TransactionResponse.from_orm(db_transaction)

@router.get("", response_model=List[TransactionResponse])
def get_transactions(skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=100), category: str = Query(None), transaction_type: str = Query(None), start_date: datetime = Query(None), end_date: datetime = Query(None), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    query = db.query(Transaction).filter(Transaction.user_id == current_user.id)
    if category:
        query = query.filter(Transaction.category == category)
    if transaction_type:
        query = query.filter(Transaction.type == transaction_type)
    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)
    transactions = query.order_by(Transaction.date.desc()).offset(skip).limit(limit).all()
    return [TransactionResponse.from_orm(t) for t in transactions]

@router.get("/{transaction_id}", response_model=TransactionResponse)
def get_transaction(transaction_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.user_id == current_user.id).first()
    if not transaction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    return TransactionResponse.from_orm(transaction)

@router.put("/{transaction_id}", response_model=TransactionResponse)
def update_transaction(transaction_id: int, transaction_data: TransactionUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.user_id == current_user.id).first()
    if not transaction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    update_data = transaction_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(transaction, key, value)
    db.commit()
    db.refresh(transaction)
    return TransactionResponse.from_orm(transaction)

@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(transaction_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id, Transaction.user_id == current_user.id).first()
    if not transaction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    db.delete(transaction)
    db.commit()