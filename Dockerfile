# Use a Node.js 18 base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Expose the application port
EXPOSE 3001

# Command to start the application
CMD ["npm", "run", "start:dev"]