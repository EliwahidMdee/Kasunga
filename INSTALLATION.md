# Complete Installation & Setup Guide

## 🎯 Project Overview

**Travel Planning & Recommendation System**
- Web-based platform for travel planning
- Rule-based recommendations (no AI)
- Built with Django + React
- MySQL database integration

---

## 📋 Prerequisites

Before starting, ensure you have:

1. **Python 3.10+** - Download from python.org
2. **Node.js 18+** - Download from nodejs.org
3. **MySQL Server** - Download XAMPP (includes MySQL, Apache, phpMyAdmin)
4. **Git** - Download from git-scm.com
5. **Code Editor** - VSCode (recommended)

### Verify Installation

```bash
# Python
python --version

# Node.js
node --version
npm --version

# Git
git --version
```

---

## 🗄️ Database Setup

### Step 1: Start MySQL Server

**Windows (XAMPP):**
1. Open XAMPP Control Panel
2. Find "MySQL" section
3. Click "Start" button
4. Wait for it to show "Running" status

**Verify connection:**
```bash
mysql -u root
SHOW DATABASES;
EXIT;
```

### Step 2: Create Database

**Option A: MySQL Command Line**
```bash
mysql -u root
CREATE DATABASE travel_db;
EXIT;
```

**Option B: phpMyAdmin (GUI)**
1. Open http://localhost/phpmyadmin
2. Click "New" on the left
3. Enter "travel_db" as database name
4. Click "Create"

**Verify:**
```bash
mysql -u root -e "SHOW DATABASES;"
```

---

## 🔧 Backend Installation

### Step 1: Navigate to Backend Directory

```bash
cd backend/config
```

### Step 2: Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
```

**Expected output:** `(venv)` prefix in terminal

### Step 3: Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**What gets installed:**
- Django 6.0.1
- Django REST Framework
- django-cors-headers
- python-dotenv
- mysqlclient

### Step 4: Configure Environment

Create `.env` file in `backend/config/`:

```bash
# Navigate to backend/config
cd backend/config

# Create .env file with content:
cat > .env << EOF
DB_NAME=travel_db
DB_USER=root
DB_PASSWORD=
DB_HOST=127.0.0.1
DB_PORT=3306
DEBUG=True
SECRET_KEY=django-insecure-(&i&ll(=3xdz&3j#z%pwm)v6=@i+@g273s((sl)9bt=#$x1s@o
EOF
```

**Or manually create .env with:** Notepad/VSCode

### Step 5: Run Migrations

```bash
python manage.py migrate
```

**Expected output:**
```
Running migrations:
  Applying admin.0001_initial...
  Applying auth.0001_initial...
  ...
```

### Step 6: Create Admin User

```bash
python manage.py createsuperuser
```

**Prompts:**
```
Username: admin
Email: your-email@example.com
Password: (enter secure password)
Password (again): (confirm)
```

### Step 7: Start Backend Server

```bash
python manage.py runserver
```

**Expected output:**
```
Starting development server at http://127.0.0.1:8000/
```

**Keep this terminal open!**

---

## ⚛️ Frontend Installation

### Step 1: Open New Terminal

Keep backend terminal running, open a new terminal window.

### Step 2: Navigate to Frontend

```bash
cd fontend
```

### Step 3: Install Dependencies

```bash
npm install
```

**What gets installed:**
- React 19
- React Router v6
- Axios
- React Testing Library
- All development tools

**This may take 2-3 minutes**

### Step 4: Start Frontend Server

```bash
npm start
```

**Expected output:**
```
Compiled successfully!
Webpack compiled...
On Your Network: ...
Local: http://localhost:3000
```

**Browser should open automatically**

---

## ✅ Verification

### Backend Verification

Open http://localhost:8000/admin
- Login with admin credentials
- Should see Django admin panel

### Frontend Verification

http://localhost:3000 should show:
- Landing page with login/register buttons
- "How It Works" section
- Responsive design

### API Connection Test

In browser console:
```javascript
fetch('http://localhost:8000/api/destinations/')
  .then(r => r.json())
  .then(data => console.log(data))
```

Should return JSON response.

---

## 📝 Adding Sample Data

### Method 1: Django Admin

1. Visit http://localhost:8000/admin
2. Login with admin credentials
3. Click on "Destinations"
4. Click "Add Destination"
5. Fill in sample data:
   - **Name:** Zanzibar Island
   - **Country:** Tanzania
   - **City:** Stone Town
   - **Category:** Beach
   - **Budget Level:** Medium
   - **Description:** Beautiful beach destination
   - **Best Season:** June to October
   - **Avg Temperature:** 25-30°C
6. Click "Save"
7. Repeat for other destinations

### Method 2: Load Fixture (if created)

```bash
# From backend/config directory
python manage.py loaddata api/fixtures/initial_data.json
```

### Sample Destinations to Add

1. **Zanzibar Island**
   - Country: Tanzania
   - Category: Beach
   - Budget: Medium

2. **Serengeti National Park**
   - Country: Tanzania
   - Category: Wildlife
   - Budget: High

3. **Mount Kilimanjaro**
   - Country: Tanzania
   - Category: Adventure
   - Budget: High

4. **Dar es Salaam**
   - Country: Tanzania
   - Category: City Tour
   - Budget: Low

---

## 🧪 Testing the System

### 1. Test User Registration

1. Open http://localhost:3000
2. Click "Register"
3. Fill in details:
   - Username: testuser
   - Email: test@example.com
   - Password: testpass123
   - Confirm: testpass123
4. Click "Create Account"
5. Should redirect to login

### 2. Test Login

1. Enter credentials from registration
2. Click "Login"
3. Should show dashboard

### 3. Test Trip Planning

1. Click "Plan Trip"
2. Set preferences:
   - Budget: Medium
   - Interest: Beach
3. Enter trip dates
4. Follow the flow:
   - Select destination
   - Select hotel
   - View complete plan

---

## 🚀 System Components Running

**Terminal 1 (Backend):**
```
Django Server: http://localhost:8000
Admin Panel: http://localhost:8000/admin
API: http://localhost:8000/api
```

**Terminal 2 (Frontend):**
```
React App: http://localhost:3000
```

**Terminal 3 (MySQL):**
```
XAMPP Control Panel (running)
```

---

## 📂 Project Structure

```
UPENDO/
├── backend/
│   └── config/
│       ├── manage.py
│       ├── requirements.txt
│       ├── .env (create this)
│       ├── config/
│       │   ├── settings.py (modified)
│       │   ├── urls.py (modified)
│       │   └── ...
│       └── api/
│           ├── models.py (modified)
│           ├── views.py (modified)
│           ├── serializers.py (created)
│           ├── admin.py (modified)
│           └── migrations/
│               └── 0001_initial.py
│
├── fontend/
│   ├── package.json (modified)
│   ├── public/
│   └── src/
│       ├── App.js (completely rewritten)
│       ├── App.css (completely rewritten)
│       ├── api.js (created)
│       └── ...
│
├── README.md
├── BACKEND_SETUP.md
├── FRONTEND_SETUP.md
└── INSTALLATION.md (this file)
```

---

## 🐛 Troubleshooting

### Issue: "Can't connect to MySQL server"

**Solution:**
1. Open XAMPP Control Panel
2. Click "Start" for MySQL
3. Wait for "Running" status
4. Check .env has correct credentials

### Issue: "ModuleNotFoundError: mysqlclient"

**Solution:**
```bash
pip install mysqlclient
```

### Issue: "npm ERR! ERESOLVE could not resolve dependency"

**Solution:**
```bash
rm package-lock.json
npm install
```

### Issue: Frontend shows blank page

**Solution:**
1. Check browser console for errors (F12)
2. Ensure backend is running (http://localhost:8000/admin should work)
3. Check network tab for failed requests
4. Clear browser cache (Ctrl+Shift+Delete)

### Issue: CORS error in browser console

**Solution:**
1. Check Django settings.py has CORS_ALLOWED_ORIGINS
2. Ensure frontend URL is whitelisted
3. Restart Django server

### Issue: Login doesn't work

**Possible causes:**
- Backend not running
- Wrong credentials
- CORS error (check console)

**Solution:**
1. Verify backend running: http://localhost:8000/admin
2. Check admin panel to confirm user exists
3. Check browser console for errors

---

## 📚 Documentation

### For Backend:
See `BACKEND_SETUP.md`

### For Frontend:
See `FRONTEND_SETUP.md`

### For Full Project:
See `README.md`

---

## 🎓 How the System Works

### Rule-Based Recommendation

Example: User with budget='medium' and interest='beach'

1. **System searches:** All destinations where:
   - budget_level = 'medium'
   - category = 'beach'

2. **Returns:** Matching destinations (e.g., Zanzibar)

3. **Then for hotel:**
   - Shows 3-star hotels in destination
   - With price matching 'medium' budget

4. **Finally generates itinerary:**
   - Day 1: Arrival
   - Day 2-N: Activities
   - Day N: Return

### No AI/ML

- No machine learning models
- Only IF-ELSE logic
- Rules hardcoded in views.py
- Transparent and explainable

---

## 🔒 Security Notes

⚠️ **Important:**
1. **Never share .env file** - Contains sensitive data
2. **Change SECRET_KEY** - Generate new one for production
3. **Use strong passwords** - Especially for admin account
4. **Don't use DEBUG=True** - Only for development
5. **Never commit secrets** - Add .env to .gitignore

---

## 📈 Next Steps

1. ✅ Complete installation
2. ✅ Add sample data
3. ✅ Test all features
4. ✅ Customize colors/styling
5. ✅ Add more destinations
6. ✅ Deploy to production

---

## 🆘 Getting Help

1. **Check documentation files:**
   - BACKEND_SETUP.md
   - FRONTEND_SETUP.md
   - README.md

2. **Common issues:**
   - See Troubleshooting section above

3. **Check server logs:**
   - Backend: Terminal showing Django server
   - Frontend: Browser console (F12)

---

## 📞 Contact & Support

For specific issues, provide:
- Error message (exact text)
- What you were doing
- What you expected
- Screenshots if applicable

---

**Congratulations! Your travel planning system is ready!** ✈️

Now you can:
- Register users
- Get recommendations
- Plan trips
- Generate itineraries
- Manage from admin panel

Enjoy! 🎉
