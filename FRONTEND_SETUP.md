# Frontend Setup Guide

## Quick Start

### 1. Prerequisites
- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### 2. Installation

```bash
# Navigate to frontend directory
cd fontend

# Install dependencies
npm install
```

This installs:
- React 19
- React Router v6
- Axios (for API calls)
- All development dependencies

### 3. Configure Backend Connection

#### Option A: Using Proxy (Recommended for Development)
Already configured in `package.json`:
```json
"proxy": "http://localhost:8000"
```

#### Option B: Manual API URL Configuration
Edit `src/api.js`:
```javascript
const API_URL = 'http://localhost:8000/api';
```

### 4. Start Development Server

```bash
npm start
```

Opens automatically at: http://localhost:3000

---

## Project Structure

```
fontend/
├── public/
│   ├── index.html           # Main HTML file
│   └── favicon.ico
├── src/
│   ├── App.js               # Main component with all UI
│   ├── App.css              # All styling
│   ├── api.js               # API service layer
│   ├── index.js             # React entry point
│   └── index.css            # Global styles
├── package.json             # Dependencies and scripts
└── README.md                # Project documentation
```

---

## Components Overview

All components are in `src/App.js`:

### 1. Register Component
**Purpose:** User registration

**Features:**
- Username, email, password validation
- Password confirmation check
- Error/success messages
- Automatic login redirect on success

**Props:**
- `onSuccess` - Callback after registration
- `onSwitchToLogin` - Switch to login form

### 2. Login Component
**Purpose:** User authentication

**Features:**
- Username and password input
- Session token storage
- Error handling
- Register redirect

**Props:**
- `onSuccess` - Callback after login
- `onSwitchToRegister` - Switch to register form

### 3. TravelPreference Component
**Purpose:** Set user travel preferences

**Features:**
- Budget selection (low, medium, high)
- Interest category selection (beach, wildlife, etc.)
- Number of travelers input
- Preference saving to backend

**Props:**
- `onNext` - Callback with preferences data

### 4. TravelPlanning Component
**Purpose:** Multi-step trip planning

**Steps:**
1. **Step 1:** Enter trip dates and destination
2. **Step 2:** Select from recommended destinations
3. **Step 3:** Select from recommended hotels
4. **Step 4:** View complete travel plan

**Props:**
- `preferences` - User preferences object
- `onBack` - Go back to dashboard

### 5. Landing Page
**Purpose:** Non-authenticated user interface

**Sections:**
- Hero section with login/register buttons
- Features section explaining the system
- Responsive design

### 6. Dashboard
**Purpose:** Authenticated user home

**Features:**
- Welcome message
- Quick access to trip planning

---

## API Integration

### API Service (src/api.js)

Handles all backend communication:

```javascript
// Authentication
registerUser(userData)
loginUser(username, password)

// Preferences
getUserPreferences()
createUserPreferences(data)
updateUserPreferences(id, data)

// Destinations
getDestinations()
getRecommendedDestinations(budget, interest, country)

// Hotels
getRecommendedHotels(destinationId, budget)

// Transport
getRecommendedTransport(distanceKm, budget)

// Travel Plans
getTravelPlans()
createTravelPlan(data)
createTravelPlanWithRecommendations(data)
generateItinerary(travelPlanId)
```

### Making API Calls

```javascript
import * as api from './api';

// Example: Get recommended destinations
const destinations = await api.getRecommendedDestinations(
  'medium',      // budget
  'beach',       // interest
  'Tanzania'     // country (optional)
);
```

### Authentication

Token stored in localStorage:
```javascript
// After login
localStorage.setItem('token', response.data.token);
localStorage.setItem('username', response.data.username);

// Token automatically added to all requests
// (handled in api.js interceptor)

// Logout
localStorage.removeItem('token');
localStorage.removeItem('username');
```

---

## Styling

### CSS Structure

**Location:** `src/App.css`

**Sections:**
- Global Styles
- Navbar
- Buttons
- Landing Page
- Authentication Pages
- Forms
- Messages
- Recommendations Grid
- Plan Summary
- Dashboard
- Responsive Design

### Color Scheme

```
Primary: #667eea (Purple)
Secondary: #764ba2 (Dark Purple)
Success: #4CAF50 (Green)
Error: #f44336 (Red)
Background: #f5f5f5 (Light Gray)
Text: #333 (Dark Gray)
```

### Responsive Breakpoints

```css
Desktop: 1200px+
Tablet: 768px - 1199px
Mobile: 480px - 767px
Small Mobile: < 480px
```

---

## User Flow

### 1. First-Time User
```
Landing Page
    ↓
Register → Login → Set Preferences → Plan Trip → View Itinerary
```

### 2. Returning User
```
Login → Dashboard → Plan Trip → View Results
```

### 3. Trip Planning Flow
```
Enter Dates & Location
    ↓
View Destination Recommendations (rule-based)
    ↓
Select Destination
    ↓
View Hotel Recommendations (rule-based)
    ↓
Select Hotel
    ↓
System Creates Complete Plan with Itinerary
```

---

## State Management

Uses React Hooks:

```javascript
// Page state
const [currentPage, setCurrentPage] = useState('landing');

// Authentication state
const [isAuthenticated, setIsAuthenticated] = useState(false);

// Form data state
const [formData, setFormData] = useState({ ... });

// Loading and error states
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
```

---

## Common Tasks

### Change API URL

Edit `src/api.js`:
```javascript
const API_URL = 'http://your-backend-url/api';
```

### Add New Component

Option 1: Add to App.js (current structure)
Option 2: Create separate files in `src/components/`

### Modify Styling

Edit `src/App.css` sections:
- Global styles at top
- Component-specific styles below
- Responsive styles at bottom

### Add Form Validation

Example in `Register` component:
```javascript
if (formData.password !== formData.confirmPassword) {
  setError('Passwords do not match');
  return;
}
```

### Handle API Errors

```javascript
try {
  const response = await api.someEndpoint(data);
  // Success
} catch (err) {
  const errorMsg = err.response?.data?.error || 'An error occurred';
  setError(errorMsg);
}
```

---

## Available Scripts

### npm start
Runs development server at http://localhost:3000

```bash
npm start
```

### npm build
Creates optimized production build

```bash
npm run build
```

Output: `build/` directory

### npm test
Runs test suite

```bash
npm test
```

### npm eject
⚠️ Exposes create-react-app configuration (irreversible)

```bash
npm eject
```

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Performance Optimization

1. **Code Splitting:** React automatically splits routes
2. **Image Optimization:** Use appropriate image sizes
3. **Caching:** Leverage browser caching
4. **Minification:** Automatic in production build

---

## Deployment

### Build for Production

```bash
npm run build
```

Creates optimized files in `build/` directory.

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login and deploy
netlify login
netlify deploy --prod
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Deploy to GitHub Pages

```bash
# Add to package.json
"homepage": "https://yourusername.github.io/yourrepo"

# Install gh-pages
npm install --save-dev gh-pages

# Add scripts to package.json
"predeploy": "npm run build",
"deploy": "gh-pages -d build"

# Deploy
npm run deploy
```

---

## Troubleshooting

### Issue: npm start fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try again
npm start
```

### Issue: Can't connect to backend
**Symptoms:** CORS errors or 404 responses

**Solutions:**
1. Ensure backend is running: `python manage.py runserver`
2. Check backend is on port 8000
3. Verify proxy in package.json
4. Check CORS settings in Django settings.py

### Issue: Token not persisting
**Problem:** Login token disappears on page refresh

**Solution:** Check localStorage:
```javascript
// In browser console
localStorage.getItem('token')  // Should show token
```

### Issue: Slow performance
**Solutions:**
1. Check for unnecessary re-renders
2. Use React DevTools Profiler
3. Optimize images
4. Minify CSS/JS in production

### Issue: Blank page
**Solutions:**
1. Check browser console for errors
2. Ensure backend is running
3. Clear browser cache
4. Check network tab in DevTools

---

## Code Comments Guide

Comments are beginner-friendly:

```javascript
// Simple one-line comments explain "what" not "how"
// ==================== SECTION HEADERS ====================

// Multi-line comments for important logic
/**
 * Function purpose
 * @param param1 - What this does
 * @returns What it returns
 */
```

---

## Environment Variables (Future)

Create `.env` file:
```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENV=development
```

Access in code:
```javascript
const API_URL = process.env.REACT_APP_API_URL;
```

---

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Start dev server: `npm start`
3. ✅ Start backend: `python manage.py runserver`
4. ✅ Test user flow
5. ✅ Add sample data in admin
6. ✅ Deploy when ready

---

## Additional Resources

- [React Documentation](https://react.dev)
- [Axios Documentation](https://axios-http.com)
- [MDN Web Docs](https://developer.mozilla.org)
- [CSS Tricks](https://css-tricks.com)

---

**Happy coding! 🚀**
