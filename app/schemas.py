
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from .models import UserRole, OrderStatus

# User Schemas
class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str
    role: UserRole = UserRole.CUSTOMER

class User(UserBase):
    id: int
    role: UserRole
    is_active: bool

    class Config:
        orm_mode = True

# Restaurant Schemas
class RestaurantBase(BaseModel):
    name: str
    description: Optional[str] = None
    address: Optional[str] = None
    image_url: Optional[str] = None

class RestaurantCreate(RestaurantBase):
    pass

class Restaurant(RestaurantBase):
    id: int
    owner_id: int
    is_active: bool

    class Config:
        orm_mode = True

# Menu Item Schemas
class MenuItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None

class MenuItemCreate(MenuItemBase):
    pass

class MenuItem(MenuItemBase):
    id: int
    restaurant_id: int
    is_available: bool

    class Config:
        orm_mode = True

# Order Schemas
class OrderItemBase(BaseModel):
    menu_item_id: int
    quantity: int

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: int
    order_id: int
    price: float

    class Config:
        orm_mode = True

class OrderBase(BaseModel):
    restaurant_id: int

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]
    total_amount: float = None  # Optional: total with all charges

class Order(OrderBase):
    id: int
    customer_id: int
    status: OrderStatus
    total_price: float
    created_at: datetime
    items: List[OrderItem]

    class Config:
        orm_mode = True
