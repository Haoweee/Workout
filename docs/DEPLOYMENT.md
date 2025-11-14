# Deployment Guide

This guide covers deployment options for the Workout Backend Service, including production setup, environment configuration, and monitoring.

---

## Overview

The Workout Backend Service is a Node.js/TypeScript application using:

- **Runtime:** Node.js 18+
- **Database:** PostgreSQL with Prisma ORM
- **Package Manager:** pnpm
- **Build Tool:** TypeScript + tsc-alias

---

## Prerequisites

### System Requirements

- Node.js 18.0.0 or higher
- PostgreSQL 13+ database
- pnpm package manager
- Git for code deployment

### Environment Setup

The application requires environment variables for configuration. See [Environment Variables](#environment-variables) section.

---

## Environment Variables

Create appropriate `.env` files based on your deployment environment:

### Required Variables

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/workout_db"

# Authentication
JWT_SECRET="your-super-secure-jwt-secret-key-here"
JWT_REFRESH_SECRET="your-super-secure-refresh-secret-key-here"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
NODE_ENV="production"
PORT=3000

# Security
BCRYPT_SALT_ROUNDS=12

# File Upload
MAX_FILE_SIZE=5242880  # 5MB
UPLOAD_PATH="./uploads"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000    # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100    # per window

# CORS
CORS_ORIGIN="https://yourdomain.com,https://www.yourdomain.com"

# Email (Optional - for notifications)
SMTP_HOST="smtp.yourdomain.com"
SMTP_PORT=587
SMTP_USERNAME="noreply@yourdomain.com"
SMTP_PASSWORD="your-email-password"
SMTP_FROM="Workout App <noreply@yourdomain.com>"
```

### Environment Files

```bash
# Development
.env.local      # Local development overrides
.env.example    # Template file

# Production
.env.prod       # Production environment variables
```

---

## Deployment Options

## Option 1: Traditional VPS/Server Deployment

### 1. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PM2 for process management
npm install -g pm2

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib
```

### 2. Database Setup

```bash
# Create database and user
sudo -u postgres createdb workout_db
sudo -u postgres createuser --pwprompt workout_user

# Grant permissions
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE workout_db TO workout_user;"
```

### 3. Application Deployment

```bash
# Clone repository
git clone https://github.com/yourusername/workout-backend.git
cd workout-backend/server

# Install dependencies
pnpm install --prod

# Build application
pnpm run build

# Run database migrations
npx prisma migrate deploy

# Seed database with exercises (optional)
pnpm run import:exercises

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. PM2 Configuration

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: "workout-api",
      script: "./dist/index.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      env_file: ".env.prod",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      time: true,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      instance_var: "INSTANCE_ID",
    },
  ],
};
```

### 5. Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # API routes
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Increase timeout for long requests
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:3000;
        access_log off;
    }

    # File uploads
    client_max_body_size 10M;

    # Gzip compression
    gzip on;
    gzip_types text/plain application/json application/javascript text/css;
}
```

---

## Option 2: Cloud Platform Deployment

### Heroku

1. **Prepare Heroku App**

```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-workout-api

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set NODE_ENV=production
```

2. **Deploy**

```bash
# Deploy from server directory
git subtree push --prefix server heroku main

# Run migrations
heroku run npx prisma migrate deploy

# Import exercises
heroku run pnpm run import:exercises
```

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and initialize
railway login
railway init

# Deploy
railway up
```

### Render

1. Connect GitHub repository
2. Set build command: `cd server && pnpm install && pnpm run build`
3. Set start command: `cd server && node dist/index.js`
4. Add environment variables in dashboard

---

## SSL/TLS Configuration

### Let's Encrypt with Certbot

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## Monitoring & Logging

### Application Monitoring

```javascript
// Basic monitoring with PM2
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30

// Health monitoring
pm2 install pm2-server-monit
```

### Log Management

```bash
# Log structure
logs/
├── access.log      # Nginx access logs
├── error.log       # Nginx error logs
├── app.log         # Application logs
└── pm2/           # PM2 logs
    ├── out.log
    └── error.log
```

### Database Monitoring

```sql
-- Monitor database performance
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;

-- Monitor connections
SELECT state, count(*)
FROM pg_stat_activity
GROUP BY state;
```

---

## Performance Optimization

### Database Optimization

```sql
-- Regular maintenance
VACUUM ANALYZE;

-- Monitor slow queries
ALTER SYSTEM SET log_min_duration_statement = 1000;
SELECT pg_reload_conf();

-- Connection pooling
-- Use PgBouncer for production environments
```

### Application Optimization

```javascript
// Enable cluster mode in PM2
{
  instances: 'max',
  exec_mode: 'cluster'
}

// Database connection pooling
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  connectionLimit = 20
}
```

---

## Backup Strategy

### Database Backups

```bash
#!/bin/bash
# backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="workout_db"

# Create backup
pg_dump $DB_NAME > "$BACKUP_DIR/workout_db_$DATE.sql"

# Compress backup
gzip "$BACKUP_DIR/workout_db_$DATE.sql"

# Remove backups older than 30 days
find $BACKUP_DIR -name "workout_db_*.sql.gz" -mtime +30 -delete

echo "Backup completed: workout_db_$DATE.sql.gz"
```

### File Backups

```bash
# Backup uploads directory
rsync -av --delete ./uploads/ /backups/uploads/

# S3 backup (if using AWS)
aws s3 sync ./uploads/ s3://your-bucket/uploads/ --delete
```

---

## Security Checklist

### Production Security

- [ ] Use HTTPS only
- [ ] Set secure environment variables
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Use secure headers (helmet.js)
- [ ] Implement proper authentication
- [ ] Regular security updates
- [ ] Database security (restricted access)
- [ ] File upload restrictions
- [ ] Input validation on all endpoints

### Environment Security

```bash
# Secure file permissions
chmod 600 .env.prod
chmod 755 uploads/
chown -R nodejs:nodejs uploads/

# Firewall configuration
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw deny 3000  # Block direct access to app port
sudo ufw enable
```

---

## Troubleshooting

### Common Issues

**Database Connection Issues**

```bash
# Check connection
npx prisma db pull

# Reset database
npx prisma migrate reset

# Check logs
docker-compose logs postgres
```

**Application Won't Start**

```bash
# Check PM2 status
pm2 status

# View application logs
pm2 logs workout-api

# Restart application
pm2 restart workout-api
```

**High Memory Usage**

```bash
# Monitor memory
pm2 monit

# Set memory limit
pm2 start ecosystem.config.js --max-memory-restart 1G
```

### Performance Issues

```bash
# Check database performance
psql -d workout_db -c "SELECT * FROM pg_stat_activity;"

# Check application metrics
curl http://localhost:3000/api/health/detailed

# Monitor system resources
htop
iostat -x 1
```

---

## Scaling Considerations

### Horizontal Scaling

- Use load balancers (nginx, HAProxy)
- Database read replicas
- Redis for session storage
- CDN for static assets

### Vertical Scaling

- Increase server resources
- Optimize database queries
- Enable database connection pooling
- Use caching layers (Redis)

---

## Production Checklist

- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database migrations deployed
- [ ] Backup strategy implemented
- [ ] Monitoring tools configured
- [ ] Security headers enabled
- [ ] Rate limiting configured
- [ ] Error tracking setup
- [ ] Health checks working
- [ ] Log rotation configured
- [ ] Performance testing completed
- [ ] Security audit passed
