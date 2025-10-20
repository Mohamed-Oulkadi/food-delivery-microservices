# --- Build Stage ---
# Use a Node.js image to build the static files
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Final Stage ---
# Use an Nginx image to serve the static files
FROM nginx:1.25-alpine
# Copy the built files from the builder stage's 'dist' folder
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]