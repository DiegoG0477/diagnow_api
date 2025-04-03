FROM node:lts-bullseye-slim

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 3315

# Start the app
CMD [ "npm", "run", "dev" ]