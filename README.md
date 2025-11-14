# 💪 Workout App

A full-stack fitness application built with modern web technologies. Track workouts, manage routines, and monitor progress with a clean, responsive interface.

## 🚀 Features

- **User Management**: Registration, authentication, and user profiles with avatars
- **Exercise Database**: Comprehensive exercise library with custom exercise support
- **Workout Routines**: Create, manage, and share workout routines
- **Workout Tracking**: Log workouts with sets, reps, and progress tracking
- **Progress Analytics**: Visualize fitness progress over time
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Live workout session tracking
- **API Documentation**: Interactive Swagger UI for developers

## 🛠 Tech Stack

### Backend

- **Node.js** with **TypeScript** - Server runtime and type safety
- **Express.js** - Web framework with comprehensive middleware
- **Prisma ORM** - Database toolkit with PostgreSQL
- **JWT Authentication** - Secure token-based authentication
- **Multer + Sharp** - File upload and image processing
- **Swagger/OpenAPI** - API documentation
- **Jest** - Testing framework
- **Winston** - Logging

### Frontend

- **React 19** with **TypeScript** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **Vitest** - Testing framework

### Development Tools

- **pnpm Workspaces** - Monorepo package management
- **ESLint + Prettier** - Code linting and formatting
- **Playwright** - E2E testing
- **Storybook** - Component development
- **PM2** - Process management for production

## 📁 Project Structure

```
workout-app/
├── server/          # Backend API server
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── types/          # TypeScript types
│   ├── prisma/             # Database schema & migrations
│   ├── tests/              # Backend tests
│   └── uploads/            # File uploads
├── web/             # Frontend React app
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Route pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── context/        # React context
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
├── docs/            # Documentation
└── README.md        # This file
```

## 🏃‍♂️ Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **PostgreSQL** database

### 1. Clone the Repository

```bash
git clone https://github.com/Haoweee/Workout.git
cd Workout
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

Create environment files in the server directory:

```bash
# Server environment (.env.local for development)
cd server
cp .env.example .env.local
```

Configure your environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/workout_db"

# JWT
JWT_SECRET="your-super-secure-jwt-secret"
JWT_REFRESH_SECRET="your-super-secure-refresh-secret"

# Server
PORT=3000
NODE_ENV=development

# File uploads
UPLOAD_DIR="uploads"
MAX_FILE_SIZE=5242880
```

### 4. Database Setup

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# (Optional) Seed with exercise data
pnpm import:exercises
```

### 5. Start Development

```bash
# Start both server and web app
pnpm dev

# Or start individually
pnpm dev:server  # Backend on http://localhost:3000
pnpm dev:web     # Frontend on http://localhost:5173
```

## 📖 Available Scripts

### Root Level Commands

```bash
# Development
pnpm dev              # Start both server and web
pnpm dev:server       # Start backend only
pnpm dev:web          # Start frontend only

# Building
pnpm build            # Build both applications
pnpm build:server     # Build backend only
pnpm build:web        # Build frontend only

# Testing
pnpm test             # Run all tests
pnpm test:server      # Run backend tests
pnpm test:web         # Run frontend tests

# Code Quality
pnpm lint             # Lint all code
pnpm lint:fix         # Fix linting issues
pnpm format           # Format code
pnpm format:check     # Check formatting
pnpm typecheck        # Type check all TypeScript

# Database
pnpm db:migrate       # Run database migrations
pnpm db:generate      # Generate Prisma client
pnpm db:studio        # Open Prisma Studio
pnpm db:reset         # Reset database

# Production
pnpm start            # Start production server
pnpm start:prod       # Start with NODE_ENV=production
```

## 🔧 API Documentation

Interactive API documentation is available via Swagger UI:

- **Development**: http://localhost:3000/docs
- **API Endpoints**: All routes prefixed with `/api`

### Key API Routes

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/exercises` - Get exercises
- `POST /api/routines` - Create workout routine
- `POST /api/workouts` - Log workout session
- `GET /api/users/me` - Get current user profile

## 🧪 Testing

```bash
# Backend tests
pnpm test:server          # Run all backend tests
pnpm test:server --watch  # Watch mode
pnpm test:server --coverage  # With coverage

# Frontend tests
pnpm test:web             # Run frontend tests
pnpm test:web --watch     # Watch mode
pnpm test:web --ui        # Test UI
pnpm test:web --coverage  # With coverage

# E2E tests
pnpm test:e2e             # Run Playwright tests
```

## 🚀 Deployment

### Using PM2 (Production)

```bash
# Build the application
pnpm build

# Start with PM2
pm2 start ecosystem.config.js

# Monitor
pm2 status
pm2 logs workout-api
```

### Environment Variables (Production)

Create `.env.prod` in the server directory:

```env
NODE_ENV=production
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-jwt-secret"
JWT_REFRESH_SECRET="your-production-refresh-secret"
PORT=3000
```

## 📊 Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **Users** - User accounts and profiles
- **Exercises** - Exercise database (muscle groups, instructions)
- **Routines** - Workout routines and templates
- **Workouts** - Logged workout sessions
- **Sets** - Individual exercise sets (reps, weight, duration)

Run `pnpm db:studio` to explore the database visually.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`pnpm validate`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Use conventional commit messages
- Ensure code passes all linting and formatting checks
- Update documentation as needed

## 📝 Documentation

Additional documentation available in the `/docs` directory:

- [API Reference](docs/API_REFERENCE.md) - Detailed API documentation
- [Database Schema](docs/DATABASE_SCHEMA.md) - Database design and relationships
- [Developer Commands](docs/DEVELOPER_COMMANDS.md) - Development workflow
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment
- [Testing Guide](docs/TESTING.md) - Testing strategies
- [Frontend Structure](docs/FRONTEND_STRUCTURE.md) - Frontend architecture

## 🐛 Troubleshooting

See [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) for common issues and solutions.

## 👨‍💻 Author

**Brian Woo** - [GitHub](https://github.com/Haoweee)

## 🙏 Acknowledgments

- Exercise data sourced from [yuhonas](https://github.com/yuhonas/free-exercise-db/tree/main)
- UI components built with Radix UI primitives and Shadcn
- Icons from Lucide React
- Styling with Tailwind CSS
