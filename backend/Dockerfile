FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy source code
COPY . .

# Expose the port the app runs on
EXPOSE 9000

# Start the application
CMD ["npm", "start"] 