# Movie Booking System API Documentation

## Overview

The Movie Booking System API provides RESTful endpoints for managing movie bookings, user authentication, and system administration. All endpoints return JSON responses and use standard HTTP status codes.

**Base URL**: `http://localhost:8080/api`

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Common Response Format

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

## Endpoints

### Authentication

#### 1. Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123",
  "role": "USER"
}
```

**Response (201 Created):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "bearer",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  }
}
```

#### 2. Login User
**POST** `/auth/login`

Authenticate an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "bearer",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  }
}
```

### Movies

#### 3. Get All Movies
**GET** `/movies`

Retrieve all movies in the system.

**Response (200 OK):**
```json
[
  {
    "id": "movie-uuid",
    "title": "The Matrix",
    "description": "A computer hacker learns from mysterious rebels...",
    "genre": "Sci-Fi",
    "rating": 8.7,
    "duration": 136,
    "language": "English",
    "posterUrl": "https://example.com/matrix.jpg",
    "releaseDate": "1999-03-31T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### 4. Get Movie by ID
**GET** `/movies/{id}`

Retrieve a specific movie by its ID.

**Response (200 OK):**
```json
{
  "id": "movie-uuid",
  "title": "The Matrix",
  "description": "A computer hacker learns from mysterious rebels...",
  "genre": "Sci-Fi",
  "rating": 8.7,
  "duration": 136,
  "language": "English",
  "posterUrl": "https://example.com/matrix.jpg",
  "releaseDate": "1999-03-31T00:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### 5. Create Movie
**POST** `/movies`

Create a new movie (Admin only).

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
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

### Bookings

#### 6. Create Booking
**POST** `/bookings`

Create a new booking for the authenticated user.

**Headers:**
```
Authorization: Bearer <user-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "showtimeId": "showtime-uuid",
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

**Response (201 Created):**
```json
{
  "id": "booking-uuid",
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

#### 7. Get User Bookings
**GET** `/bookings`

Retrieve all bookings for the authenticated user.

**Headers:**
```
Authorization: Bearer <user-jwt-token>
```

**Response (200 OK):**
```json
[
  {
    "id": "booking-uuid",
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
]
```

#### 8. Cancel Booking
**DELETE** `/bookings/{id}`

Cancel a booking and release the seats.

**Headers:**
```
Authorization: Bearer <user-jwt-token>
```

**Response (200 OK):**
```json
{
  "id": "booking-uuid",
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
  "status": "cancelled"
}
```

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Missing or invalid authentication |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 422 | Unprocessable Entity - Validation errors |
| 500 | Internal Server Error - Server error | 