
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import SQLALCHEMY_DATABASE_URL
from app.models import MenuItem

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

def update_images():
    items = db.query(MenuItem).all()
    print(f"Found {len(items)} menu items.")
    
    # Generic food images
    images = [
        "https://images.unsplash.com/photo-1574071318500-d0d512a86365?w=500&q=80", # Pasta
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80", # Pizza
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80", # Salad
        "https://images.unsplash.com/photo-1599020792689-9fdeefad4305?w=500&q=80", # Burger
        "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80", # Curry
        "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&q=80"  # Noodles
    ]
    
    for i, item in enumerate(items):
        item.image_url = images[i % len(images)]
        print(f"Updated {item.name}")
        
    db.commit()
    print("All items updated with images.")

if __name__ == "__main__":
    update_images()
