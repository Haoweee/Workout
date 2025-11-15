module.exports = {
  apps: [
    {
      name: 'workout-api',
      script: './dist/src/index.js',
      cwd: '/var/www/Workout/server',
      instances: 'max', // Use all CPU cores
      exec_mode: 'cluster',

      // Environment Configuration
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },

      // Logging Configuration
      error_file: '/var/log/pm2/workout-api-error.log',
      out_file: '/var/log/pm2/workout-api-out.log',
      log_file: '/var/log/pm2/workout-api.log',
      merge_logs: true,
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Memory & Performance
      max_memory_restart: '512M',
      node_args: '--max-old-space-size=512 --optimize-for-size',

      // Health Monitoring
      min_uptime: '10s',
      max_restarts: 10,
      autorestart: true,

      // Graceful Shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      shutdown_with_message: true,

      // Advanced Options
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'uploads'],

      // Health Check
      health_check_grace_period: 30000,

      // Source Map Support
      source_map_support: true,
    },
  ],

  // Deployment Configuration
  deploy: {
    production: {
      user: 'deployer',
      host: process.env.DO_HOST,
      ref: 'origin/main',
      repo: 'git@github.com:Haoweee/Workout.git',
      path: '/var/www/app',
      'pre-setup': 'mkdir -p /var/log/pm2',
      'post-setup': 'pnpm install --frozen-lockfile && pnpm build',
      'pre-deploy-local': '',
      'post-deploy':
        'pnpm install --frozen-lockfile && pnpm build && pm2 reload ecosystem.config.js --env production',
      'pre-deploy': 'git fetch --all',
    },
  },
};
