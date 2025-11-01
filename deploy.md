# Deployment Guide

## Prerequisites
1. GitHub account
2. Render account
3. MySQL database (can be created on Render)

## Step 1: Push to GitHub

1. Initialize git repository:
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Create GitHub repository and push:
```bash
git remote add origin https://github.com/yourusername/mgnrega-project.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy on Render

### Option A: Using render.yaml (Recommended)
1. Connect your GitHub repository to Render
2. Render will automatically detect the `render.yaml` file
3. Configure environment variables in Render dashboard

### Option B: Manual Setup

#### Backend Service
1. Create new Web Service
2. Connect GitHub repository
3. Configure:
   - **Build Command**: `cd backend && npm install && npx prisma generate`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Node.js

#### Frontend Service
1. Create new Static Site
2. Connect GitHub repository
3. Configure:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`

#### Database
1. Create MySQL database on Render
2. Note the connection string

## Step 3: Environment Variables

### Backend Environment Variables
Set these in Render dashboard:

```
DATABASE_URL=mysql://username:password@host:port/database
MGNREGA_API_KEY=your_actual_api_key
MGNREGA_API_URL=https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722?api-key=YOUR_API_KEY&format=json&filters%5Bstate_name%5D=ANDHRA%20PRADESH
CRON_SCHEDULE=0 2 1 * *
NODE_ENV=production
```

### Frontend Environment Variables
```
VITE_API_BASE=https://your-backend-service.onrender.com/api
```

## Step 4: Database Migration

After deployment, run database migrations:
1. Go to Render dashboard
2. Open your backend service
3. Go to "Shell" tab
4. Run: `npx prisma migrate deploy`

## Step 5: Verify Deployment

1. Check backend health: `https://your-backend.onrender.com/api/states`
2. Check frontend: `https://your-frontend.onrender.com`

## Troubleshooting

### Common Issues:
1. **Database connection**: Ensure DATABASE_URL is correct
2. **CORS errors**: Backend should allow frontend domain
3. **Build failures**: Check Node.js version compatibility
4. **API errors**: Verify MGNREGA API key is valid

### Logs:
- Check Render service logs for detailed error information
- Backend logs show database and API issues
- Frontend build logs show compilation errors