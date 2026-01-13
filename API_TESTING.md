# API Testing Guide

## 📡 Testing the API Endpoints

This guide helps you test all API endpoints using curl, Postman, or browser.

---

## 🚀 Prerequisites

1. Backend running: `python manage.py runserver`
2. MySQL running
3. Admin user created

---

## 🔑 Authentication

### Step 1: Get Auth Token

**Using curl:**
```bash
curl -X POST http://localhost:8000/api-auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your_password"}'
```

**Response:**
```json
{
  "token": "YOUR_AUTH_TOKEN_HERE"
}
```

### Step 2: Use Token in Requests

Replace `YOUR_TOKEN` in all requests below:

```bash
curl -H "Authorization: Token YOUR_TOKEN" \
  http://localhost:8000/api/travel-plans/
```

---

## 👤 User Endpoints

### Register User

**Request:**
```bash
curl -X POST http://localhost:8000/api/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User",
    "password": "testpass123"
  }'
```

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 2,
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

---

## ⚙️ Preference Endpoints

### Get Current User Preferences

**Request:**
```bash
curl -H "Authorization: Token YOUR_TOKEN" \
  http://localhost:8000/api/preferences/my_preferences/
```

**Expected Response:**
```json
{
  "id": 1,
  "user": 1,
  "budget": "medium",
  "interest": "beach",
  "num_travelers": 2,
  "created_at": "2024-01-10T12:00:00Z"
}
```

### Create Preferences

**Request:**
```bash
curl -X POST http://localhost:8000/api/preferences/ \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user": 1,
    "budget": "medium",
    "interest": "beach",
    "num_travelers": 2
  }'
```

### Update Preferences

**Request:**
```bash
curl -X PATCH http://localhost:8000/api/preferences/1/ \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "budget": "high",
    "interest": "adventure",
    "num_travelers": 3
  }'
```

---

## 🏝️ Destination Endpoints

### Get All Destinations

**Request:**
```bash
curl http://localhost:8000/api/destinations/
```

**Response:** List of all destinations

### Get Recommended Destinations

**Request (budget=medium, interest=beach):**
```bash
curl "http://localhost:8000/api/destinations/recommended/?budget=medium&interest=beach"
```

**Request (with country filter):**
```bash
curl "http://localhost:8000/api/destinations/recommended/?budget=medium&interest=beach&country=Tanzania"
```

**Expected Response:**
```json
{
  "count": 2,
  "recommendations": [
    {
      "id": 1,
      "name": "Zanzibar Island",
      "country": "Tanzania",
      "city": "Stone Town",
      "category": "beach",
      "budget_level": "medium",
      "description": "Beautiful beach destination...",
      "best_season": "June to October"
    }
  ]
}
```

### Get Single Destination

**Request:**
```bash
curl http://localhost:8000/api/destinations/1/
```

---

## 🏨 Hotel Endpoints

### Get All Hotels

**Request:**
```bash
curl http://localhost:8000/api/hotels/
```

### Get Recommended Hotels

**Request (for destination 1, budget medium):**
```bash
curl "http://localhost:8000/api/hotels/recommended/?destination_id=1&budget=medium"
```

**Expected Response:**
```json
{
  "count": 1,
  "recommendations": [
    {
      "id": 1,
      "name": "Sunset Beach Hotel",
      "destination": 1,
      "destination_name": "Zanzibar Island",
      "stars": 3,
      "price_per_night": 80.00,
      "budget_category": "medium",
      "description": "Comfortable beachfront hotel...",
      "amenities": "WiFi, Pool, Restaurant, Beach Access"
    }
  ]
}
```

---

## 🚗 Transport Endpoints

### Get All Transport

**Request:**
```bash
curl http://localhost:8000/api/transports/
```

### Get Recommended Transport

**Request (distance 100km, budget medium):**
```bash
curl "http://localhost:8000/api/transports/recommended/?distance_km=100&budget=medium"
```

**Request (distance 500km - train recommended):**
```bash
curl "http://localhost:8000/api/transports/recommended/?distance_km=500&budget=medium"
```

**Request (distance 2000km - flight recommended):**
```bash
curl "http://localhost:8000/api/transports/recommended/?distance_km=2000&budget=high"
```

---

## ✈️ Travel Plan Endpoints

### List User's Travel Plans

**Request:**
```bash
curl -H "Authorization: Token YOUR_TOKEN" \
  http://localhost:8000/api/travel-plans/
```

### Create Travel Plan

**Request:**
```bash
curl -X POST http://localhost:8000/api/travel-plans/ \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "destination": 1,
    "hotel": 1,
    "transport": 1,
    "travel_date": "2024-02-15",
    "return_date": "2024-02-22",
    "budget": 1500.00,
    "num_travelers": 2,
    "notes": "Beach vacation"
  }'
```

### Create Plan with Recommendations (Smart Create)

**Request:**
```bash
curl -X POST http://localhost:8000/api/travel-plans/create_plan_with_recommendations/ \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "travel_date": "2024-02-15",
    "return_date": "2024-02-22",
    "budget": "medium",
    "num_travelers": 2,
    "interest": "beach",
    "country": "Tanzania"
  }'
```

**Expected Response:**
```json
{
  "message": "Travel plan created with recommendations",
  "travel_plan": {
    "id": 1,
    "destination": 1,
    "destination_details": {...},
    "hotel": 1,
    "hotel_details": {...},
    "travel_date": "2024-02-15",
    "return_date": "2024-02-22",
    "budget": "medium",
    "itinerary": {...}
  }
}
```

### Get Travel Plan Detail

**Request:**
```bash
curl -H "Authorization: Token YOUR_TOKEN" \
  http://localhost:8000/api/travel-plans/1/
```

### Generate Itinerary

**Request:**
```bash
curl -X POST http://localhost:8000/api/travel-plans/1/generate_itinerary/ \
  -H "Authorization: Token YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "message": "Itinerary generated for 8 days",
  "itinerary": [
    {
      "id": 1,
      "travel_plan": 1,
      "day_number": 1,
      "activities": "Arrival, Hotel Check-in, Evening exploration"
    },
    {
      "id": 2,
      "travel_plan": 1,
      "day_number": 2,
      "activities": "Main attractions visit, Cultural experience, Lunch"
    }
  ]
}
```

---

## 📅 Itinerary Endpoints

### List Itineraries

**Request:**
```bash
curl -H "Authorization: Token YOUR_TOKEN" \
  http://localhost:8000/api/itineraries/
```

### Get Itinerary Detail

**Request:**
```bash
curl -H "Authorization: Token YOUR_TOKEN" \
  http://localhost:8000/api/itineraries/1/
```

---

## 🧪 Testing Workflow

### Complete Test Scenario

**Step 1: Register User**
```bash
curl -X POST http://localhost:8000/api/users/ \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"john123"}'
```

**Step 2: Get Auth Token**
```bash
curl -X POST http://localhost:8000/api-auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"john123"}'
```
Copy the token from response.

**Step 3: Create Preferences**
```bash
curl -X POST http://localhost:8000/api/preferences/ \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"user":2,"budget":"medium","interest":"beach","num_travelers":2}'
```

**Step 4: Get Recommendations**
```bash
curl "http://localhost:8000/api/destinations/recommended/?budget=medium&interest=beach"
```

**Step 5: Get Hotel Recommendations**
```bash
curl "http://localhost:8000/api/hotels/recommended/?destination_id=1&budget=medium"
```

**Step 6: Create Travel Plan with Recommendations**
```bash
curl -X POST http://localhost:8000/api/travel-plans/create_plan_with_recommendations/ \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "travel_date":"2024-02-15",
    "return_date":"2024-02-22",
    "budget":"medium",
    "num_travelers":2,
    "interest":"beach",
    "country":"Tanzania"
  }'
```

**Step 7: View Itinerary**
```bash
curl -H "Authorization: Token YOUR_TOKEN" \
  http://localhost:8000/api/itineraries/
```

---

## 🛠️ Using Postman

### Import Collection

1. Open Postman
2. Create new collection "Travel API"
3. Add requests:

**Register**
- Method: POST
- URL: http://localhost:8000/api/users/
- Body (JSON): 
```json
{"username":"test","email":"test@example.com","password":"test123"}
```

**Login**
- Method: POST
- URL: http://localhost:8000/api-auth/login/
- Body (JSON):
```json
{"username":"test","password":"test123"}
```

**Get Recommendations**
- Method: GET
- URL: http://localhost:8000/api/destinations/recommended/?budget=medium&interest=beach
- Headers: None needed (public endpoint)

**Create Travel Plan**
- Method: POST
- URL: http://localhost:8000/api/travel-plans/create_plan_with_recommendations/
- Headers: `Authorization: Token YOUR_TOKEN`
- Body (JSON):
```json
{
  "travel_date": "2024-02-15",
  "return_date": "2024-02-22",
  "budget": "medium",
  "num_travelers": 2,
  "interest": "beach",
  "country": "Tanzania"
}
```

---

## 📊 API Response Examples

### Successful Response
```json
{
  "id": 1,
  "name": "Zanzibar Island",
  "country": "Tanzania",
  "created_at": "2024-01-10T12:00:00Z"
}
```

### Error Response
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### Paginated Response
```json
{
  "count": 10,
  "next": "http://localhost:8000/api/destinations/?page=2",
  "previous": null,
  "results": [...]
}
```

---

## 📝 HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 204 | No Content - Successful deletion |
| 400 | Bad Request - Invalid data |
| 401 | Unauthorized - Need authentication |
| 403 | Forbidden - Permission denied |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Backend issue |

---

## 🔍 Debugging Tips

### Check Token Validity
```bash
curl -H "Authorization: Token YOUR_TOKEN" \
  http://localhost:8000/api/preferences/my_preferences/
```

If you get 401, token is invalid or expired.

### Check CORS
If frontend can't call API:
1. Check browser console for CORS errors
2. Verify CORS_ALLOWED_ORIGINS in settings.py
3. Ensure frontend URL is whitelisted

### Check Data
Visit admin panel: http://localhost:8000/admin
- Verify destinations exist
- Check hotel records
- Confirm travel plans saved

---

## ✅ Validation Rules

### Destination
- name: Required, max 200 chars
- country: Required, max 100 chars
- category: One of (beach, wildlife, historical, city_tour, adventure, culture)
- budget_level: One of (low, medium, high)

### Hotel
- name: Required, max 200 chars
- stars: 1-5
- price_per_night: Decimal, positive
- budget_category: One of (low, medium, high)

### Travel Plan
- travel_date: Date (YYYY-MM-DD format)
- return_date: Date (must be >= travel_date)
- budget: Decimal, positive
- num_travelers: Integer, >= 1

---

## 🎯 Test Cases

### Test 1: Full Trip Planning
✅ Register → Login → Set Preferences → Get Recommendations → Create Plan → Generate Itinerary

### Test 2: Recommendation Logic
✅ Test budget filtering
✅ Test interest filtering
✅ Test country filtering

### Test 3: Transport Rules
✅ Distance < 200km → Bus
✅ Distance 200-1000km → Train
✅ Distance > 1000km → Flight

### Test 4: Hotel Budget Rules
✅ Low budget → 1-2 stars
✅ Medium budget → 3 stars
✅ High budget → 4-5 stars

---

## 📞 Common Test Errors

| Error | Cause | Solution |
|-------|-------|----------|
| 404 Not Found | Wrong URL or resource doesn't exist | Check URL spelling, verify resource exists in DB |
| 401 Unauthorized | Missing or invalid token | Include valid token in Authorization header |
| 400 Bad Request | Invalid data format | Check JSON syntax, required fields |
| 500 Server Error | Backend crash | Check Django server logs |
| CORS error | Domain not whitelisted | Add frontend URL to CORS_ALLOWED_ORIGINS |

---

**Happy testing!** 🧪
