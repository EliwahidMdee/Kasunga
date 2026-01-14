# Travel Planning & Recommendation System

## Project Overview

This is a **rule-based travel planning and recommendation system** built with Django and React. It helps users plan their trips by:

1. Setting travel preferences (budget, interests)
2. Receiving personalized destination recommendations
3. Selecting hotels based on budget
4. Automatically generating travel itineraries

**Key Feature:** No AI/ML - purely rule-based IF-ELSE logic for recommendations.

---

## 📄 Documentation

### Software Requirements Specification (SRS)
A comprehensive IEEE 830-1998 compliant SRS document is available for this project:

- **Generate SRS**: Run `python3 generate_srs.py` to create the document
- **View Guide**: See [SRS_GENERATION_GUIDE.md](SRS_GENERATION_GUIDE.md) for details
- **Features**: Complete with use cases, user stories, feasibility study, budget analysis, and PlantUML diagrams

---

## System Architecture

### Backend (Django REST API)
- **Framework:** Django 6.0 with Django REST Framework
- **Database:** MySQL (via XAMPP)
- **Port:** 8000

### Frontend (React)
- **Framework:** React 19
- **Port:** 3000
- **State Management:** React hooks (useState, useEffect)

---

## Database Models

### 1. **UserPreference**
Stores user preferences:
- Budget (low, medium, high)
- Interest (beach, wildlife, historical, city_tour, adventure, culture)
- Number of travelers

### 2. **Destination**
Predefined travel destinations:
- Name, country, city
- Category and budget level
- Description and image

### 3. **Hotel**
Hotels in destinations:
- Star rating (1-5)
- Price per night
- Budget category
- Amenities

### 4. **Transport**
Transportation options:
- Type (bus, train, flight, car)
- Distance and duration
- Price

### 5. **TravelPlan**
User's created travel plans:
- Links to destination, hotel, transport
- Travel dates
- Total budget

### 6. **Itinerary**
Day-by-day travel schedule:
- Activities for each day
- Accommodation details

---

## Rule-Based Recommendation Engine

### Destination Recommendation Rules
```
IF budget = 'low' → Filter destinations with budget_level = 'low'
IF interest = 'beach' → Filter destinations with category = 'beach'
IF country specified → Filter by country
```

### Hotel Recommendation Rules
```
IF budget = 'low' → Show 1-2 star hotels
IF budget = 'medium' → Show 3-star hotels
IF budget = 'high' → Show 4-5 star hotels
```

### Transport Recommendation Rules
```
IF distance < 200km → Recommend Bus
IF 200km ≤ distance ≤ 1000km → Recommend Train
IF distance > 1000km → Recommend Flight
```

### Itinerary Generation Rules
```
Day 1: Arrival and hotel check-in
Middle Days: Attractions and activities
Last Day: Shopping and return
```

---

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL Server (XAMPP)
- Git

### Backend Setup

#### 1. Navigate to backend directory
```bash
cd backend/config
```

#### 2. Create virtual environment
```bash
python -m venv venv
source venv/Scripts/activate  # On Windows
```

#### 3. Install dependencies
```bash
pip install -r requirements.txt
```

#### 4. Configure .env file
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

#### 5. Create MySQL database
```sql
CREATE DATABASE travel_db;
```

#### 6. Run migrations
```bash
python manage.py migrate
```

#### 7. Create admin user
```bash
python manage.py createsuperuser
```

#### 8. Load initial data (optional)
```bash
python manage.py loaddata initial_destinations.json
```

#### 9. Run server
```bash
python manage.py runserver
```

Server runs at: http://localhost:8000

### Frontend Setup

#### 1. Navigate to frontend directory
```bash
cd fontend
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Start development server
```bash
npm start
```

Server runs at: http://localhost:3000

---

## API Endpoints

### Authentication
- `POST /api/users/` - Register new user
- `POST /api-auth/login/` - Login user

### Preferences
- `GET /api/preferences/my_preferences/` - Get user preferences
- `POST /api/preferences/` - Create preferences
- `PATCH /api/preferences/{id}/` - Update preferences

### Destinations
- `GET /api/destinations/` - Get all destinations
- `GET /api/destinations/recommended/` - Get recommended destinations
  - Query params: `budget`, `interest`, `country`

### Hotels
- `GET /api/hotels/` - Get all hotels
- `GET /api/hotels/recommended/` - Get recommended hotels
  - Query params: `destination_id`, `budget`

### Transport
- `GET /api/transports/` - Get all transport
- `GET /api/transports/recommended/` - Get recommended transport
  - Query params: `distance_km`, `budget`

### Travel Plans
- `GET /api/travel-plans/` - Get user's travel plans
- `POST /api/travel-plans/` - Create travel plan
- `POST /api/travel-plans/create_plan_with_recommendations/` - Create complete plan
- `POST /api/travel-plans/{id}/generate_itinerary/` - Generate itinerary

### Itineraries
- `GET /api/itineraries/` - Get itineraries
- `GET /api/itineraries/{id}/` - Get itinerary details

---

## Project Structure

```
UPENDO/
├── backend/
│   └── config/
│       ├── manage.py
│       ├── requirements.txt
│       ├── .env
│       ├── config/
│       │   ├── settings.py
│       │   ├── urls.py
│       │   ├── asgi.py
│       │   └── wsgi.py
│       └── api/
│           ├── models.py
│           ├── views.py
│           ├── serializers.py
│           ├── admin.py
│           └── migrations/
│               └── 0001_initial.py
│
└── fontend/
    ├── package.json
    ├── public/
    └── src/
        ├── App.js (All components here)
        ├── App.css
        ├── api.js (API service)
        └── index.js
```

---

## Frontend Components

### 1. Register
User registration form with validation

### 2. Login
User authentication

### 3. TravelPreference
Set budget, interest, and number of travelers

### 4. TravelPlanning
Multi-step trip planning:
- Step 1: Enter trip dates and destination
- Step 2: Select from recommended destinations
- Step 3: Select from recommended hotels
- Step 4: View complete travel plan

---

## Admin Panel

Access at: http://localhost:8000/admin

Admin can:
- Add/edit destinations
- Manage hotels
- Configure transport options
- Update prices and availability
- View user travel plans

---

## Example Workflow

1. **User registers** → API creates User account
2. **User sets preferences** → Budget = 'medium', Interest = 'beach'
3. **User plans trip** → Enters dates and destination (Tanzania)
4. **System recommends**:
   - Destinations: All with budget_level='medium' AND category='beach'
   - Hotels: 3-star hotels in selected destination
   - Transport: Based on distance
5. **System generates itinerary** → Day-by-day schedule

---

## Configuration

### Environment Variables (.env)
```
DB_NAME - MySQL database name
DB_USER - MySQL username (default: root)
DB_PASSWORD - MySQL password (default: empty)
DB_HOST - Database host (default: 127.0.0.1)
DB_PORT - Database port (default: 3306)
DEBUG - Django debug mode (True/False)
SECRET_KEY - Django secret key
```

### CORS Settings
Frontend can communicate with backend on:
- http://localhost:3000
- http://127.0.0.1:3000

---

## Testing

### Backend Tests
```bash
python manage.py test
```

### Frontend Tests
```bash
npm test
```

---

## Troubleshooting

### Issue: MySQL connection fails
**Solution:** 
- Ensure XAMPP MySQL is running
- Check DB credentials in .env file
- Verify database exists

### Issue: CORS errors
**Solution:**
- Check CORS_ALLOWED_ORIGINS in settings.py
- Ensure frontend URL is whitelisted

### Issue: Frontend can't reach backend
**Solution:**
- Ensure backend is running on port 8000
- Check proxy setting in package.json

---

## Future Enhancements

1. User authentication with JWT
2. Email verification
3. Payment integration
4. Reviews and ratings
5. Social sharing
6. Mobile app version
7. Advanced filtering options
8. Budget calculator
9. Multi-language support
10. Integration with booking APIs

---

## License

MIT License

---

## Support

For issues or questions, please create an issue in the repository.

---

**Happy Traveling! ✈️**
