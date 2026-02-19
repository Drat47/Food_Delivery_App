
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import database, models, schemas
from . import auth

router = APIRouter(
    prefix="/restaurants",
    tags=["Restaurants"]
)

@router.get("/", response_model=List[schemas.Restaurant])
def get_restaurants(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    restaurants = db.query(models.Restaurant).offset(skip).limit(limit).all()
    return restaurants

@router.get("/{restaurant_id}", response_model=schemas.Restaurant)
def get_restaurant(restaurant_id: int, db: Session = Depends(database.get_db)):
    restaurant = db.query(models.Restaurant).filter(models.Restaurant.id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return restaurant

@router.post("/{restaurant_id}/menu", response_model=schemas.MenuItem)
def add_menu_item(
    restaurant_id: int, 
    item: schemas.MenuItemCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    restaurant = db.query(models.Restaurant).filter(models.Restaurant.id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
        
    # Check if current user is owner or admin
    if current_user.id != restaurant.owner_id and current_user.role != models.UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized to edit this restaurant")
        
    new_item = models.MenuItem(**item.dict(), restaurant_id=restaurant_id)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.get("/{restaurant_id}/menu", response_model=List[schemas.MenuItem])
def get_menu(restaurant_id: int, db: Session = Depends(database.get_db)):
    return db.query(models.MenuItem).filter(models.MenuItem.restaurant_id == restaurant_id).all()
