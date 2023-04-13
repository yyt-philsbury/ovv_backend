module.exports = {
  apps: [
    {
      // Primary is what will run CRON jobs
      // can use process.env.name to access this
      name: 'NestJS Backend Template (Primary)',
      // We run the transpiled version to avoid transpiling
      // all instances to javascript on dev mode
      // So basically because the code is in TS, we can't
      // really use --watch for hot reloading because the
      // the transpiling on multiple instances is resource intensive
      script: './dist/src/main.js',
      instances: '1',
      exec_mode: 'cluster',
      env_development: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'NestJS Backend Template (Replica)',
      script: './dist/src/main.js',
      // max cpus - 1
      // can change to hard coded number
      instances: '-1',
      exec_mode: 'cluster',
      env_development: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};

