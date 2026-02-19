
from sqlalchemy import create_engine, inspect
from app.database import SQLALCHEMY_DATABASE_URL
from app.models import Base

def verify_db():
    try:
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"Tables found: {tables}")
        
        expected_tables = ["users", "restaurants", "menu_items", "orders", "order_items"]
        missing = [t for t in expected_tables if t not in tables]
        
        if missing:
            print(f"MISSING TABLES: {missing}")
        else:
            print("All expected tables follow.")
            
    except Exception as e:
        print(f"Error connecting to DB: {e}")

if __name__ == "__main__":
    verify_db()
