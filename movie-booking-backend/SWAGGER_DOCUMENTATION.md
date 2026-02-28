# Swagger/OpenAPI Documentation Guide

## Overview

The Movie Booking System now includes comprehensive Swagger/OpenAPI documentation that follows the OpenAPI 3.0 standard. This documentation provides an interactive API reference that allows developers to explore, test, and understand the API endpoints.

## 🚀 Quick Start

### Accessing Swagger UI

Once the application is running, you can access the Swagger UI at:

- **Development**: `http://localhost:8080/api/swagger-ui.html`
- **Production**: `https://your-domain.com/api/swagger-ui.html`

### Accessing OpenAPI Specification

The OpenAPI specification is available at:

- **JSON Format**: `http://localhost:8080/api/api-docs`
- **YAML Format**: `http://localhost:8080/api/api-docs.yaml`

## 📋 Features

### 1. Interactive API Documentation
- **Try It Out**: Test API endpoints directly from the browser
- **Request/Response Examples**: Pre-filled examples for all endpoints
- **Authentication**: Built-in JWT token support
- **Schema Validation**: Real-time request validation

### 2. Comprehensive Coverage
- **All Endpoints**: Complete documentation for all API endpoints
- **Request/Response Models**: Detailed schema definitions
- **Error Responses**: Documented error scenarios and codes
- **Authentication**: JWT Bearer token documentation

### 3. Developer-Friendly Features
- **Search**: Find endpoints quickly
- **Filtering**: Filter by tags and HTTP methods
- **Export**: Download OpenAPI specification
- **Responsive Design**: Works on desktop and mobile

## 🔧 Configuration

### Dependencies

The following dependency was added to `pom.xml`:

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.2.0</version>
</dependency>
```

### Application Configuration

The following configuration was added to `application.yml`:

```yaml
springdoc:
  api-docs:
    path: /api-docs
  swagger-ui:
    path: /swagger-ui.html
    operations-sorter: method
    tags-sorter: alpha
    doc-expansion: none
    disable-swagger-default-url: true
    display-request-duration: true
  packages-to-scan: com.moviebooking.controller
  paths-to-match: /api/**
```

### Security Configuration

Swagger UI endpoints are configured to be publicly accessible:

```java
.requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**", "/api-docs/**").permitAll()
```

## 📚 API Documentation Structure

### 1. Authentication Endpoints
- **Tag**: Authentication
- **Endpoints**:
  - `POST /auth/register` - Register a new user
  - `POST /auth/login` - Authenticate user

### 2. Movie Management
- **Tag**: Movies
- **Endpoints**:
  - `GET /movies` - Get all movies
  - `GET /movies/{id}` - Get movie by ID
  - `POST /movies` - Create new movie (Admin only)

### 3. Booking Management
- **Tag**: Bookings
- **Endpoints**:
  - `POST /bookings` - Create a new booking
  - `GET /bookings` - Get user's booking history
  - `GET /bookings/{id}` - Get specific booking
  - `DELETE /bookings/{id}` - Cancel booking

### 4. Health Check
- **Tag**: Health
- **Endpoints**:
  - `GET /health` - Application health status

## 🔐 Authentication

### JWT Bearer Token

Most endpoints require authentication using JWT tokens. The Swagger UI includes:

1. **Authorize Button**: Click to enter your JWT token
2. **Token Format**: `Bearer <your-jwt-token>`
3. **Automatic Inclusion**: Token is automatically included in requests

### Getting a JWT Token

1. Use the `/auth/register` or `/auth/login` endpoint
2. Copy the `accessToken` from the response
3. Click "Authorize" in Swagger UI
4. Enter: `Bearer <your-token>`

## 📖 Using Swagger UI

### 1. Exploring Endpoints

1. **Browse by Tag**: Click on tag names to filter endpoints
2. **Expand Endpoints**: Click on endpoint names to see details
3. **View Schemas**: Click on model names to see data structures

### 2. Testing Endpoints

1. **Click "Try it out"**: Makes the endpoint interactive
2. **Fill Parameters**: Enter required parameters
3. **Execute**: Click "Execute" to make the request
4. **View Response**: See the actual response from the server

### 3. Authentication

1. **Click "Authorize"**: Opens authentication dialog
2. **Enter Token**: Use format `Bearer <your-jwt-token>`
3. **Apply**: Token is now included in all requests

## 🏷️ OpenAPI Annotations

### Controller Annotations

```java
@Tag(name = "Bookings", description = "Booking management endpoints")
@SecurityRequirement(name = "Bearer Authentication")
```

### Operation Annotations

```java
@Operation(
    summary = "Create a new booking",
    description = "Creates a new booking for the authenticated user"
)
@ApiResponses(value = {
    @ApiResponse(
        responseCode = "201",
        description = "Booking created successfully",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = Booking.class)
        )
    )
})
```

### Parameter Annotations

```java
@Parameter(description = "Booking ID", example = "550e8400-e29b-41d4-a716-446655440000")
@PathVariable String bookingId
```

### Schema Annotations

```java
@Schema(description = "User registration request")
public class UserCreateRequest {
    @Schema(description = "User's email address", example = "john.doe@example.com", required = true)
    private String email;
}
```

## 🔍 Response Examples

### Success Response

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
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

### Error Response

```json
{
  "message": "Seat A1 is already booked",
  "data": null,
  "success": false
}
```

## 🚨 Error Codes

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

## 🛠️ Customization

### 1. API Information

Modify `OpenApiConfig.java` to customize:

- API title and description
- Contact information
- License details
- Server configurations

### 2. Security Schemes

Add additional security schemes:

```java
.addSecuritySchemes("API Key", new SecurityScheme()
    .type(SecurityScheme.Type.APIKEY)
    .in(SecurityScheme.In.HEADER)
    .name("X-API-Key"))
```

### 3. Response Examples

Add custom response examples:

```java
@ApiResponse(
    responseCode = "200",
    content = @Content(
        examples = @ExampleObject(
            name = "Success Example",
            value = "{\"status\": \"success\"}"
        )
    )
)
```

## 📱 Mobile Support

Swagger UI is responsive and works on mobile devices:

- **Touch-friendly**: Large buttons and inputs
- **Responsive layout**: Adapts to screen size
- **Mobile navigation**: Easy to use on small screens

## 🔒 Security Considerations

### Production Deployment

1. **Disable in Production**: Consider disabling Swagger UI in production
2. **Access Control**: Restrict access to documentation endpoints
3. **Sensitive Data**: Ensure no sensitive information is exposed

### Configuration Options

```yaml
springdoc:
  swagger-ui:
    enabled: true  # Set to false in production
    path: /swagger-ui.html
  api-docs:
    enabled: true  # Set to false in production
```

## 📈 Monitoring and Analytics

### Usage Tracking

Swagger UI provides:

- **Request/Response Logging**: Track API usage
- **Performance Metrics**: Response times
- **Error Tracking**: Failed requests

### Integration

- **APM Tools**: Integrate with Application Performance Monitoring
- **Logging**: Centralized logging for API requests
- **Analytics**: Track API usage patterns

## 🤝 Contributing

### Adding New Endpoints

1. **Add Annotations**: Include OpenAPI annotations
2. **Document Parameters**: Use `@Parameter` annotations
3. **Define Responses**: Use `@ApiResponse` annotations
4. **Add Examples**: Provide request/response examples

### Best Practices

1. **Consistent Naming**: Use consistent tag names
2. **Clear Descriptions**: Provide clear endpoint descriptions
3. **Complete Examples**: Include realistic examples
4. **Error Documentation**: Document all possible errors

## 📞 Support

For issues with Swagger documentation:

1. **Check Configuration**: Verify application.yml settings
2. **Review Annotations**: Ensure proper OpenAPI annotations
3. **Test Endpoints**: Verify endpoints are working
4. **Check Logs**: Review application logs for errors

## 🔗 Useful Links

- [OpenAPI Specification](https://swagger.io/specification/)
- [SpringDoc Documentation](https://springdoc.org/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [OpenAPI Annotations](https://github.com/swagger-api/swagger-core/wiki/Annotations) 