# Swagger/OpenAPI Documentation Guide

## Overview

The Movie Booking System now includes comprehensive Swagger/OpenAPI documentation following the OpenAPI 3.0 standard.

## Accessing Swagger UI

- **URL**: `http://localhost:8080/api/swagger-ui.html`
- **OpenAPI Spec**: `http://localhost:8080/api/api-docs`

## Features

### 1. Interactive Documentation
- Test API endpoints directly from browser
- Pre-filled request examples
- Real-time validation
- JWT authentication support

### 2. Complete Coverage
- All API endpoints documented
- Request/response schemas
- Error scenarios
- Authentication requirements

### 3. Developer-Friendly
- Search functionality
- Tag-based filtering
- Export capabilities
- Responsive design

## Configuration

### Dependencies Added
```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.2.0</version>
</dependency>
```

### Application Configuration
```yaml
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

## API Tags

- **Authentication**: User registration and login
- **Movies**: Movie management endpoints
- **Bookings**: Booking operations
- **Health**: Application health checks

## Authentication

1. Use `/auth/register` or `/auth/login` to get JWT token
2. Click "Authorize" in Swagger UI
3. Enter: `Bearer <your-jwt-token>`
4. Token is automatically included in requests

## Using Swagger UI

1. **Browse Endpoints**: Click on tags to filter
2. **Try It Out**: Click "Try it out" to test endpoints
3. **Fill Parameters**: Enter required data
4. **Execute**: Click "Execute" to make request
5. **View Response**: See actual server response

## Annotations Used

### Controllers
```java
@Tag(name = "Bookings", description = "Booking management endpoints")
@SecurityRequirement(name = "Bearer Authentication")
```

### Operations
```java
@Operation(summary = "Create booking", description = "Creates a new booking")
@ApiResponses(value = {
    @ApiResponse(responseCode = "201", description = "Created successfully")
})
```

### Parameters
```java
@Parameter(description = "Booking ID", example = "uuid")
@PathVariable String bookingId
```

### Schemas
```java
@Schema(description = "User request", example = "john@example.com")
private String email;
```

## Security

- Swagger UI endpoints are publicly accessible
- JWT authentication for protected endpoints
- CORS configured for cross-origin requests

## Production Considerations

- Consider disabling Swagger UI in production
- Restrict access to documentation endpoints
- Ensure no sensitive data is exposed 