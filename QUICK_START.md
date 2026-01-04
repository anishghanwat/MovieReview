# Quick Start Guide - Movie Review App

## 🚀 Fast Setup (5 minutes)

### Step 1: Environment Files

**Backend** - Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/moviereview
JWT_SECRET=my-super-secret-jwt-key-12345
```

**Frontend** - Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 2: Install Dependencies

```bash
# From root directory
npm run install-all
```

### Step 3: Start MongoDB

Make sure MongoDB is running on your system.

### Step 4: Seed Database

```bash
cd backend
npm run seed
```

This creates:
- 20 movies with images
- 8 sample users (password: `password123`)
- Multiple reviews

### Step 5: Create Admin User

1. Register a new user through the frontend (Sign Up page)
2. In MongoDB, update the user:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

### Step 6: Run Application

**Option A: Both servers together**
```bash
npm run dev
```

**Option B: Separate terminals**
```bash
# Terminal 1
npm run server

# Terminal 2
npm run client
```

### Step 7: Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🎯 Test Credentials

After seeding:
- **Regular Users**: Use any email from seed data with password `password123`
- **Admin**: Create new user and update role in MongoDB to "admin"

## ✅ Verify Everything Works

1. ✅ Visit http://localhost:3000
2. ✅ See home page with analytics
3. ✅ Browse movies
4. ✅ Register/Login
5. ✅ Create a review
6. ✅ (As admin) Create a movie
7. ✅ Test search and filter
8. ✅ Check watchlist feature

## 🐳 Docker Alternative

```bash
docker-compose -f docker-compose.dev.yml up --build
```

## 📚 Full Documentation

- See `README.md` for complete setup
- See `DOCKER.md` for Docker details
- See `ASSESSMENT_CHECKLIST.md` for assessment prep

