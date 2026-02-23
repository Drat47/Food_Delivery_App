
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import SQLALCHEMY_DATABASE_URL
from app.models import Base, User, Restaurant, MenuItem, UserRole, Order, OrderItem
from app.utils import get_password_hash
import sys

engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Create all tables first
Base.metadata.create_all(bind=engine)

SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

def seed():
    # Check if force reseed is requested
    force_reseed = '--force' in sys.argv or '-f' in sys.argv
    
    # Check if users exist
    if db.query(User).first() and not force_reseed:
        print("Database already seeded.")
        return
    
    # Clear existing data and drop all tables if force reseed
    if force_reseed:
        print("Force reseeding database...")
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
        print("Database schema recreated.")

    # Create Users
    admin = User(
        username="admin", 
        email="admin@example.com", 
        hashed_password=get_password_hash("password"), 
        role=UserRole.ADMIN
    )
    
    owner = User(
        username="owner", 
        email="owner@example.com", 
        hashed_password=get_password_hash("password"), 
        role=UserRole.RESTAURANT_OWNER
    )
    
    customer = User(
        username="customer", 
        email="customer@example.com", 
        hashed_password=get_password_hash("password"), 
        role=UserRole.CUSTOMER
    )
    
    db.add_all([admin, owner, customer])
    db.commit()
    
    # Refresh to get IDs
    db.refresh(owner)
    
    # Create Multiple Restaurants
    restaurants = [
        Restaurant(
            name="Tasty Bytes",
            description="Best fast food in town with a cyber twist. Delicious burgers and crispy fries!",
            address="C-Scheme, Jaipur, Rajasthan - 302001",
            image_url="https://images.unsplash.com/photo-1550547990-d5d85ad26ae3?w=600&q=80",
            owner_id=owner.id
        ),
        Restaurant(
            name="Pizza Hut Express",
            description="Authentic Italian pizzas with fresh ingredients. Wood-fired perfection in every bite!",
            address="JLN Road, Jaipur, Rajasthan - 302004",
            image_url="https://images.unsplash.com/photo-1558522479-e6d2dfd4e71b?w=600&q=80",
            owner_id=owner.id
        ),
        Restaurant(
            name="Spice Route",
            description="Authentic Indian cuisine with traditional flavors. Royal Rajasthani heritage dishes!",
            address="Laxmi Narayan Temple Area, Jaipur, Rajasthan - 302005",
            image_url="https://images.unsplash.com/photo-1603566438886-609f4ee62e51?w=600&q=80",
            owner_id=owner.id
        ),
        Restaurant(
            name="Dragon Palace",
            description="Premium Chinese and Asian dishes cooked by expert chefs. Authentic tastes from the East!",
            address="Tonk Road, Jaipur, Rajasthan - 302015",
            image_url="https://images.unsplash.com/photo-1569718899523-5e673bf89e72?w=600&q=80",
            owner_id=owner.id
        ),
        Restaurant(
            name="Burger King",
            description="Quick service fast food with premium ingredients. Flame-grilled perfection!",
            address="MI Road, Jaipur, Rajasthan - 302001",
            image_url="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
            owner_id=owner.id
        ),
        Restaurant(
            name="The Grill House",
            description="Premium grilled meats and BBQ specialties. Smoky, tender, and delicious!",
            address="Ajmer Road, Jaipur, Rajasthan - 302017",
            image_url="https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=600&q=80",
            owner_id=owner.id
        ),
        Restaurant(
            name="Sushi Paradise",
            description="Fresh Japanese sushi and Asian fusion cuisine. Exquisite flavors from Japan!",
            address="Malviya Nagar, Jaipur, Rajasthan - 302017",
            image_url="https://images.unsplash.com/photo-1580959375944-abd7e991f971?w=600&q=80",
            owner_id=owner.id
        ),
    ]
    
    db.add_all(restaurants)
    db.commit()
    
    # Add menu items for each restaurant
    all_items = [
        # Tasty Bytes
        MenuItem(name="Cyber Burger", description="Juicy beef patty with neon sauce", price=1099, restaurant_id=restaurants[0].id),
        MenuItem(name="Glitch Pizza", description="Pepperoni with extra cheese", price=1299, restaurant_id=restaurants[0].id),
        MenuItem(name="Data Soda", description="Refreshing fizzy drink", price=199, restaurant_id=restaurants[0].id),
        MenuItem(name="Digital Fries", description="Crispy golden fries with special dip", price=399, restaurant_id=restaurants[0].id),
        
        # Pizza Hut Express
        MenuItem(name="Margherita Pizza", description="Fresh mozzarella and basil", price=1199, restaurant_id=restaurants[1].id),
        MenuItem(name="Pepperoni Supreme", description="Extra pepperoni and cheese", price=1399, restaurant_id=restaurants[1].id),
        MenuItem(name="Veggie Delight", description="Mixed vegetables and cheese", price=1149, restaurant_id=restaurants[1].id),
        MenuItem(name="Garlic Bread", description="Crispy bread with garlic butter", price=499, restaurant_id=restaurants[1].id),
        
        # Spice Route
        MenuItem(name="Butter Chicken", description="Tender chicken in creamy tomato sauce", price=1149, restaurant_id=restaurants[2].id),
        MenuItem(name="Biryani Special", description="Fragrant rice with spiced meat", price=1199, restaurant_id=restaurants[2].id),
        MenuItem(name="Samosa Platter", description="4 pieces of crispy samosas", price=549, restaurant_id=restaurants[2].id),
        MenuItem(name="Mango Lassi", description="Cool yogurt drink with mango", price=279, restaurant_id=restaurants[2].id),
        
        # Dragon Palace
        MenuItem(name="Kung Pao Chicken", description="Chicken with peanuts and peppers", price=1099, restaurant_id=restaurants[3].id),
        MenuItem(name="Sweet & Sour Pork", description="Tangy sweet pork with vegetables", price=1149, restaurant_id=restaurants[3].id),
        MenuItem(name="Chow Mein", description="Stir-fried noodles with vegetables", price=899, restaurant_id=restaurants[3].id),
        MenuItem(name="Spring Rolls", description="6 pieces of crispy spring rolls", price=639, restaurant_id=restaurants[3].id),
        
        # Burger King
        MenuItem(name="Whopper", description="Flame-grilled beef patty with toppings", price=999, restaurant_id=restaurants[4].id),
        MenuItem(name="Chicken Sandwich", description="Crispy fried chicken sandwich", price=799, restaurant_id=restaurants[4].id),
        MenuItem(name="Double Cheeseburger", description="Two patties with double cheese", price=899, restaurant_id=restaurants[4].id),
        MenuItem(name="Large Fries", description="Crispy golden fries", price=349, restaurant_id=restaurants[4].id),
        
        # The Grill House
        MenuItem(name="Ribeye Steak", description="Premium grilled ribeye steak", price=2099, restaurant_id=restaurants[5].id),
        MenuItem(name="BBQ Chicken", description="Smoked chicken with BBQ sauce", price=1329, restaurant_id=restaurants[5].id),
        MenuItem(name="Grilled Salmon", description="Fresh salmon with lemon butter", price=1899, restaurant_id=restaurants[5].id),
        MenuItem(name="Grilled Vegetables", description="Seasonal vegetables with herb butter", price=799, restaurant_id=restaurants[5].id),
        
        # Sushi Paradise
        MenuItem(name="California Roll", description="Crab, avocado, and cucumber", price=999, restaurant_id=restaurants[6].id),
        MenuItem(name="Spicy Tuna Roll", description="Spicy tuna with mayo", price=1099, restaurant_id=restaurants[6].id),
        MenuItem(name="Salmon Sashimi", description="6 pieces of fresh salmon", price=1329, restaurant_id=restaurants[6].id),
        MenuItem(name="Edamame", description="Steamed soybeans with salt", price=499, restaurant_id=restaurants[6].id),
    ]
    
    db.add_all(all_items)
    db.commit()
    
    print("Database seeded successfully!")
    print("Users created:")
    print(" - admin / password")
    print(" - owner / password")
    print(" - customer / password")

if __name__ == "__main__":
    seed()
