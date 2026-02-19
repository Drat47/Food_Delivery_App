
@echo off
echo Starting Food Delivery App...
echo Server will run at http://127.0.0.1:8000/static/index.html
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
pause
