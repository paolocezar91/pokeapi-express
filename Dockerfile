# Use Node.js LTS image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the source code
COPY ./dist ./dist

# Expose the port your Express server uses (e.g., 3000)
EXPOSE 3030

# Start the server
CMD ["node", "dist/server"]