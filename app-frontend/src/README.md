# ExpressFood - Food Delivery Application

A modern, multi-role food delivery platform built with React, TypeScript, and Tailwind CSS.

## Features

- **Customer Portal**: Browse restaurants, order food, track deliveries
- **Admin Panel**: Manage restaurants, menus, and users
- **Driver Dashboard**: Accept and manage delivery requests
- **Shopping Cart**: Real-time cart management with order placement
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui Components
- Vite

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn
- Docker and Docker Compose (for containerized deployment)

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Docker Deployment

#### Build and run with Docker Compose:

```bash
docker-compose up -d
```

The application will be available at `http://localhost:3000`

#### Build Docker image manually:

```bash
docker build -t expressfood-app .
```

#### Run the Docker container:

```bash
docker run -d -p 3000:80 --name expressfood expressfood-app
```

#### Stop the container:

```bash
docker-compose down
```

or

```bash
docker stop expressfood
docker rm expressfood
```

### Docker Commands

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Rebuild and restart
docker-compose up -d --build

# Check container health
docker ps
```

## Demo Credentials

### Customer Account
- Username: `customer`
- Password: `password`

### Admin Account
- Username: `admin`
- Password: `password`

### Driver Account
- Username: `driver`
- Password: `password`

## Project Structure

```
├── components/          # Reusable React components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # Navigation header
│   └── CartSheet.tsx   # Shopping cart
├── pages/              # Page components
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── CustomerHome.tsx
│   ├── RestaurantMenu.tsx
│   ├── MyOrders.tsx
│   ├── AdminPage.tsx
│   └── DriverDashboard.tsx
├── contexts/           # React context providers
│   └── AppContext.tsx  # Global app state
├── lib/               # Utilities and mock data
│   └── mockData.ts
└── styles/            # Global styles
    └── globals.css
```

## Features by Role

### Customer
- Browse restaurants by cuisine type
- Search restaurants
- View restaurant menus
- Add items to cart
- Place orders
- Track order history and status

### Admin
- Manage restaurants (CRUD operations)
- Manage menu items for each restaurant
- View user list
- Monitor system activity

### Driver
- View available delivery requests
- Accept delivery assignments
- Update delivery status (Accepted → Picked Up → In Transit → Delivered)
- Manage active deliveries

## Environment Variables

Create a `.env` file for custom configuration:

```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=ExpressFood
```

## Health Check

The Docker container includes a health check endpoint:

```bash
curl http://localhost:3000/health
```

## Production Deployment

The application is optimized for production with:
- Multi-stage Docker builds
- Nginx web server
- Gzip compression
- Asset caching
- Security headers
- Health monitoring

## License

MIT

## Support

For issues and feature requests, please create an issue in the repository.
