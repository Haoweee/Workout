# Troubleshooting Guide

This guide helps you diagnose and resolve common issues with the Workout Backend Service.

---

## Overview

This troubleshooting guide covers:

- **Common Errors** - Frequent issues and their solutions
- **Database Problems** - Connection and migration issues
- **Authentication Issues** - JWT and user access problems
- **Performance Problems** - Slow queries and optimization
- **Deployment Issues** - Production environment problems
- **Development Setup** - Local development troubleshooting

---

## Quick Diagnostics

### Health Check

```bash
# Check application health
curl http://localhost:3000/api/health

# Check detailed health information
curl http://localhost:3000/api/health/detailed
```

### Database Connection Test

```bash
# Test database connection
npx prisma db pull

# Check database status
psql $DATABASE_URL -c "SELECT version();"
```

### Environment Check

```bash
# Verify environment variables
echo $DATABASE_URL
echo $JWT_SECRET
echo $NODE_ENV

# Check Node.js version
node --version  # Should be 18+
```

---

## Common Errors

### Error: "Cannot connect to database"

**Symptoms:**

```
Error: P1001: Can't reach database server at `localhost:5432`
```

**Causes & Solutions:**

1. **PostgreSQL not running**

   ```bash
   # Check if PostgreSQL is running
   sudo systemctl status postgresql

   # Start PostgreSQL
   sudo systemctl start postgresql

   # For macOS with Homebrew
   brew services start postgresql
   ```

2. **Wrong database URL**

   ```bash
   # Check DATABASE_URL format
   # Format: postgresql://username:password@host:port/database
   export DATABASE_URL="postgresql://user:password@localhost:5432/workout_db"
   ```

3. **Database doesn't exist**

   ```bash
   # Create database
   createdb workout_db

   # Or via psql
   psql -c "CREATE DATABASE workout_db;"
   ```

4. **Firewall/Network issues**

   ```bash
   # Test connection directly
   telnet localhost 5432

   # Check if port is open
   netstat -ln | grep 5432
   ```

### Error: "Authentication failed"

**Symptoms:**

```json
{
  "error": "Unauthorized",
  "details": "Invalid token"
}
```

**Solutions:**

1. **Token expired**

   ```bash
   # Get new token via login
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com","password":"password"}'
   ```

2. **Invalid JWT secret**

   ```bash
   # Check JWT_SECRET is set
   echo $JWT_SECRET

   # Ensure secret is consistent across app instances
   # Update .env file with correct secret
   ```

3. **Malformed token**
   ```bash
   # Token should start with "Bearer "
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Error: "Prisma migration failed"

**Symptoms:**

```
Error: P3009: migrate found failed migration
```

**Solutions:**

1. **Reset migration state**

   ```bash
   # Mark migration as rolled back
   npx prisma migrate resolve --rolled-back 20231101_migration_name

   # Apply migration again
   npx prisma migrate dev
   ```

2. **Manual migration fix**

   ```bash
   # Reset database (CAUTION: loses data)
   npx prisma migrate reset

   # Deploy fresh migrations
   npx prisma migrate deploy
   ```

3. **Check migration files**

   ```bash
   # Review migration SQL
   cat prisma/migrations/[timestamp]_name/migration.sql

   # Manually apply problematic migrations
   psql $DATABASE_URL < prisma/migrations/[timestamp]_name/migration.sql
   ```

### Error: "Port already in use"

**Symptoms:**

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**

1. **Kill process using port**

   ```bash
   # Find process using port 3000
   lsof -i :3000

   # Kill the process
   kill -9 <PID>

   # Or use pkill
   pkill -f "node.*3000"
   ```

2. **Use different port**

   ```bash
   # Set different port in .env
   PORT=3001

   # Or start with custom port
   PORT=3001 npm run dev
   ```

### Error: "File upload failed"

**Symptoms:**

```json
{
  "error": "File upload failed",
  "details": "ENOENT: no such file or directory"
}
```

**Solutions:**

1. **Create upload directory**

   ```bash
   mkdir -p uploads/avatars
   chmod 755 uploads
   ```

2. **Check disk space**

   ```bash
   df -h
   ```

3. **Verify file permissions**
   ```bash
   # Set proper permissions
   chown -R $USER:$USER uploads/
   chmod -R 755 uploads/
   ```

---

## Database Issues

### Connection Pool Exhaustion

**Symptoms:**

```
Error: P2024: Timed out fetching a new connection from the connection pool
```

**Solutions:**

1. **Increase connection limit**

   ```javascript
   // In prisma schema
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
     connectionLimit = 20
   }
   ```

2. **Check for connection leaks**

   ```typescript
   // Always disconnect after operations
   try {
     const result = await prisma.user.findMany();
     return result;
   } finally {
     // In older Prisma versions
     await prisma.$disconnect();
   }
   ```

3. **Monitor active connections**
   ```sql
   -- Check active connections
   SELECT state, count(*)
   FROM pg_stat_activity
   WHERE datname = 'workout_db'
   GROUP BY state;
   ```

### Slow Queries

**Symptoms:**

- API responses taking >2 seconds
- Database CPU usage high

**Diagnostic Tools:**

1. **Enable query logging**

   ```sql
   -- Enable slow query log
   ALTER SYSTEM SET log_min_duration_statement = 1000;
   SELECT pg_reload_conf();
   ```

2. **Analyze query performance**

   ```sql
   -- Check slow queries
   SELECT query, calls, total_time, mean_time
   FROM pg_stat_statements
   ORDER BY total_time DESC
   LIMIT 10;
   ```

3. **Explain query plans**
   ```sql
   EXPLAIN ANALYZE SELECT * FROM workouts
   WHERE user_id = 'user-id'
   ORDER BY created_at DESC;
   ```

**Solutions:**

1. **Add missing indexes**

   ```sql
   -- Add indexes for common queries
   CREATE INDEX idx_workouts_user_id ON workouts(user_id);
   CREATE INDEX idx_workouts_created_at ON workouts(created_at);
   CREATE INDEX idx_routine_exercises_routine_id ON routine_exercises(routine_id);
   ```

2. **Optimize N+1 queries**

   ```typescript
   // Bad: N+1 query
   const workouts = await prisma.workout.findMany();
   for (const workout of workouts) {
     workout.sets = await prisma.workoutSet.findMany({
       where: { workoutId: workout.id },
     });
   }

   // Good: Include related data
   const workouts = await prisma.workout.findMany({
     include: {
       workoutSets: true,
     },
   });
   ```

### Migration Issues

**Common Migration Problems:**

1. **Constraint violations**

   ```sql
   -- Check constraint violations before migration
   SELECT * FROM users WHERE email IS NULL;
   SELECT * FROM routines WHERE author_id NOT IN (SELECT id FROM users);
   ```

2. **Data type mismatches**

   ```sql
   -- Fix data before migration
   UPDATE routine_exercises SET sets = '0' WHERE sets IS NULL;
   UPDATE routine_exercises SET reps = '0' WHERE reps IS NULL;
   ```

3. **Foreign key issues**
   ```sql
   -- Clean orphaned records
   DELETE FROM routine_exercises
   WHERE routine_id NOT IN (SELECT id FROM routines);
   ```

---

## Performance Issues

### High Memory Usage

**Symptoms:**

- Application using >1GB RAM
- Frequent garbage collection
- Out of memory errors

**Diagnostic Commands:**

```bash
# Check memory usage
node --expose-gc -e "
  console.log('Memory before GC:', process.memoryUsage());
  global.gc();
  console.log('Memory after GC:', process.memoryUsage());
"

# Monitor with PM2
pm2 monit

# Check for memory leaks
node --inspect app.js
# Then use Chrome DevTools Memory tab
```

**Solutions:**

1. **Optimize database queries**

   ```typescript
   // Limit result sets
   const workouts = await prisma.workout.findMany({
     take: 20,
     skip: offset,
     select: {
       id: true,
       title: true,
       createdAt: true,
       // Don't select large text fields unnecessarily
     },
   });
   ```

2. **Implement pagination**

   ```typescript
   // Always paginate large datasets
   async function getWorkouts(page: number = 1, limit: number = 20) {
     const offset = (page - 1) * limit;
     return await prisma.workout.findMany({
       take: limit,
       skip: offset,
     });
   }
   ```

3. **Add memory limits**
   ```javascript
   // PM2 ecosystem.config.js
   module.exports = {
     apps: [
       {
         name: "workout-api",
         script: "./dist/index.js",
         max_memory_restart: "512M",
       },
     ],
   };
   ```

### High CPU Usage

**Symptoms:**

- CPU usage consistently >80%
- Slow response times
- Request timeouts

**Solutions:**

1. **Enable clustering**

   ```javascript
   // PM2 cluster mode
   module.exports = {
     apps: [
       {
         name: "workout-api",
         script: "./dist/index.js",
         instances: "max",
         exec_mode: "cluster",
       },
     ],
   };
   ```

2. **Optimize expensive operations**

   ```typescript
   // Cache expensive calculations
   const cache = new Map();

   async function getWorkoutStats(userId: string) {
     const cacheKey = `stats:${userId}`;
     if (cache.has(cacheKey)) {
       return cache.get(cacheKey);
     }

     const stats = await calculateStats(userId);
     cache.set(cacheKey, stats);
     setTimeout(() => cache.delete(cacheKey), 300000); // 5min cache

     return stats;
   }
   ```

3. **Add rate limiting**

   ```typescript
   import rateLimit from "express-rate-limit";

   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100, // limit each IP to 100 requests per windowMs
     message: "Too many requests from this IP",
   });

   app.use("/api/", limiter);
   ```

---

## Development Issues

### TypeScript Compilation Errors

**Common Errors:**

1. **Module resolution issues**

   ```json
   // tsconfig.json - ensure paths are correct
   {
     "compilerOptions": {
       "baseUrl": "./src",
       "paths": {
         "@/*": ["*"],
         "@controllers/*": ["controllers/*"],
         "@services/*": ["services/*"]
       }
     }
   }
   ```

2. **Type definition conflicts**

   ```bash
   # Clear TypeScript cache
   rm -rf node_modules/.cache
   npm run clean && npm run build

   # Update type definitions
   npm install @types/node@latest
   ```

### Test Failures

**Common Test Issues:**

1. **Database state pollution**

   ```typescript
   // Ensure proper cleanup between tests
   beforeEach(async () => {
     // Clear all tables
     await testPrisma.workoutSet.deleteMany();
     await testPrisma.workout.deleteMany();
     await testPrisma.routine.deleteMany();
     await testPrisma.user.deleteMany();
   });
   ```

2. **Async test issues**

   ```typescript
   // Increase timeout for slow tests
   jest.setTimeout(30000);

   // Use proper async/await
   it("should create user", async () => {
     const user = await userService.createUser(userData);
     expect(user).toBeDefined();
   });
   ```

3. **Mock issues**

   ```typescript
   // Clear mocks between tests
   beforeEach(() => {
     jest.clearAllMocks();
   });

   // Restore original implementations
   afterAll(() => {
     jest.restoreAllMocks();
   });
   ```

---

## Production Issues

### Application Crashes

**Log Analysis:**

```bash
# Check application logs
pm2 logs workout-api

# Check system logs
sudo journalctl -u workout-api -f

# Check memory/disk
free -h
df -h
```

**Common Crash Causes:**

1. **Uncaught exceptions**

   ```typescript
   // Add global error handlers
   process.on("uncaughtException", (error) => {
     logger.error("Uncaught Exception:", error);
     process.exit(1);
   });

   process.on("unhandledRejection", (reason, promise) => {
     logger.error("Unhandled Rejection at:", promise, "reason:", reason);
     process.exit(1);
   });
   ```

2. **Database connection loss**
   ```typescript
   // Implement retry logic
   async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
     try {
       return await fn();
     } catch (error) {
       if (retries > 0 && error.code === "P1001") {
         await new Promise((resolve) => setTimeout(resolve, 1000));
         return withRetry(fn, retries - 1);
       }
       throw error;
     }
   }
   ```

### SSL Certificate Issues

**Symptoms:**

- HTTPS not working
- Browser security warnings
- Certificate expired errors

**Solutions:**

1. **Check certificate status**

   ```bash
   # Check certificate expiry
   openssl x509 -in /path/to/cert.pem -text -noout | grep "Not After"

   # Check certificate chain
   openssl verify -CAfile /path/to/ca.pem /path/to/cert.pem
   ```

2. **Renew Let's Encrypt certificates**

   ```bash
   # Renew certificates
   sudo certbot renew

   # Test auto-renewal
   sudo certbot renew --dry-run
   ```

3. **Restart web server**

   ```bash
   # Restart Nginx after certificate renewal
   sudo systemctl restart nginx

   # Or reload configuration
   sudo nginx -s reload
   ```

---

## Monitoring and Debugging

### Application Monitoring

**Health Endpoints:**

```typescript
// Implement comprehensive health checks
app.get("/api/health/detailed", async (req, res) => {
  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`;
    const dbStatus = "connected";

    // Check memory
    const memory = process.memoryUsage();

    // Check uptime
    const uptime = process.uptime();

    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
      database: dbStatus,
      memory: {
        used: Math.round(memory.heapUsed / 1024 / 1024) + "MB",
        total: Math.round(memory.heapTotal / 1024 / 1024) + "MB",
      },
      uptime: Math.round(uptime) + "s",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message,
    });
  }
});
```

### Logging Best Practices

```typescript
import winston from "winston";

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: "workout-api" },
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

// Use structured logging
logger.info("User created", { userId: user.id, email: user.email });
logger.error("Database error", { error: error.message, stack: error.stack });
```

---

## Emergency Procedures

### Database Backup and Restore

**Emergency Backup:**

```bash
#!/bin/bash
# emergency-backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="emergency_backup_$DATE.sql"

echo "Creating emergency backup..."
pg_dump $DATABASE_URL > $BACKUP_FILE
gzip $BACKUP_FILE

echo "Backup created: ${BACKUP_FILE}.gz"
echo "Size: $(du -h ${BACKUP_FILE}.gz | cut -f1)"
```

**Emergency Restore:**

```bash
#!/bin/bash
# emergency-restore.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: ./emergency-restore.sh backup_file.sql.gz"
  exit 1
fi

echo "⚠️  This will replace the current database!"
read -p "Are you sure? (yes/no): " confirm

if [ "$confirm" = "yes" ]; then
  gunzip -c $BACKUP_FILE | psql $DATABASE_URL
  echo "Database restored from $BACKUP_FILE"
else
  echo "Restore cancelled"
fi
```

### Application Recovery

**Quick Recovery Steps:**

1. **Stop application**

   ```bash
   pm2 stop workout-api
   ```

2. **Check logs**

   ```bash
   pm2 logs workout-api --lines 100
   ```

3. **Verify database**

   ```bash
   psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
   ```

4. **Restart application**

   ```bash
   pm2 restart workout-api
   ```

5. **Verify functionality**
   ```bash
   curl http://localhost:3000/api/health/detailed
   ```

---

## Contact and Support

### When to Escalate

Escalate issues when:

- Data corruption is suspected
- Security breach detected
- Multiple system components failing
- Performance degradation >50%
- User data at risk

### Escalation Information

**Emergency Contacts:**

- System Administrator: [contact info]
- Database Administrator: [contact info]
- Security Team: [contact info]

**Required Information:**

- Time of incident
- Error messages and logs
- Steps to reproduce
- Impact assessment
- Current system status

This troubleshooting guide helps maintain system reliability and provides quick resolution paths for common issues.
