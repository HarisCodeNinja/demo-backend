import http from 'http';
import { app } from './app';
import { env } from './config/env';
import './config/db';
import logger from './util/logger';
import { initializeDailyAttendanceSeeding } from './automations/daily-attendance-seeding';

const server = http.createServer(app);

server.on('error', (err) => {
  logger.error(err);
});

server.listen(env.PORT, () => {
  logger.info(`Server running on http://localhost:${env.PORT}`);

  // Initialize daily attendance seeding cron job
  initializeDailyAttendanceSeeding();
});