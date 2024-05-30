# Use the Node.js 16 Alpine image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Install GCC and other necessary build tools
RUN apk update && apk add --no-cache g++ openjdk11-jdk python3
#RUN apk update && apk add --no-cache g++

# Copy only the package.json and package-lock.json files and install dependencies.
# This allows Docker to cache this layer when package files don't change.
COPY package*.json ./
RUN npm install

# Copy the rest of the application code.
# This layer will only be rebuilt if application code changes.
COPY . .

EXPOSE 8000

# Specify the command to run when the container starts
CMD [ "node", "index.js" ]