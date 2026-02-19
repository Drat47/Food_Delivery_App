
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import database, models, schemas
from . import auth

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

@router.post("/restaurants", response_model=schemas.Restaurant)
def create_restaurant(
    restaurant: schemas.RestaurantCreate, 
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    if current_user.role != models.UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # In a real app, we might assign an owner here or creating user is owner
    # For simplicity, let's say the admin IS the owner or we pass owner_id
    # But requirements say "App Admin Role: Add restaurants"
    # and "Restaurant Admin Role: Add/remove dishes"
    
    # Let's assume the current user (Admin) becomes the owner for now, 
    # or we need to pass an owner_id. 
    # Let's just create it with current_user as owner for simplicity of verification
    new_restaurant = models.Restaurant(**restaurant.dict(), owner_id=current_user.id)
    db.add(new_restaurant)
    db.commit()
    db.refresh(new_restaurant)
    return new_restaurant
