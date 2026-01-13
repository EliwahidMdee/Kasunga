# Setup Instructions - Production vs Testing

## Overview

This project supports two database configurations:

1. **SQLite** (for testing/development without MySQL)
2. **MySQL** (for production, as originally intended)

---

## Testing Setup (Current Configuration)

The current setup uses SQLite for easy testing without requiring MySQL installation.

### .env Configuration for Testing
```
USE_SQLITE=True
DEBUG=True
SECRET_KEY=django-insecure-(&i&ll(=3xdz&3j#z%pwm)v6=@i+@g273s((sl)9bt=#$x1s@o
```

### Quick Start
```bash
cd backend/config
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

---

## Production Setup (MySQL)

For production deployment, use MySQL as described in the original documentation.

### Prerequisites
- MySQL Server (XAMPP or standalone)
- MySQL running on localhost:3306

### Step 1: Create MySQL Database
```sql
CREATE DATABASE travel_db;
```

### Step 2: Update .env Configuration
Create or edit `backend/config/.env`:
```
USE_SQLITE=False
DEBUG=True
SECRET_KEY=django-insecure-(&i&ll(=3xdz&3j#z%pwm)v6=@i+@g273s((sl)9bt=#$x1s@o

# MySQL Configuration
DB_NAME=travel_db
DB_USER=root
DB_PASSWORD=
DB_HOST=127.0.0.1
DB_PORT=3306
```

### Step 3: Install MySQL Client
```bash
pip install mysqlclient
```

### Step 4: Run Migrations
```bash
cd backend/config
python manage.py migrate
python manage.py createsuperuser
```

### Step 5: Start Server
```bash
python manage.py runserver
```

---

## Sample Data

Sample data has been added to the database including:

### Destinations
1. **Zanzibar Island** - Beach destination (Medium budget)
2. **Serengeti National Park** - Wildlife safari (High budget)
3. **Mount Kilimanjaro** - Adventure climbing (High budget)
4. **Dar es Salaam** - City tour (Low budget)

### Hotels
1. **Zanzibar Beach Resort** - 3-star hotel in Zanzibar
2. **Serengeti Safari Lodge** - 4-star lodge in Serengeti

### Transport Options
1. **Flight** - Dar es Salaam to Zanzibar
2. **Bus** - Dar es Salaam to Arusha
3. **Car** - Arusha to Serengeti

### Test User
- Username: `testuser`
- Password: `testpass123`
- Email: `test@example.com`

### Admin User
- Username: `admin`
- Password: `admin123`
- Email: `admin@example.com`

---

## API Testing

All API endpoints are working correctly:

### User Management
- ✅ POST `/api/users/` - User registration
- ✅ POST `/api/auth-token/` - Login and get token

### Destinations
- ✅ GET `/api/destinations/` - Get all destinations
- ✅ GET `/api/destinations/recommended/?budget=medium&interest=beach` - Get recommendations

### Hotels
- ✅ GET `/api/hotels/` - Get all hotels
- ✅ GET `/api/hotels/recommended/?destination_id=1&budget=medium` - Get recommendations

### Transport
- ✅ GET `/api/transports/` - Get all transport options
- ✅ GET `/api/transports/recommended/?distance_km=150` - Get recommendations

### Preferences
- ✅ POST `/api/preferences/` - Create user preferences
- ✅ GET `/api/preferences/my_preferences/` - Get user preferences

---

## Frontend Setup

### Install Dependencies
```bash
cd fontend
npm install
```

### Development Server
```bash
npm start
```
Opens at `http://localhost:3000`

### Production Build
```bash
npm run build
```

The build is already tested and working. Production files are in `fontend/build/` directory.

---

## What Works

✅ Backend Django API with all endpoints  
✅ Frontend React application (built successfully)  
✅ Database models and migrations  
✅ User authentication with tokens  
✅ Rule-based recommendation engine  
✅ Sample data loaded  
✅ Admin panel configured  
✅ CORS configuration for frontend  
✅ SQLite support for testing  
✅ MySQL support for production  

---

## Next Steps

1. **For immediate testing**: Everything is ready to use with SQLite
2. **For production**: Follow MySQL setup instructions above
3. **Add more data**: Use Django admin panel at `http://localhost:8000/admin`
4. **Deploy**: Follow deployment guides in BACKEND_SETUP.md and FRONTEND_SETUP.md

---

## Important Notes

- The `.env` file is in `.gitignore` for security
- `.env.example` is provided as a template
- For production, change `SECRET_KEY` and set `DEBUG=False`
- The system works with both SQLite (testing) and MySQL (production)

---

## Troubleshooting

### Issue: "Can't connect to MySQL server"
**Solution**: Set `USE_SQLITE=True` in .env for testing, or install and start MySQL

### Issue: "ModuleNotFoundError: mysqlclient"
**Solution**: For SQLite, this is not needed. For MySQL: `pip install mysqlclient`

### Issue: Frontend can't reach backend
**Solution**: Ensure backend is running on port 8000 and frontend uses the proxy

---

**The project is fully implemented and ready for use!**
