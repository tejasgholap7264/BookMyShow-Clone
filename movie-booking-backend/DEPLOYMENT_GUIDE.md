# Movie Booking System - Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Movie Booking System to production environments.

## Prerequisites

- Java 17+
- MongoDB 4.4+
- Docker (optional)
- Kubernetes (optional)

## Quick Deployment

### 1. Build Application
```bash
mvn clean package -DskipTests
```

### 2. Configure Environment
```bash
export JWT_SECRET=$(openssl rand -base64 32)
export MONGO_URL=mongodb://localhost:27017
export DB_NAME=moviebooking
```

### 3. Run Application
```bash
java -jar target/movie-booking-system-1.0.0.jar
```

## Docker Deployment

### Dockerfile
```dockerfile
FROM openjdk:17-jre-slim
WORKDIR /app
COPY target/movie-booking-system-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Build and Run
```bash
docker build -t movie-booking:1.0.0 .
docker run -p 8080:8080 movie-booking:1.0.0
```

## Production Checklist

- [ ] JWT secret configured
- [ ] MongoDB secured
- [ ] HTTPS enabled
- [ ] Monitoring configured
- [ ] Backups automated
- [ ] Logging configured

## Docker Compose Deployment

#### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - MONGO_URL=mongodb://mongo:27017
      - DB_NAME=moviebooking
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongo
    networks:
      - movie-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  mongo:
    image: mongo:5.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_DATABASE=moviebooking
    volumes:
      - mongo_data:/data/db
      - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
    networks:
      - movie-network
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    networks:
      - movie-network
    restart: unless-stopped

volumes:
  mongo_data:

networks:
  movie-network:
    driver: bridge
```

#### Nginx Configuration

```nginx
events {
    worker_connections 1024;
}

http {
    upstream movie_app {
        server app:8080;
    }

    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;

        location / {
            proxy_pass http://movie_app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

## Kubernetes Deployment

#### Namespace

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: movie-booking
```

#### ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: movie-booking-config
  namespace: movie-booking
data:
  application.yml: |
    server:
      port: 8080
      servlet:
        context-path: /api
    
    spring:
      data:
        mongodb:
          uri: mongodb://mongo-service:27017
          database: moviebooking
      
      jackson:
        default-property-inclusion: NON_NULL
        date-format: yyyy-MM-dd'T'HH:mm:ss.SSS'Z'
        time-zone: UTC
    
    jwt:
      expiration: 86400000
    
    logging:
      level:
        com.moviebooking: INFO
```

#### Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: movie-booking-secret
  namespace: movie-booking
type: Opaque
data:
  jwt-secret: <base64-encoded-jwt-secret>
```

#### Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: movie-booking-app
  namespace: movie-booking
spec:
  replicas: 3
  selector:
    matchLabels:
      app: movie-booking
  template:
    metadata:
      labels:
        app: movie-booking
    spec:
      containers:
      - name: movie-booking
        image: movie-booking-system:1.0.0
        ports:
        - containerPort: 8080
        env:
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: movie-booking-secret
              key: jwt-secret
        - name: MONGO_URL
          value: "mongodb://mongo-service:27017"
        - name: DB_NAME
          value: "moviebooking"
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 8080
          initialDelaySeconds: 60
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /api/health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
```

#### Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: movie-booking-service
  namespace: movie-booking
spec:
  selector:
    app: movie-booking
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP
```

#### Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: movie-booking-ingress
  namespace: movie-booking
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - your-domain.com
    secretName: movie-booking-tls
  rules:
  - host: your-domain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: movie-booking-service
            port:
              number: 80
```

## Environment Configuration

### Production Environment Variables

```bash
# Database Configuration
MONGO_URL=mongodb://mongo-cluster:27017
DB_NAME=moviebooking_prod

# JWT Configuration
JWT_SECRET=your-super-secure-base64-encoded-secret-key

# Application Configuration
SERVER_PORT=8080
SERVER_SERVLET_CONTEXT_PATH=/api

# Logging Configuration
LOGGING_LEVEL_COM_MOVIEBOOKING=INFO
LOGGING_LEVEL_ORG_SPRINGFRAMEWORK_SECURITY=WARN

# Performance Configuration
SPRING_DATA_MONGODB_CONNECT_TIMEOUT=5000
SPRING_DATA_MONGODB_SOCKET_TIMEOUT=5000
```

### Security Configuration

#### JWT Secret Generation

```bash
# Generate a secure random secret
openssl rand -base64 32

# Store in environment variable
export JWT_SECRET=$(openssl rand -base64 32)
```

#### MongoDB Security

```javascript
// Create admin user
use admin
db.createUser({
  user: "admin",
  pwd: "secure-password",
  roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]
})

// Create application user
use moviebooking
db.createUser({
  user: "movieapp",
  pwd: "app-password",
  roles: ["readWrite"]
})
```

## Monitoring and Logging

### Application Monitoring

#### Health Check Endpoint

Add to your application:

```java
@RestController
public class HealthController {
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(status);
    }
}
```

#### Prometheus Metrics

Add dependency to `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

### Logging Configuration

#### logback-spring.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>
    
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/movie-booking.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>logs/movie-booking.%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>
    
    <root level="INFO">
        <appender-ref ref="STDOUT" />
        <appender-ref ref="FILE" />
    </root>
</configuration>
```

## Backup and Recovery

### MongoDB Backup

```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/mongodb"
mkdir -p $BACKUP_DIR

# Backup database
mongodump --uri="mongodb://localhost:27017/moviebooking" \
  --out="$BACKUP_DIR/backup_$DATE"

# Compress backup
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" -C "$BACKUP_DIR" "backup_$DATE"

# Clean old backups (keep last 7 days)
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete
```

### Application Backup

```bash
# Backup application data
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/app"

# Stop application
docker stop movie-booking

# Backup application files
tar -czf "$BACKUP_DIR/app_backup_$DATE.tar.gz" /app/data

# Start application
docker start movie-booking
```

## Performance Optimization

### JVM Tuning

```bash
# Production JVM options
java -Xms1g -Xmx2g \
  -XX:+UseG1GC \
  -XX:MaxGCPauseMillis=200 \
  -XX:+UseStringDeduplication \
  -jar app.jar
```

### MongoDB Optimization

```javascript
// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true })
db.movies.createIndex({ "title": 1 })
db.showtimes.createIndex({ "movieId": 1, "showDate": 1 })
db.bookings.createIndex({ "userId": 1 })
db.bookings.createIndex({ "showtimeId": 1 })
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if MongoDB is running
   - Verify connection string
   - Check firewall settings

2. **JWT Token Issues**
   - Verify JWT secret is properly set
   - Check token expiration
   - Validate token format

3. **Memory Issues**
   - Monitor heap usage
   - Adjust JVM memory settings
   - Check for memory leaks

### Log Analysis

```bash
# View application logs
docker logs movie-booking

# Monitor real-time logs
docker logs -f movie-booking

# Search for errors
grep "ERROR" logs/movie-booking.log
```

## Security Checklist

- [ ] JWT secret is properly configured and secure
- [ ] MongoDB authentication is enabled
- [ ] HTTPS is configured with valid certificates
- [ ] CORS is properly configured for production
- [ ] Input validation is enabled
- [ ] Rate limiting is implemented
- [ ] Logging is configured for security events
- [ ] Regular security updates are applied
- [ ] Database backups are automated
- [ ] Monitoring and alerting are configured

## Support

For deployment issues:
1. Check application logs
2. Verify configuration
3. Test connectivity
4. Review security settings
5. Contact support team 