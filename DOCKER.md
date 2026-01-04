# Docker Setup Guide

This guide explains how to run the Movie Review App using Docker.

## Prerequisites

- Docker Desktop installed (or Docker Engine + Docker Compose)
- At least 4GB of free disk space

## Quick Start

### Development Mode (Recommended for Development)

This mode includes hot reload for both frontend and backend:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

### Production Mode

This mode builds optimized production images:

```bash
docker-compose up --build
```

## Services

The Docker setup includes:

1. **MongoDB** - Database service (port 27017)
2. **Backend** - Express.js API server (port 5000)
3. **Frontend** - React application (port 3000)

## Environment Variables

Create a `.env` file in the root directory:

```env
JWT_SECRET=your-secret-key-change-in-production-use-a-strong-random-string
```

## Common Docker Commands

### Start Services
```bash
# Development mode
docker-compose -f docker-compose.dev.yml up -d

# Production mode
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Rebuild After Changes
```bash
docker-compose up --build
```

### Seed Database
```bash
# Development
docker-compose -f docker-compose.dev.yml exec backend npm run seed

# Production
docker-compose exec backend npm run seed
```

### Access MongoDB Shell
```bash
docker-compose exec mongodb mongosh moviereview
```

### Remove All Data (Clean Start)
```bash
docker-compose down -v
```

## Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

## Troubleshooting

### Port Already in Use
If ports 3000, 5000, or 27017 are already in use, you can modify the port mappings in `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Change host port
```

### MongoDB Connection Issues
Make sure MongoDB container is healthy:
```bash
docker-compose ps
```

### Frontend Can't Connect to Backend
In development mode, ensure `VITE_API_URL` is set correctly. The frontend should use `http://localhost:5000/api` to connect to the backend running on the host.

### Rebuild After Dependency Changes
If you add new npm packages:
```bash
docker-compose build --no-cache
docker-compose up
```

## Production Deployment

For production deployment:

1. Update environment variables in `.env`
2. Use production docker-compose:
   ```bash
   docker-compose up -d
   ```
3. Set up reverse proxy (nginx/traefik) if needed
4. Configure SSL certificates
5. Set up database backups

## Dockerfile Details

### Backend Dockerfile
- Uses Node.js 18 Alpine (lightweight)
- Installs dependencies
- Exposes port 5000
- Runs `npm start` in production

### Frontend Dockerfile
- Multi-stage build (build + nginx)
- Builds React app with Vite
- Serves with Nginx
- Includes React Router support
- Optimized for production

### Development Dockerfiles
- Volume mounting for hot reload
- Nodemon for backend auto-restart
- Vite dev server for frontend
- Full source code access

