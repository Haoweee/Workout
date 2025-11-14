# workout Server - Developer Commands & Workflows

This document contains essential commands and workflows for developing the workout fitness API server.

## 📋 Table of Contents

- [Database & Prisma Commands](#database--prisma-commands)
- [Development Commands](#development-commands)
- [Testing Commands](#testing-commands)
- [Build & Deployment](#build--deployment)
- [Git Commands](#git-commands)
- [Debugging & Troubleshooting](#debugging--troubleshooting)
- [Package Management](#package-management)
- [Environment Management](#environment-management)

## 🗄️ Database & Prisma Commands

### Adding New Fields to Existing Models

**Example: Adding `avatar_url` to User model**

1. **Edit the schema** (`prisma/schema.prisma`):

```prisma
model User {
  id           String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  username     String   @unique
  fullName     String   @map("full_name")
  email        String   @unique @db.VarChar(320)
  passwordHash String   @map("password_hash")
  avatarUrl    String?  @map("avatar_url") // Add this line
  createdAt    DateTime @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt    DateTime @updatedAt @map("updated_at") @db.Timestamptz(6)
  // ... rest of the model
}
```

2. **Create and apply migration**:

```bash
npx prisma migrate dev --name add_avatar_url_to_users
```

3. **Regenerate Prisma client**:

```bash
npx prisma generate
```

### Essential Prisma Commands

```bash
# Create new migration after schema changes
npx prisma migrate dev --name migration_name

# Apply migrations to production
npx prisma migrate deploy

# Reset database (⚠️ DELETES ALL DATA)
npx prisma migrate reset

# Regenerate Prisma client (after schema changes)
npx prisma generate

# Open Prisma Studio (database GUI)
npx prisma studio

# Check migration status
npx prisma migrate status

# Create migration without applying (for review)
npx prisma migrate dev --create-only --name migration_name

# Format schema file
npx prisma format

# Validate schema
npx prisma validate

# Pull database schema to Prisma (reverse engineering)
npx prisma db pull

# Push schema to database without migration files
npx prisma db push
```

## 🚀 Development Commands

### Server Management

```bash
# Start development server with hot reload
npm run dev

# Start development server with debugging
npm run dev:debug

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# Start production server with NODE_ENV=production
npm run start:prod

# Clean build directory
npm run clean
```

### Code Quality

```bash
# Run TypeScript compilation check (no emit)
npx tsc --noEmit

# Check for compilation errors
npm run build

# Format code (if prettier is set up)
npx prettier --write .

# Lint code (if ESLint is set up)
npx eslint src/
```

## 🧪 Testing Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI (no watch, with coverage)
npm run test:ci

# Run specific test file
npm test -- tests/unit/authService.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="AuthService"

# Run tests for specific directory
npm test -- tests/integration/

# Debug tests
npm test -- --detectOpenHandles --forceExit
```

## 📦 Build & Deployment

```bash
# Full build process
npm run clean && npm run build

# Check if build works
npm run build && node dist/index.js

# Production deployment steps
npm run build
npm run start:prod

# Docker commands (if using Docker)
docker build -t workout-server .
docker run -p 5000:5000 workout-server
```

## 📝 Git Commands

### Branch Management

```bash
# Create new feature branch
git checkout -b feature/avatar-upload

# Create new fix branch
git checkout -b fix/cors-issue

# Switch to main branch
git checkout main

# Delete local branch
git branch -d feature/avatar-upload

# Delete remote branch
git push origin --delete feature/avatar-upload
```

### Commit Workflow

```bash
# Add specific files
git add src/controllers/authController.ts

# Add all changes
git add .

# Commit with message
git commit -m "feat: add avatar_url field to User model"

# Commit and push
git commit -m "fix: resolve CORS issues in Swagger UI" && git push

# Amend last commit
git commit --amend -m "Updated commit message"
```

### Common Git Patterns

```bash
# Conventional commit messages
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"
git commit -m "docs: update documentation"
git commit -m "test: add test cases"
git commit -m "refactor: improve code structure"
git commit -m "chore: update dependencies"

# Squash commits before merge
git rebase -i HEAD~3

# Reset to previous commit (keep changes)
git reset --soft HEAD~1

# Reset to previous commit (discard changes)
git reset --hard HEAD~1
```

## 🐛 Debugging & Troubleshooting

### Common Issues & Solutions

#### Port Already in Use

```bash
# Find what's using the port
lsof -i :5000

# Kill process using port
kill -9 $(lsof -t -i:5000)

# Or change port in .env file
PORT=5001
```

#### Prisma Issues

```bash
# Regenerate Prisma client
npx prisma generate

# Reset and reseed database
npx prisma migrate reset

# Check database connection
npx prisma db pull
```

#### TypeScript Issues

```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
rm -rf dist/
npm run build

# Restart TypeScript server in VS Code
# Command Palette -> TypeScript: Restart TS Server
```

#### Node Modules Issues

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force
```

### Logging & Monitoring

```bash
# Check server logs in development
npm run dev | grep ERROR

# Check specific log levels
npm run dev | grep "info\|error\|warn"

# Monitor file changes
watch -n 1 'ls -la src/'
```

## 📦 Package Management

### Dependencies

```bash
# Install new dependency
npm install package-name

# Install dev dependency
npm install -D package-name

# Install specific version
npm install package-name@1.2.3

# Update all packages
npm update

# Check outdated packages
npm outdated

# Remove package
npm uninstall package-name

# Check security vulnerabilities
npm audit

# Fix security issues
npm audit fix
```

### Common Packages to Install

```bash
# Prisma version sync
npm install prisma@latest @prisma/client@latest

# JWT related
npm install jsonwebtoken @types/jsonwebtoken

# Validation
npm install joi zod

# File upload
npm install multer @types/multer

# Image processing
npm install sharp

# Email
npm install nodemailer @types/nodemailer
```

## 🌍 Environment Management

### Environment Files

```bash
# Copy example environment
cp .env.example .env

# Environment for different stages
.env                 # Development
.env.test           # Testing
.env.production     # Production
```

### Environment Variables Commands

```bash
# Load environment and run command
NODE_ENV=production npm start

# Check current environment variables
printenv | grep -E "(NODE_ENV|PORT|DATABASE_URL)"

# Test environment loading
node -e "require('dotenv/config'); console.log(process.env.PORT)"
```

## 🔧 Utility Scripts

### Custom Scripts (add to package.json)

```json
{
  "scripts": {
    "db:migrate": "npx prisma migrate dev",
    "db:reset": "npx prisma migrate reset --force",
    "db:studio": "npx prisma studio",
    "db:generate": "npx prisma generate",
    "logs": "tail -f logs/app.log",
    "clean:all": "rm -rf node_modules dist coverage && npm install"
  }
}
```

### Quick Commands

```bash
# Full reset and restart
npm run clean && npm install && npm run build && npm run dev

# Database refresh
npx prisma migrate reset --force && npm run dev

# Quick test cycle
npm run build && npm test

# Production readiness check
npm run build && npm run test:ci && npm audit
```

## 📊 Performance & Monitoring

```bash
# Check memory usage
node --inspect dist/index.js

# Profile performance
node --prof dist/index.js

# Check bundle size
du -sh dist/

# Monitor in real-time
top -p $(pgrep -f "node.*index.js")
```

---

## 🚨 Emergency Commands

### If Everything Breaks

```bash
# Nuclear option - complete reset
rm -rf node_modules package-lock.json dist/
npm install
npx prisma generate
npm run build
npm test
```

### Database Recovery

```bash
# Backup before dangerous operations
pg_dump your_database > backup.sql

# Restore from backup
psql your_database < backup.sql
```

---

**💡 Pro Tips:**

- Always run `npm run build` before pushing to production
- Use `npx prisma migrate reset` only in development
- Keep your `.env` file secure and never commit it
- Test database migrations on a copy before production
- Use conventional commit messages for better Git history

**🔗 Useful URLs:**

- Swagger API Docs: http://localhost:5000/docs
- Health Check: http://localhost:5000/health
- Prisma Studio: http://localhost:5555 (when running `npx prisma studio`)
