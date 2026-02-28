# Build stage
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Set build-time environment variables
ARG REACT_APP_BACKEND_URL
ARG REACT_APP_API_BASE
ARG REACT_APP_APP_NAME
ARG REACT_APP_VERSION
ARG REACT_APP_ENABLE_DEBUG
ARG REACT_APP_ENABLE_ANALYTICS

# Build the application
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
