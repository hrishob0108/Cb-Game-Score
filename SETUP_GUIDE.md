# Game Score Application - Frontend & Backend Setup Guide

## Project Structure
```
Game-score/
├── backend/              (Express + MongoDB)
│   ├── .env
│   ├── server.js
│   ├── package.json
│   ├── model/
│   │   └── admin.js      (Mongoose schema)
│   └── routes/
│       └── adminRoute.js (CRUD endpoints)
│
└── vite-project/         (React + Vite)
    ├── .env
    ├── src/
    │   ├── api/
    │   │   └── apiClient.js  (API utility)
    │   ├── components/
    │   │   └── ConnectionTest.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   └── Admin.jsx
    │   └── App.jsx
    └── package.json
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance - already configured in `.env`)
- npm or yarn

## Installation Steps

### 1. Backend Setup

```bash
cd backend
npm install
```

### 2. Frontend Setup

```bash
cd vite-project
npm install
```

## Environment Configuration

### Backend (.env file already configured)
```
Port=5000
Database_URL=mongodb+srv://hrishobp_db_user:hrishobp@cluster0.ezwq6kr.mongodb.net/?appName=Cluster0
```

### Frontend (.env file created)
```
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Terminal 1 - Start Backend Server

```bash
cd backend
npm start
```

**Expected Output:**
```
Connected to MongoDB
Server is running on port 5000
```

### Terminal 2 - Start Frontend Development Server

```bash
cd vite-project
npm run dev
```

**Expected Output:**
```
  ➜  Local:   http://localhost:5173/
```

## Connection Testing

### Via Browser
1. Open `http://localhost:5173/` in your browser
2. Navigate to the **Home** page
3. You should see a **Connection Test** component at the top showing:
   - ✓ Backend health status
   - ✓ Database connection status
   - ✓ List of teams in the database

### Via API Testing (Postman/curl)

**Check Backend Health:**
```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-30T..."
}
```

**Get All Teams:**
```bash
curl http://localhost:5000/api/admin
```

**Create a Team:**
```bash
curl -X POST http://localhost:5000/api/admin \
  -H "Content-Type: application/json" \
  -d '{"teamName":"Team A","squidScore":100}'
```

**Update Score by Team Name:**
```bash
curl -X PATCH http://localhost:5000/api/admin/update-score/mugiwaras \
  -H "Content-Type: application/json" \
  -d '{"score":50}'
```

## Available Backend Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin` | Create new team |
| GET | `/api/admin` | Get all teams |
| GET | `/api/admin/:id` | Get team by ID |
| PUT | `/api/admin/:id` | Update team by ID |
| DELETE | `/api/admin/:id` | Delete team by ID |
| PATCH | `/api/admin/update-score/:teamName` | Update score by team name |

## API Client Functions (Frontend)

Located in `src/api/apiClient.js`:

```javascript
// Get all teams
await teamAPI.getAllTeams()

// Create team
await teamAPI.createTeam('teamName', 100)

// Get team by ID
await teamAPI.getTeamById('id')

// Update team
await teamAPI.updateTeam('id', 'teamName', 150)

// Delete team
await teamAPI.deleteTeam('id')

// Update score by team name
await teamAPI.updateScoreByTeamName('teamName', 50)
```

## Troubleshooting

### Backend Won't Start
- Check MongoDB connection string in `.env`
- Ensure Port 5000 is not in use: `lsof -i :5000`
- Delete `node_modules` and reinstall: `npm install`

### Frontend Can't Connect to Backend
- Verify backend is running on port 5000
- Check VITE_API_URL in frontend `.env`
- Open browser console (F12) to check network errors
- Ensure CORS is enabled (it is in server.js)

### Connection Test Shows Error
- Check if MongoDB is accessible (check connection string)
- Verify network connectivity
- Check browser console for detailed error messages

### Teams Not Showing in Home Page
- Connection Test component will show if database is working
- Check if any teams are in the database via `/api/admin` endpoint
- Check browser localStorage for existing teams

## Features Implemented

✓ Express.js backend with MongoDB  
✓ CRUD operations for team scores  
✓ Score update by team name  
✓ Frontend API client utility  
✓ Connection testing component  
✓ CORS enabled for frontend-backend communication  
✓ Error handling and validation  
✓ Environment configuration  

## Next Steps

1. Populate the database with teams from teams.json
2. Integrate team creation/update endpoints in Admin panel
3. Sync frontend state with backend database
4. Add authentication for admin operations
5. Deploy to cloud (Azure/Heroku)
