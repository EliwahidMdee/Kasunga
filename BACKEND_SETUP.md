# Backend Setup Guide

## Quick Start

### 1. Prerequisites
- Python 3.10 or higher
- MySQL Server (XAMPP recommended)
- Virtual Environment

### 2. Initial Setup

```bash
# Navigate to backend directory
cd backend/config

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Database

#### Start MySQL Server
- Open XAMPP Control Panel
- Click "Start" next to MySQL
- Should show "Running" status

#### Create Database

```bash
# Option 1: Using MySQL Command Line
mysql -u root
CREATE DATABASE travel_db;
EXIT;

# Option 2: Using phpMyAdmin
# 1. Open http://localhost/phpmyadmin
# 2. Click "New"
# 3. Enter database name: travel_db
# 4. Click "Create"
```

### 5. Configure Environment Variables

Create `.env` file in `backend/config/`:

```
DB_NAME=travel_db
DB_USER=root
DB_PASSWORD=
DB_HOST=127.0.0.1
DB_PORT=3306
DEBUG=True
SECRET_KEY=django-insecure-(&i&ll(=3xdz&3j#z%pwm)v6=@i+@g273s((sl)9bt=#$x1s@o
```

### 6. Run Migrations

```bash
python manage.py migrate
```

This creates all database tables.

### 7. Create Admin User (Superuser)

```bash
python manage.py createsuperuser
```

Follow prompts to set:
- Username: admin (recommended)
- Email: your-email@example.com
- Password: Your secure password

### 8. Run Development Server

```bash
python manage.py runserver
```

Output should show:
```
Starting development server at http://127.0.0.1:8000/
```

### 9. Test the API

#### Access Admin Panel
- Visit: http://localhost:8000/admin
- Login with superuser credentials

#### Access API Endpoints
- Visit: http://localhost:8000/api/

### 10. (Optional) Load Sample Data

```bash
python manage.py loaddata api/fixtures/initial_data.json
```

This will add sample destinations, hotels, and transport options.

---

## Project Structure

```
backend/config/
├── manage.py                 # Django management script
├── requirements.txt          # Python dependencies
├── .env                      # Environment variables
├── config/                   # Django settings
│   ├── settings.py          # Main settings file
│   ├── urls.py              # URL routing
│   ├── asgi.py              # ASGI configuration
│   └── wsgi.py              # WSGI configuration
└── api/                      # Main application
    ├── models.py            # Database models
    ├── views.py             # API views
    ├── serializers.py       # DRF serializers
    ├── admin.py             # Admin configuration
    ├── apps.py              # App configuration
    ├── migrations/          # Database migrations
    │   └── 0001_initial.py
    ├── tests.py             # Unit tests
    └── urls.py              # API routes
```

---

## Models Overview

### UserPreference
- **Purpose:** Store user travel preferences
- **Fields:** budget, interest, num_travelers, user

### Destination
- **Purpose:** Travel destinations
- **Fields:** name, country, city, category, budget_level, description

### Hotel
- **Purpose:** Accommodation options
- **Fields:** destination, name, stars, price, amenities

### Transport
- **Purpose:** Transportation options
- **Fields:** origin, destination, type, distance, price

### TravelPlan
- **Purpose:** User's created travel plans
- **Fields:** user, destination, hotel, transport, dates, budget

### Itinerary
- **Purpose:** Daily trip schedule
- **Fields:** travel_plan, day_number, activities

---

## API Endpoints Summary

### User Management
```
POST   /api/users/                           # Register
GET    /api/users/                           # List users (admin)
```

### Preferences
```
GET    /api/preferences/                     # List preferences
POST   /api/preferences/                     # Create preferences
GET    /api/preferences/my_preferences/     # Get current user's preferences
PATCH  /api/preferences/{id}/               # Update preferences
DELETE /api/preferences/{id}/               # Delete preferences
```

### Destinations
```
GET    /api/destinations/                    # List all
GET    /api/destinations/{id}/              # Get one
GET    /api/destinations/recommended/       # Get recommendations
```

### Hotels
```
GET    /api/hotels/                          # List all
GET    /api/hotels/{id}/                    # Get one
GET    /api/hotels/recommended/             # Get recommendations
```

### Transport
```
GET    /api/transports/                      # List all
GET    /api/transports/{id}/                # Get one
GET    /api/transports/recommended/         # Get recommendations
```

### Travel Plans
```
GET    /api/travel-plans/                    # List user's plans
POST   /api/travel-plans/                   # Create plan
GET    /api/travel-plans/{id}/              # Get plan details
PATCH  /api/travel-plans/{id}/              # Update plan
DELETE /api/travel-plans/{id}/              # Delete plan
POST   /api/travel-plans/create_plan_with_recommendations/  # Create with recommendations
POST   /api/travel-plans/{id}/generate_itinerary/          # Generate itinerary
```

### Itineraries
```
GET    /api/itineraries/                     # List user's itineraries
GET    /api/itineraries/{id}/               # Get itinerary details
POST   /api/itineraries/                    # Create itinerary
```

---

## Recommendation Rules

### Destination Recommendation Logic
```python
IF budget = 'low':
    Show destinations with budget_level = 'low'
IF interest = 'beach':
    Show destinations with category = 'beach'
IF country specified:
    Filter by country
RESULT: Combination of all matching destinations
```

### Hotel Recommendation Logic
```python
IF budget = 'low':
    Show 1-2 star hotels with budget_category = 'low'
IF budget = 'medium':
    Show 3-star hotels with budget_category = 'medium'
IF budget = 'high':
    Show 4-5 star hotels with budget_category = 'high'
```

### Transport Recommendation Logic
```python
IF distance < 200km:
    Recommend Bus
ELSE IF 200 <= distance <= 1000:
    Recommend Train
ELSE IF distance > 1000:
    Recommend Flight
```

### Itinerary Generation Logic
```python
Day 1: Arrival and hotel check-in
Days 2-N-1: Activities based on destination category
Day N: Shopping and return
```

---

## Common Commands

### Database Operations
```bash
# Create migrations (after model changes)
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Migrate specific app
python manage.py migrate api

# Revert migrations
python manage.py migrate api zero

# Show migrations
python manage.py showmigrations
```

### Management
```bash
# Create superuser
python manage.py createsuperuser

# Change password
python manage.py changepassword username

# Create cache table
python manage.py createcachetable

# Collect static files
python manage.py collectstatic
```

### Testing
```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test api

# Run with verbosity
python manage.py test --verbosity=2

# Run with coverage
coverage run --source='api' manage.py test
coverage report
```

---

## Troubleshooting

### Issue: MySQL Connection Refused
**Problem:** `(2003, "Can't connect to MySQL server on '127.0.0.1' (10061)")`

**Solutions:**
1. Start MySQL in XAMPP Control Panel
2. Verify MySQL port is 3306 in phpMyAdmin
3. Check .env DB_HOST and DB_PORT are correct
4. Restart XAMPP services

### Issue: ModuleNotFoundError: No module named 'mysqlclient'
**Solution:**
```bash
pip install mysqlclient
```

### Issue: Database doesn't exist
**Solution:**
```bash
# Create database manually in MySQL
mysql -u root
CREATE DATABASE travel_db;
EXIT;

# Then run migrations
python manage.py migrate
```

### Issue: KeyError in settings
**Problem:** `.env` variables not loading

**Solution:**
```bash
# Reinstall python-dotenv
pip install python-dotenv --upgrade

# Ensure .env is in same directory as manage.py
# Ensure syntax is correct: KEY=value
```

### Issue: CORS errors from frontend
**Solution:** Check CORS_ALLOWED_ORIGINS in settings.py:
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]
```

---

## Admin Panel

### Accessing Admin Panel
1. Start Django server: `python manage.py runserver`
2. Visit: http://localhost:8000/admin
3. Login with superuser credentials

### Admin Capabilities
- **Destinations:** Add/edit/delete destinations
- **Hotels:** Manage hotel listings
- **Transport:** Configure transport options
- **Travel Plans:** View user plans
- **Users:** Manage user accounts
- **Preferences:** View user preferences

### Adding Sample Destination
1. Go to Admin Panel
2. Click "Destinations"
3. Click "Add Destination"
4. Fill in details:
   - Name: "Zanzibar Beach"
   - Country: "Tanzania"
   - Category: "Beach"
   - Budget Level: "Medium"
5. Click "Save"

---

## Performance Tips

1. **Database Indexing:** Key fields are already indexed
2. **Caching:** Use Django cache framework for recommendations
3. **Pagination:** API defaults to 10 items per page
4. **Optimization:** Use `select_related()` in queries

---

## Security Notes

⚠️ **Important:**
- Never commit SECRET_KEY to version control
- Store sensitive data in .env file
- Use strong superuser password
- Enable HTTPS in production
- Keep dependencies updated

---

## Next Steps

1. ✅ Start Django server
2. ✅ Access admin panel and add sample data
3. ✅ Test API endpoints with Postman/Insomnia
4. ✅ Connect frontend to API
5. ✅ Deploy to production

---

**Happy coding!** 🚀
