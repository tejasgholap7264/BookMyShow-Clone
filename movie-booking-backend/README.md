# Movie Booking System

A comprehensive Spring Boot application for managing movie bookings with JWT authentication, MongoDB database, and RESTful API endpoints.

## 🎬 Features

- **User Authentication & Authorization**: JWT-based authentication with role-based access control
- **Movie Management**: CRUD operations for movies with metadata
- **Theatre Management**: Theatre configuration with seating layouts
- **Showtime Management**: Movie screenings with pricing and availability
- **Seat Booking**: Real-time seat reservation with conflict prevention
- **Booking Management**: Complete booking lifecycle with cancellation support
- **RESTful API**: Well-documented REST endpoints with proper HTTP status codes
- **Data Validation**: Comprehensive input validation using Bean Validation
- **Exception Handling**: Global exception handling with meaningful error messages
- **Security**: Spring Security with CORS configuration
- **API Documentation**: Interactive Swagger/OpenAPI documentation

## 🏗️ Architecture

The application follows a layered architecture pattern:

```
┌─────────────────┐
│   Controllers   │  ← REST API endpoints
├─────────────────┤
│    Services     │  ← Business logic
├─────────────────┤
│  Repositories   │  ← Data access layer
├─────────────────┤
│     Models      │  ← Data entities
├─────────────────┤
│   MongoDB       │  ← Database
└─────────────────┘
```

### Technology Stack

- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Spring Security
- **Validation**: Bean Validation (Jakarta)
- **Build Tool**: Maven
- **Documentation**: JavaDoc + Swagger/OpenAPI
- **API Documentation**: SpringDoc OpenAPI 3.0

## 🚀 Quick Start

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- MongoDB 4.4+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd moviebooking
   ```

2. **Configure MongoDB**
   - Start MongoDB service
   - Create database: `moviebooking`
   - Update connection settings in `application.yml` if needed

3. **Configure JWT Secret**
   - Generate a Base64 encoded secret key (minimum 32 bytes)
   - Update `jwt.secret` in `application.yml` or set `JWT_SECRET` environment variable

4. **Build and Run**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

The application will start on `http://localhost:8080/api`

## 📚 API Documentation

### Swagger UI

Access the interactive API documentation at:
- **Swagger UI**: `http://localhost:8080/api/swagger-ui.html`
- **OpenAPI Spec**: `http://localhost:8080/api/api-docs`

### Features of Swagger Documentation

- **Interactive Testing**: Test API endpoints directly from the browser
- **Request/Response Examples**: Pre-filled examples for all endpoints
- **Authentication**: Built-in JWT token support
- **Schema Validation**: Real-time request validation
- **Complete Coverage**: All endpoints, models, and error scenarios documented

### Using Swagger UI

1. **Browse Endpoints**: Click on tags to filter endpoints
2. **Try It Out**: Click "Try it out" to test endpoints
3. **Authentication**: Click "Authorize" and enter your JWT token
4. **Execute**: Make requests and see real responses

For detailed Swagger documentation, see [SWAGGER_GUIDE.md](SWAGGER_GUIDE.md)

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123",
  "role": "USER"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Movie Endpoints

#### Get All Movies
```http
GET /api/movies
```

#### Get Movie by ID
```http
GET /api/movies/{id}
```

#### Create Movie (Admin Only)
```http
POST /api/movies
Authorization: Bearer {jwt-token}
Content-Type: application/json

{
  "title": "The Matrix",
  "description": "A computer hacker learns from mysterious rebels about the true nature of his reality.",
  "genre": "Sci-Fi",
  "rating": 8.7,
  "duration": 136,
  "language": "English",
  "posterUrl": "https://example.com/matrix.jpg",
  "releaseDate": "1999-03-31T00:00:00.000Z"
}
```

### Theatre Endpoints

#### Get All Theatres
```http
GET /api/theatres
```

#### Create Theatre (Manager/Admin Only)
```http
POST /api/theatres
Authorization: Bearer {jwt-token}
Content-Type: application/json

{
  "name": "Cineplex Downtown",
  "location": "123 Main St, Downtown",
  "totalSeats": 100,
  "rows": 10,
  "seatsPerRow": 10
}
```

### Showtime Endpoints

#### Get All Showtimes
```http
GET /api/showtimes
```

#### Get Showtime Seats
```http
GET /api/showtimes/{id}/seats
```

#### Create Showtime (Manager/Admin Only)
```http
POST /api/showtimes
Authorization: Bearer {jwt-token}
Content-Type: application/json

{
  "movieId": "movie-id",
  "theatreId": "theatre-id",
  "showDate": "2024-01-15T19:00:00.000Z",
  "price": 12.50,
  "availableSeats": 100
}
```

### Booking Endpoints

#### Create Booking
```http
POST /api/bookings
Authorization: Bearer {jwt-token}
Content-Type: application/json

{
  "showtimeId": "showtime-id",
  "seats": [
    {
      "row": "A",
      "number": 1,
      "status": "BOOKED"
    }
  ],
  "totalAmount": 12.50
}
```

#### Get User Bookings
```http
GET /api/bookings
Authorization: Bearer {jwt-token}
```

#### Get Specific Booking
```http
GET /api/bookings/{id}
Authorization: Bearer {jwt-token}
```

#### Cancel Booking
```http
DELETE /api/bookings/{id}
Authorization: Bearer {jwt-token}
```

## 🔐 Security

### JWT Token Format
JWT tokens contain:
- **Subject**: User ID
- **Claims**: User role
- **Issued At**: Token creation timestamp
- **Expiration**: Token expiration timestamp

### Role-Based Access Control

| Role | Permissions |
|------|-------------|
| **USER** | Browse movies, book seats, view own bookings |
| **MANAGER** | Manage theatres, showtimes, view reports |
| **ADMIN** | Full system access, user management |

### CORS Configuration
The application is configured to allow cross-origin requests from any origin for development. In production, configure specific origins.

## 🗄️ Database Schema

### Collections

#### Users
```json
{
  "_id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "USER",
  "hashedPassword": "bcrypt-hash",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Movies
```json
{
  "_id": "uuid",
  "title": "Movie Title",
  "description": "Movie description",
  "genre": "Action",
  "rating": 8.5,
  "duration": 120,
  "language": "English",
  "posterUrl": "https://example.com/poster.jpg",
  "releaseDate": "2024-01-01T00:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Theatres
```json
{
  "_id": "uuid",
  "name": "Theatre Name",
  "location": "Theatre Location",
  "totalSeats": 100,
  "rows": 10,
  "seatsPerRow": 10,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Showtimes
```json
{
  "_id": "uuid",
  "movieId": "movie-uuid",
  "theatreId": "theatre-uuid",
  "showDate": "2024-01-15T19:00:00.000Z",
  "price": 12.50,
  "availableSeats": 100,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Bookings
```json
{
  "_id": "uuid",
  "userId": "user-uuid",
  "showtimeId": "showtime-uuid",
  "seats": [
    {
      "row": "A",
      "number": 1,
      "status": "BOOKED"
    }
  ],
  "totalAmount": 12.50,
  "bookingDate": "2024-01-01T00:00:00.000Z",
  "status": "confirmed"
}
```

## 🔧 Configuration

### Application Properties

```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017
      database: moviebooking
  
  jackson:
    default-property-inclusion: NON_NULL
    date-format: yyyy-MM-dd'T'HH:mm:ss.SSS'Z'
    time-zone: UTC

jwt:
  secret: your-secret-key-change-in-production
  expiration: 86400000 # 24 hours

logging:
  level:
    com.moviebooking: INFO
    org.springframework.data.mongodb: DEBUG

# Swagger/OpenAPI Configuration
springdoc:
  api-docs:
    path: /api-docs
  swagger-ui:
    path: /swagger-ui.html
    operations-sorter: method
    tags-sorter: alpha
  packages-to-scan: com.moviebooking.controller
  paths-to-match: /api/**
```

### Environment Variables

- `MONGO_URL`: MongoDB connection string
- `DB_NAME`: Database name
- `JWT_SECRET`: JWT signing secret (Base64 encoded)

## 🧪 Testing

### Unit Tests
```bash
mvn test
```

### Integration Tests
```bash
mvn verify
```

### API Testing with Swagger
1. Start the application
2. Open `http://localhost:8080/api/swagger-ui.html`
3. Use the interactive interface to test endpoints

## 📝 API Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... },
  "success": true
}
```

### Error Response
```json
{
  "message": "Error description",
  "data": null,
  "success": false
}
```

## 🚨 Error Handling

The application includes comprehensive error handling:

- **400 Bad Request**: Validation errors, invalid input
- **401 Unauthorized**: Missing or invalid JWT token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Unexpected server errors

## 🔄 Data Initialization

Use the `/api/init-data` endpoint to populate the database with sample data for testing.

## 📈 Monitoring

The application includes:
- Structured logging with SLF4J
- Request/response logging
- Error tracking
- Performance monitoring
- Health check endpoint: `/api/health`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation
- Use Swagger UI for API exploration

---

**Note**: This is a development version. For production deployment, ensure proper security configurations, environment variables, and database optimizations. 