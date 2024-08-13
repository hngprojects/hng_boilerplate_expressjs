# Use a lightweight Node.js base image
FROM node:18-alpine AS production

# Set the working directory in the container
WORKDIR /app

# Copy only the necessary files for production
COPY package.json yarn.lock ./

# Install production dependencies only
RUN yarn install --production=true --frozen-lockfile --no-optional && \
    yarn cache clean && \
    rm -rf /usr/share/man /usr/share/doc /var/cache/apk/* /tmp/*

# Copy the remaining application files
COPY . .

# Make port 8000 available outside this container
EXPOSE 8000

# Set the environment to production
ENV NODE_ENV=production

# Run the app when the container launches
CMD ["yarn", "start"]
