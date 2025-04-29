#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
check_port() {
    if lsof -i :$1 >/dev/null 2>&1; then
        echo -e "${RED}Port $1 is already in use. Please free up the port and try again.${NC}"
        exit 1
    fi
}

# Function to log messages
log() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

# Function to log errors
error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# Function to log success
success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

# Function to check service health
check_service_health() {
    local name=$1
    local port=$2
    local endpoint=$3
    local max_attempts=10
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        log "Checking $name health (attempt $attempt/$max_attempts)..."

        if curl -s "http://localhost:$port$endpoint" > /dev/null; then
            success "$name is healthy and responding"
            return 0
        fi

        if [ $attempt -lt $max_attempts ]; then
            log "Waiting for $name to become healthy..."
            sleep 5
        fi
        attempt=$((attempt + 1))
    done

    error "$name failed health check after $max_attempts attempts"
    docker logs $name
    return 1
}

# Check if Docker is installed
if ! command_exists docker; then
    error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if required ports are available
log "Checking ports..."
check_port 3000  # Frontend
check_port 9000  # Backend
check_port 8000  # Microservice

# Clean up existing containers and network
log "Cleaning up existing containers and network..."
docker stop fitnics-frontend fitnics-backend fitnics-microservice 2>/dev/null
docker rm fitnics-frontend fitnics-backend fitnics-microservice 2>/dev/null
docker network rm fitnics-network 2>/dev/null

# Build Docker images
log "Building Docker images..."

# Build microservice
log "Building microservice..."
docker build -t fitnics-microservice ./microservice || {
    error "Failed to build microservice image"
    exit 1
}

# Build backend
log "Building backend..."
docker build -t fitnics-backend ./backend || {
    error "Failed to build backend image"
    exit 1
}

# Build frontend
log "Building frontend..."
docker build -t fitnics-frontend ./frontend || {
    error "Failed to build frontend image"
    exit 1
}

# Create network
log "Creating Docker network..."
docker network create fitnics-network || {
    error "Failed to create Docker network"
    exit 1
}

# Run containers
log "Starting containers..."

# Start microservice
log "Starting microservice..."
docker run -d --name fitnics-microservice --network fitnics-network -p 8000:8000 \
    -e MONGO_URI=mongodb+srv://sindhufin0820:4toCXLcrxsICRU83@cluster0.macce.mongodb.net/fitnics \
    fitnics-microservice || {
    error "Failed to start microservice"
    docker logs fitnics-microservice
    exit 1
}

# Start backend
log "Starting backend..."
docker run -d --name fitnics-backend --network fitnics-network -p 9000:9000 \
    -e MONGO_URI=mongodb+srv://sindhufin0820:4toCXLcrxsICRU83@cluster0.macce.mongodb.net/fitnics \
    -e PORT=9000 \
    -e JWT_SECRET=fitnics123 \
    -e MICROSERVICE_URL=http://fitnics-microservice:8000 \
    fitnics-backend || {
    error "Failed to start backend"
    docker logs fitnics-backend
    exit 1
}

# Start frontend
log "Starting frontend..."
docker run -d --name fitnics-frontend --network fitnics-network -p 3000:3000 \
    -e REACT_APP_API_URL=http://localhost:9000 \
    -e REACT_APP_MICROSERVICE_URL=http://localhost:8000 \
    -e JWT_SECRET=fitnics123 \
    -e NODE_ENV=development \
    fitnics-frontend || {
    error "Failed to start frontend"
    docker logs fitnics-frontend
    exit 1
}

# Wait for services to start and check health
log "Waiting for services to start and checking health..."

# Check microservice health
check_service_health fitnics-microservice 8000 "/health" || exit 1

# Check backend health
check_service_health fitnics-backend 9000 "/api/health" || exit 1

# Check frontend health
check_service_health fitnics-frontend 3000 "" || exit 1

success "All services are running successfully!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:9000"
echo "Microservice: http://localhost:8000"

# Function to clean up on script exit
cleanup() {
    log "Cleaning up..."
    docker stop fitnics-frontend fitnics-backend fitnics-microservice
    docker rm fitnics-frontend fitnics-backend fitnics-microservice
    docker network rm fitnics-network
    success "Cleanup complete"
}

# Set up trap to clean up on script exit
trap cleanup EXIT

# Keep script running
log "Press Ctrl+C to stop the application"
while true; do
    sleep 1
done