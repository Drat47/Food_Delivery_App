
from app.utils import get_password_hash

try:
    print("Testing 'password'...")
    h = get_password_hash("password")
    print(f"Hash: {h}")
except Exception as e:
    print(f"Error: {e}")
