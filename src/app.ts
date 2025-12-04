import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { env } from './config/env';
import { errors as celebrateErrors } from 'celebrate';
import rateLimit from 'express-rate-limit';
import { prefixRoutes } from './util/routeConfig';
import { defaultRoutes } from './config/routes/defaultRoutes';

import { errorHandler } from './middleware/errorHandler';
import { setupSwagger } from './config/swagger';

const app = express();

// Honor X-Forwarded-* headers when sitting behind proxies/tunnels (ngrok, cloudflared, etc.)
// app.set('trust proxy', true);

// Core middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan(env.ENVIRONMENT === 'production' ? 'combined' : 'dev'));

// Static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK' });
});

// Rate limiter (basic)
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 6000,
});
app.use(limiter);
// Register default routes
defaultRoutes.forEach((routeConfig) => {
  const configuredRouters = prefixRoutes(routeConfig);
  configuredRouters.forEach((router) => {
    app.use(routeConfig.path, router);
  });
});

// Celebrate validation error formatting
app.use(celebrateErrors());

// Setup Swagger docs
setupSwagger(app);

// Global error handler – always last middleware before server.listen
app.use(errorHandler);

export { app };
