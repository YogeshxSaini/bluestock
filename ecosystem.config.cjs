module.exports = {
  apps: [
    {
      name: 'backend',
      cwd: './backend',
      script: 'src/server.js',
      env: {
        NODE_ENV: 'development',
      },
      watch: false,
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
    {
      name: 'frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
      },
      watch: false,
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
