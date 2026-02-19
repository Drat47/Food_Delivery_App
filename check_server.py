
import urllib.request
import sys

try:
    print("Checking server status...")
    with urllib.request.urlopen("http://127.0.0.1:8000") as response:
        if response.getcode() == 200:
            print("Server is running!")
            sys.exit(0)
        else:
            print(f"Server returned status code: {response.getcode()}")
            sys.exit(1)
except Exception as e:
    print(f"Could not connect to server: {e}")
    sys.exit(1)
