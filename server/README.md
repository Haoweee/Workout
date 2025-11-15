# workout Server

A professional-grade Node.js TypeScript server with Express.js framework.

## 🚀 Features

- **TypeScript**: Full TypeScript support with strict type checking
- **Express.js**: Fast, unopinionated web framework
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Logging**: Winston logger with file rotation
- **Database**: Prisma ORM ready (PostgreSQL, MySQL, SQLite)
- **Authentication**: JWT-based authentication system
- **Testing**: Jest testing framework with coverage
- **Linting**: ESLint with TypeScript and Prettier integration
- **Docker**: Multi-stage Docker build with health checks
- **Documentation**: API documentation with Swagger
- **Error Handling**: Centralized error handling with custom error types
- **File Upload**: Multer integration with Sharp for image processing
- **Email**: Nodemailer integration for email services

## 📁 Project Structure

```
server/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── app.ts           # Express app configuration
│   └── index.ts         # Application entry point
├── tests/               # Test files
├── docs/                # API documentation
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose setup
└── package.json         # Dependencies and scripts
```

## 🛠️ Prerequisites

- Node.js 18+
- npm or yarn
- Docker & Docker Compose (optional)
- PostgreSQL (optional, can use Docker)

## 🔧 Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://username:password@localhost:5432/workout_db"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 3. Database Setup (Optional)

If using Prisma with a database:

```bash
npx prisma migrate dev
npx prisma generate
```

## 🚀 Development

### Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000` with hot reload enabled.

### Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run type-check   # Check TypeScript types
npm run validate     # Run all checks (type, lint, test)
```

## 🐳 Docker

### Build and Run with Docker

```bash
# Build the image
npm run docker:build

# Run the container
npm run docker:run
```

### Using Docker Compose

```bash
# Start all services (API, PostgreSQL, Redis)
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f api
```

## 📊 API Endpoints

### Health Check

- `GET /health` - Basic health check
- `GET /api/health` - Detailed health information

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request throttling
- **Input Validation**: Request validation with Zod
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt for password security
- **Environment Variables**: Secure configuration

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📝 Code Quality

The project includes:

- **ESLint**: Code linting with TypeScript rules
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit validation
- **Lint-staged**: Run linters on staged files

## 🚢 Production Deployment

### Environment Variables

Make sure to set these in production:

```env
NODE_ENV=production
JWT_SECRET=your-very-secure-random-string-at-least-32-characters
DATABASE_URL=your-production-database-url
ALLOWED_ORIGINS=https://yourdomain.com
```

### Docker Production

```bash
# Build production image
docker build -t workout-server:latest .

# Run with production environment
docker run -d \
  --name workout-server \
  -p 3000:3000 \
  --env-file .env \
  workout-server:latest
```

## 📚 API Documentation

The API documentation is automatically generated using **Swagger/OpenAPI** and includes:

- **Interactive API Explorer**: Test endpoints directly from the browser
- **Complete Schema Documentation**: Request/response models and examples
- **Authentication Testing**: Built-in JWT token management
- **Real-time Validation**: Immediate feedback on API calls

### Accessing Documentation

- **Development**: `http://localhost:3000/docs`
- **Swagger JSON**: `http://localhost:3000/docs.json`

### Features

- 🔍 **Interactive Testing**: Try API endpoints with real data
- 🔐 **Authentication Support**: Test protected endpoints with JWT tokens
- 📋 **Request/Response Examples**: Complete examples for all endpoints
- 🏷️ **Organized by Tags**: Endpoints grouped by functionality (Auth, Users, Health)
- 🎨 **Custom Styling**: Clean, professional interface
- 💾 **Persistent Authorization**: Tokens are saved during your session

### API Sections

- **General**: Basic API information and health checks
- **Authentication**: User registration, login, logout, and token refresh
- **Users**: Profile management and user operations
- **Health**: Server health and status monitoring

The documentation is automatically updated when you modify route annotations and is only available in development/staging environments for security.

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, please open an issue on the repository or contact the development team.
