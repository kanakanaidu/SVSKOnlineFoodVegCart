# Step 1: Build Stage
FROM node:20.14.0 AS build

WORKDIR /usr/src/app

# Define build-time arguments
ARG NODE_OPTIONS="--max-old-space-size=4096"

# Use the build argument as an environment variable
ENV NODE_OPTIONS $NODE_OPTIONS

COPY package*.json ./
RUN npm install

COPY . .

# Build the application using TypeScript and Vite
RUN npm run build

# Debug: Show files after build
RUN ls -al /usr/src/app/dist

# Step 2: Serve Stage
FROM nginx:alpine

# Copy the build output from the dist directory
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]