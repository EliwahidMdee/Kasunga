# Quick Start Guide (5 Minutes)

## ⚡ Fastest Way to Get Running

### Prerequisites ✅
- MySQL running (XAMPP started)
- Python 3.10+ installed
- Node.js 18+ installed
- Terminal/CMD open

---

## 🚀 Backend (Terminal 1)

```bash
# 1. Go to backend
cd backend/config

# 2. Activate virtual environment
venv\Scripts\activate          # Windows
source venv/bin/activate       # Mac/Linux

# 3. Install dependencies (only first time)
pip install -r requirements.txt

# 4. Create .env file (only first time)
# Paste this into backend/config/.env:
# DB_NAME=travel_db
# DB_USER=root
# DB_PASSWORD=
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DEBUG=True

# 5. Run migrations (only first time)
python manage.py migrate

# 6. Create admin user (only first time)
python manage.py createsuperuser

# 7. Start server (every time)
python manage.py runserver
```

**Expected:** Server running at http://localhost:8000 ✅

---

## ⚛️ Frontend (Terminal 2 - New Window)

```bash
# 1. Go to frontend
cd fontend

# 2. Install dependencies (only first time)
npm install

# 3. Start app (every time)
npm start
```

**Expected:** Browser opens to http://localhost:3000 ✅

---

## 🧪 Quick Test

### Test 1: Admin Panel
```
URL: http://localhost:8000/admin
Username: admin (from createsuperuser)
Password: (your password)
```

Should see Django admin panel ✅

### Test 2: Frontend
```
URL: http://localhost:3000
```

Should see landing page with login/register ✅

### Test 3: Full Flow
1. Click "Register"
2. Create account
3. Login
4. Click "Plan Trip"
5. Set preferences
6. Enter dates
7. See recommendations ✅

---

## 📍 Key URLs

| Purpose | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000/api |
| Admin Panel | http://localhost:8000/admin |
| API Destinations | http://localhost:8000/api/destinations/ |
| API Hotels | http://localhost:8000/api/hotels/ |
| API Travel Plans | http://localhost:8000/api/travel-plans/ |

---

## 💾 Add Sample Data (Optional)

### Via Admin Panel
1. Go to http://localhost:8000/admin
2. Login
3. Click "Destinations"
4. Click "Add Destination"
5. Fill in:
   - Name: Zanzibar Island
   - Country: Tanzania
   - Category: Beach
   - Budget Level: Medium
6. Save
7. Repeat for more destinations

### Add Hotels
1. In admin, click "Hotels"
2. Click "Add Hotel"
3. Select destination, add details
4. Save

---

## 🔄 Daily Startup (After First Setup)

```bash
# Terminal 1: Backend
cd backend/config
venv\Scripts\activate
python manage.py runserver

# Terminal 2: Frontend (new window)
cd fontend
npm start

# Terminal 3: MySQL
Start XAMPP (click MySQL start button)
```

---

## 🛑 Stop Everything

```bash
# Backend - Press Ctrl+C
# Frontend - Press Ctrl+C
# MySQL - XAMPP Control Panel > Stop
```

---

## 📁 File Locations

```
.env file:
backend/config/.env

Database tables:
MySQL > travel_db

User data stored:
Browser localStorage (token)
MySQL database

Sample data:
Added via admin panel
```

---

## ❌ Troubleshooting

| Problem | Solution |
|---------|----------|
| MySQL won't connect | Start XAMPP, click MySQL start |
| ImportError: mysqlclient | `pip install mysqlclient` |
| npm install fails | `rm -rf node_modules` then `npm install` |
| Port 8000 in use | Change in settings.py or stop other Django |
| Port 3000 in use | `npm start` will ask for different port |
| Can't login | Check admin user exists: `python manage.py createsuperuser` |
| Blank page | Check browser console (F12) for errors |

---

## 🎯 What Works Now

✅ User registration  
✅ User login  
✅ Set travel preferences  
✅ Get destination recommendations  
✅ Get hotel recommendations  
✅ Create travel plans  
✅ Generate itineraries  
✅ Admin panel for data management  
✅ Responsive mobile design  

---

## 📖 Documentation

- **Full Setup:** INSTALLATION.md
- **Backend Details:** BACKEND_SETUP.md
- **Frontend Details:** FRONTEND_SETUP.md
- **Project Overview:** README.md

---

## 🎓 Key Concepts

### Rule-Based (No AI)
```
IF budget = 'low':
    Show budget destinations
IF interest = 'beach':
    Show beach destinations
RESULT: Matching destinations
```

### System Flow
```
User registers → Sets preferences → Plans trip → Gets recommendations → Views itinerary
```

### Database
```
MySQL: travel_db
Tables: users, destinations, hotels, transport, travel_plans, itinerary
```

---

## 🚀 You're Ready!

1. All code created ✅
2. Database configured ✅
3. Backend ready ✅
4. Frontend ready ✅
5. Just run commands above ✅

**Happy traveling!** ✈️

---

## 💡 Pro Tips

1. **Keep terminals open** - Don't close backend/frontend
2. **Check .env file** - Make sure it's correct
3. **Add sample data** - Makes testing easier
4. **Use admin panel** - Easy way to add destinations
5. **Check console** - Browser F12 for frontend errors

---

## 📞 Quick Help

**Backend not responding?**
- Check if running: http://localhost:8000/admin
- Check terminal for errors
- Restart: Ctrl+C then python manage.py runserver

**Frontend not loading?**
- Check http://localhost:3000
- Check browser console F12
- Check npm start output in terminal

**Database issues?**
- Start MySQL in XAMPP
- Check .env credentials
- Try: python manage.py migrate

---

Happy coding! 🎉
