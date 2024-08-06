# Fetching the minified node image on apline linux
FROM node:slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any needed packages
RUN yarn

# Bundle app source
COPY . .

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Define environment variable
ENV NODE_ENV=development

# Run the app when the container launches
CMD ["yarn", "start:dev"]