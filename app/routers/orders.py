
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import database, models, schemas
from . import auth

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)

@router.post("/", response_model=schemas.Order)
def place_order(
    order: schemas.OrderCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Calculate total price
    total_price = 0
    db_items = []
    
    for item in order.items:
        menu_item = db.query(models.MenuItem).filter(models.MenuItem.id == item.menu_item_id).first()
        if not menu_item:
            raise HTTPException(status_code=404, detail=f"Menu item {item.menu_item_id} not found")
        total_price += menu_item.price * item.quantity
        db_items.append(models.OrderItem(menu_item_id=item.menu_item_id, quantity=item.quantity, price=menu_item.price))
    
    new_order = models.Order(
        customer_id=current_user.id,
        restaurant_id=order.restaurant_id,
        total_price=total_price,
        status=models.OrderStatus.PENDING
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    
    for db_item in db_items:
        db_item.order_id = new_order.id
        db.add(db_item)
    
    db.commit()
    db.refresh(new_order)
    return new_order

@router.get("/", response_model=List[schemas.Order])
def get_my_orders(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    if current_user.role == models.UserRole.RESTAURANT_OWNER:
        # Get orders for their restaurants
        # Simplified: getting orders where they are the owner of the restaurant
        return db.query(models.Order).join(models.Restaurant).filter(models.Restaurant.owner_id == current_user.id).all()
    return db.query(models.Order).filter(models.Order.customer_id == current_user.id).all()

@router.get("/{order_id}", response_model=schemas.Order)
def get_order(order_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Access control
    if order.customer_id != current_user.id:
        # Check if restaurant owner
        restaurant = db.query(models.Restaurant).filter(models.Restaurant.id == order.restaurant_id).first()
        if restaurant.owner_id != current_user.id and current_user.role != models.UserRole.ADMIN:
             raise HTTPException(status_code=403, detail="Not authorized")

    return order
