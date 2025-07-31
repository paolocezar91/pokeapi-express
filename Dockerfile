# Use Node.js LTS image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json tsconfig.json .env.sandbox ./
RUN mv .env.sandbox .env
RUN npm ci
# Copy the rest of the source code
COPY ./src ./src
RUN npm run build

# Expose the port your Express server uses (e.g., 3000)
EXPOSE 3000

# Start the server
CMD ["npm", "run", "start"]