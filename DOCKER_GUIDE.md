# Docker Guide for Movie Booking Application

This guide explains how to containerize and run the Movie Booking Application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

## Project Structure

```
moving-booking-app/
├── docker-compose.yml          # Main orchestration file
├── init-mongo.js              # MongoDB initialization script
├── movie-booking-backend/
│   ├── Dockerfile             # Backend container configuration
│   └── .dockerignore          # Backend build exclusions
└── movie-booking-frontend/
    ├── Dockerfile             # Frontend container configuration
    ├── nginx.conf             # Nginx configuration
    └── .dockerignore          # Frontend build exclusions
```

## Services

The application consists of three main services:

1. **MongoDB** (Port 27017) - Database
2. **Backend** (Port 8080) - Spring Boot API
3. **Frontend** (Port 3000) - React Application

## Quick Start

### 1. Build and Run All Services

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up --build -d
```

### 2. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Swagger Documentation**: http://localhost:8080/swagger-ui.html
- **MongoDB**: localhost:27017

### 3. Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This will delete all data)
docker-compose down -v
```

## Individual Service Management

### Build Individual Services

```bash
# Build backend only
docker-compose build backend

# Build frontend only
docker-compose build frontend
```

### Run Individual Services

```bash
# Run only MongoDB
docker-compose up mongo

# Run backend with MongoDB
docker-compose up mongo backend

# Run frontend with backend and MongoDB
docker-compose up mongo backend frontend
```

## Development Workflow

### 1. Development Mode

For development, you might want to run services individually:

```bash
# Start MongoDB
docker-compose up mongo -d

# Run backend locally (for hot reload)
./movie-booking-backend/mvnw spring-boot:run

# Run frontend locally (for hot reload)
cd movie-booking-frontend && npm start
```

### 2. Production Mode

For production deployment:

```bash
# Build and run in production mode
docker-compose -f docker-compose.yml up --build -d
```

## Environment Variables

### Backend Environment Variables

The backend service uses these environment variables:

#### MongoDB Configuration
- `SPRING_DATA_MONGODB_URI`: MongoDB connection string
- `SPRING_DATA_MONGODB_DATABASE`: Database name

#### JWT Configuration
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRATION`: Token expiration time in milliseconds

#### Server Configuration
- `SERVER_PORT`: Server port (default: 8080)
- `SPRING_PROFILES_ACTIVE`: Spring profile (docker/prod)

#### Logging Configuration
- `LOGGING_LEVEL_COM_MOVIEBOOKING`: Application logging level
- `LOGGING_LEVEL_ORG_SPRINGFRAMEWORK_DATA_MONGODB`: MongoDB logging level

#### Jackson Configuration
- `SPRING_JACKSON_DATE_FORMAT`: Date format for JSON serialization
- `SPRING_JACKSON_TIME_ZONE`: Timezone for date handling

### Frontend Environment Variables

The frontend service uses these environment variables:

#### API Configuration
- `REACT_APP_BACKEND_URL`: Backend API URL
- `REACT_APP_API_BASE`: API base path

#### Application Configuration
- `REACT_APP_APP_NAME`: Application name
- `REACT_APP_VERSION`: Application version

#### Feature Flags
- `REACT_APP_ENABLE_DEBUG`: Enable debug mode
- `REACT_APP_ENABLE_ANALYTICS`: Enable analytics

### Environment File Setup

Copy the `env.example` file to `.env` and customize the values:

```bash
cp env.example .env
```

Then modify the `.env` file with your specific configuration values.

## Database Initialization

The MongoDB container automatically initializes with sample data using the `init-mongo.js` script. This includes:

- Sample movies
- Sample theatres
- Sample showtimes
- Admin and user accounts

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check if ports are in use
   netstat -tulpn | grep :8080
   netstat -tulpn | grep :3000
   netstat -tulpn | grep :27017
   ```

2. **Container Build Failures**
   ```bash
   # Check build logs
   docker-compose logs backend
   docker-compose logs frontend
   ```

3. **Database Connection Issues**
   ```bash
   # Check MongoDB logs
   docker-compose logs mongo
   
   # Access MongoDB shell
   docker exec -it mongo mongosh
   ```

### Logs and Debugging

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongo

# Follow logs in real-time
docker-compose logs -f backend
```

### Container Management

```bash
# List running containers
docker ps

# Stop specific container
docker stop movie-booking-backend

# Remove containers
docker-compose rm

# Clean up images
docker system prune -a
```

## Production Deployment

### 1. Environment Configuration

Create a `.env` file for production:

```env
MONGODB_URI=mongodb://your-mongo-host:27017/moviebooking
SPRING_PROFILES_ACTIVE=prod
```

### 2. Build Production Images

```bash
# Build with production tags
docker-compose -f docker-compose.yml build

# Tag for registry
docker tag movie-booking-backend:latest your-registry/movie-booking-backend:latest
docker tag movie-booking-frontend:latest your-registry/movie-booking-frontend:latest
```

### 3. Deploy to Production

```bash
# Deploy with production configuration
docker-compose -f docker-compose.prod.yml up -d
```

## Security Considerations

1. **Database Security**: In production, use MongoDB authentication
2. **Network Security**: Use reverse proxy (Nginx/Traefik) for SSL termination
3. **Secrets Management**: Use Docker secrets or external secret management
4. **Container Security**: Regularly update base images and scan for vulnerabilities

## Performance Optimization

1. **Multi-stage Builds**: Already implemented for smaller images
2. **Layer Caching**: Optimized Dockerfiles for better build times
3. **Resource Limits**: Add memory and CPU limits in production
4. **Health Checks**: Implement health check endpoints

## Monitoring

### Health Check Endpoints

- Backend: `http://localhost:8080/api/health`
- Frontend: `http://localhost:3000`

### Metrics and Logging

Consider adding:
- Prometheus metrics
- ELK stack for logging
- Application performance monitoring (APM)

## Support

For issues related to Docker setup, check:
1. Docker and Docker Compose versions
2. Available system resources
3. Network connectivity
4. Port availability

---

**Note**: This Docker setup is optimized for development and testing. For production deployment, consider additional security, monitoring, and scaling configurations. 