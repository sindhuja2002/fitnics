# Fitnics

Fitnics is a modern fitness tracking and management application built with a microservices architecture. The application helps users track their fitness goals, workouts, and progress. The production application is available at [app.fitnics.space](https://app.fitnics.space).

## 🏗️ Architecture

The application is built using a microservices architecture with the following components:

- **Frontend**: React-based web application
  - Hosted on Netlify
  - Uses React Router for navigation
  - Implements responsive design for mobile and desktop
  - Uses React Toastify for notifications

- **Backend**: Node.js API server
  - RESTful API endpoints
  - JWT authentication
  - MongoDB integration
  - Error handling middleware
  - Rate limiting

- **Microservice**: Python-based service for specialized functionality
  - Handles complex calculations and analytics
  - Integrates with external fitness APIs
  - Processes workout data

- **Infrastructure**:
  - **Docker Swarm**: Container orchestration
  - **Traefik**: Reverse proxy and load balancer
    - Handles SSL termination
    - Provides load balancing
    - Manages service discovery
  - **Nginx**: Web server
    - Serves static assets
    - Handles caching
    - Provides security headers
  - **Portainer**: Container management UI
  - **Monitoring Stack**:
    - **Prometheus**: Metrics collection
    - **Loki**: Log aggregation
    - **Grafana**: Visualization and dashboards

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- Python 3.8 or higher
- MongoDB Atlas account (or local MongoDB instance)
- Git
- Digital Ocean account (for production deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sindhuja2002/fitnics.git
cd fitnics
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install

# Install microservice dependencies
cd ../microservice && pip install -r requirements.txt
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
# Backend Environment Variables
MONGO_URI=your_mongodb_connection_string
NODE_ENV=development
JWT_SECRET=your_jwt_secret
PORT=9000

# Frontend Environment Variables
REACT_APP_API_URL=http://localhost:9000
REACT_APP_MICROSERVICE_URL=http://localhost:8000

# Microservice Environment Variables
PYTHONUNBUFFERED=1
MONGO_URI=your_mongodb_connection_string
```

### Running the Application

#### Using Docker (Recommended)

```bash
# Build and start all services
docker-compose up --build

# To run in detached mode
docker-compose up -d
```

This will start all services:
- Frontend: http://localhost:3000
- Backend: http://localhost:9000
- Microservice: http://localhost:8000

#### Running Locally

1. Start the backend:
```bash
cd backend
npm run server
```

2. Start the frontend:
```bash
cd frontend
npm start
```

3. Start the microservice:
```bash
cd microservice
python app.py
```

## 🛠️ Development

### Available Scripts

- `npm start`: Start the backend server
- `npm run server`: Start the backend server with nodemon
- `npm run client`: Start the frontend development server
- `npm run dev`: Start both frontend and backend in development mode
- `npm run build`: Build the frontend application
- `npm run netlify-deploy`: Deploy to Netlify
- `npm test`: Run Jest tests

### CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment:

1. **CI Pipeline**:
   - Runs on every pull request
   - Lints code
   - Runs tests
   - Builds Docker images
   - Pushes to Docker Hub

2. **CD Pipeline**:
   - Runs on merge to main
   - Deploys to Docker Swarm
   - Updates services
   - Runs health checks

### Monitoring and Observability

The application is monitored using:

- **Prometheus**: Collects metrics from all services
- **Loki**: Aggregates logs from all containers
- **Grafana**: Provides dashboards for:
  - Application metrics
  - System performance
  - Error rates
  - User activity
  - API response times

Access monitoring dashboards at:
- Grafana: https://grafana.fitnics.space
- Portainer: https://portainer.fitnics.space

### API Documentation

The API documentation is available at:
- Development: http://localhost:9000/api-docs
- Production: https://backend.fitnics.space/api-docs

### Environment Variables

#### Backend (.env)
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/fitnics
NODE_ENV=development
JWT_SECRET=your_secret_key
PORT=9000
```

#### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:9000
REACT_APP_MICROSERVICE_URL=http://localhost:8000
```

#### Microservice (.env)
```
PYTHONUNBUFFERED=1
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/fitnics
```

## 📦 Project Structure

```
fitnics/
├── frontend/          # React frontend application
│   ├── public/        # Static files
│   ├── src/           # Source code
│   │   ├── components/# React components
│   │   ├── pages/     # Page components
│   │   ├── services/  # API services
│   │   └── utils/     # Utility functions
├── backend/           # Node.js backend API
│   ├── controllers/   # Route controllers
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   └── middleware/    # Custom middleware
├── microservice/      # Python microservice
│   ├── app.py         # Main application
│   ├── services/      # Business logic
│   └── utils/         # Utility functions
├── traefik/           # Traefik configuration
├── nginx/             # Nginx configuration
├── .github/           # GitHub Actions workflows
├── docker-compose.yml # Docker Compose configuration
└── package.json       # Project dependencies and scripts
```

## 🔧 Technologies Used

- **Frontend**: 
  - React
  - React Router
  - React Toastify
  - Axios
  - Material-UI

- **Backend**: 
  - Node.js
  - Express
  - MongoDB
  - JWT
  - Mongoose

- **Microservice**: 
  - Python
  - FastAPI
  - PyMongo
  - Pandas

- **Infrastructure**:
  - Docker Swarm
  - Traefik
  - Nginx
  - MongoDB Atlas
  - Digital Ocean
  - Portainer

- **Monitoring**:
  - Prometheus
  - Loki
  - Grafana

- **CI/CD**:
  - GitHub Actions
  - GitHub Container Registry
  - Docker Swarm


## 🌐 Production URLs

- Main Application: [app.fitnics.space](https://app.fitnics.space)
- API Documentation: [backend.fitnics.space/api-docs](https://backend.fitnics.space/api-docs)
- Monitoring Dashboard: [grafana.fitnics.space](https://grafana.fitnics.space)
- Portainer: [portainer.fitnics.space](https://portainer.fitnics.space)
- GitHub Repository: [github.com/sindhuja2002/fitnics](https://github.com/sindhuja2002/fitnics)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Workflow

1. Create a new branch from `main`
2. Make your changes
3. Write tests for new features
4. Update documentation if needed
5. Create a pull request
6. Wait for review and approval

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Digital Ocean for infrastructure
- Docker for containerization
- GitHub for CI/CD
- All contributors and maintainers
