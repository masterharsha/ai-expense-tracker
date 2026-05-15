"""Database seeding"""
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random
from database import SessionLocal, Base, engine
from models import User, Transaction, TransactionType
from security import hash_password

CATEGORIES = ["Food", "Travel", "Shopping", "Bills", "Entertainment", "Health", "Education", "Other"]
INCOME_DESC = ["Monthly Salary", "Freelance Project", "Bonus", "Investment Return", "Part-time Work"]
EXPENSE_DESC = {
    "Food": ["Groceries", "Restaurant", "Coffee", "Food Delivery", "Snacks"],
    "Travel": ["Gas", "Auto Rickshaw", "Taxi", "Bus", "Flight"],
    "Shopping": ["Clothes", "Electronics", "Books", "Home Decor"],
    "Bills": ["Electricity", "Water", "Internet", "Phone"],
    "Entertainment": ["Movie", "Game", "Concert", "Streaming"],
    "Health": ["Gym", "Medicine", "Doctor", "Dental"],
    "Education": ["Course", "Books", "Tuition", "Workshop"],
    "Other": ["Miscellaneous", "Utilities", "Repairs"]
}

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing_user = db.query(User).filter(User.email == "demo@expensetracker.com").first()
        if existing_user:
            print("✅ Demo user already exists!")
            return
        demo_user = User(
            username="demouser",
            email="demo@expensetracker.com",
            hashed_password=hash_password("DemoUser123")
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)
        print("✅ Demo user created!")
        now = datetime.utcnow()
        transactions_count = 0
        for month_offset in range(6, 0, -1):
            month_start = now - timedelta(days=30 * month_offset)
            for _ in range(random.randint(2, 3)):
                transaction = Transaction(
                    user_id=demo_user.id,
                    type=TransactionType.INCOME,
                    amount=round(random.uniform(30000, 50000), 2),
                    description=random.choice(INCOME_DESC),
                    category="Income",
                    date=month_start + timedelta(days=random.randint(0, 28))
                )
                db.add(transaction)
                transactions_count += 1
            for _ in range(random.randint(15, 25)):
                category = random.choice(CATEGORIES)
                transaction = Transaction(
                    user_id=demo_user.id,
                    type=TransactionType.EXPENSE,
                    category=category,
                    amount=round(random.uniform(100, 2000), 2),
                    description=random.choice(EXPENSE_DESC[category]),
                    date=month_start + timedelta(days=random.randint(0, 28))
                )
                db.add(transaction)
                transactions_count += 1
        db.commit()
        print(f"✅ Created {transactions_count} transactions!")
        print("\n📊 Demo Account:")
        print("   Email: demo@expensetracker.com")
        print("   Password: DemoUser123")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()