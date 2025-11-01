# MGNREGA Performance Analytics Dashboard

A comprehensive web application for analyzing MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act) performance data across Indian states and districts.

## Features

- 📊 **Performance Analytics**: Track key MGNREGA metrics across districts and states
- 📈 **Trend Analysis**: Visualize performance trends over time
- 🔄 **District Comparison**: Compare performance between different districts
- 🌐 **Multi-language Support**: Available in multiple Indian languages
- 🎤 **Speech Control**: Voice navigation capabilities
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⏰ **Automated Data Sync**: Regular data updates via CRON jobs

## Tech Stack

### Backend
- Node.js with Express.js
- Prisma ORM with MySQL database
- CRON jobs for automated data fetching
- RESTful API architecture

### Frontend
- React 19 with Vite
- Recharts for data visualization
- i18next for internationalization
- Responsive CSS design

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL database
- MGNREGA API access key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd mgnrega-project
```

2. Install dependencies:
```bash
npm run install-all
```

3. Set up environment variables:
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your database and API credentials

# Frontend (if needed)
cp frontend/.env.example frontend/.env
```

4. Set up the database:
```bash
cd backend
npm run db:migrate
npm run db:generate
```

5. Start the development servers:
```bash
# Backend (runs on port 5000)
npm run dev-backend

# Frontend (runs on port 3000)
npm run dev-frontend
```

## Deployment

### Render Deployment

This project is configured for deployment on Render with the following services:

1. **Web Service** (Backend API)
2. **Static Site** (Frontend)
3. **MySQL Database**

See deployment configuration in `render.yaml` for details.

### Environment Variables

#### Backend (.env)
```
DATABASE_URL=mysql://username:password@host:port/database
PORT=5000
MGNREGA_API_URL=https://api.data.gov.in/resource/...
MGNREGA_API_KEY=your_api_key
CRON_SCHEDULE=0 2 1 * *
```

#### Frontend (.env)
```
VITE_API_BASE=https://your-backend-url.com/api
```

## API Endpoints

- `GET /api/states` - Get all states
- `GET /api/districts/:stateCode` - Get districts by state
- `GET /api/performance/:districtCode` - Get district performance data
- `GET /api/performance/:districtCode/trend` - Get performance trends
- `GET /api/compare?districtA=X&districtB=Y` - Compare districts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License