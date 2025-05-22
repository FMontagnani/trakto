FROM node:20-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies - including dev dependencies for building
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code 
RUN npm run build

# Expose the application port
EXPOSE 3000

CMD ["node", "dist/adapters/api/app.js"]