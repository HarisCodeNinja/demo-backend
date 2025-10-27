import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables once, early
dotenv.config();

const EnvSchema = z.object({
  ENVIRONMENT: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(8000),

  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASS: z.string(),
  DB_SYNC: z.enum(['true', 'false']).default('false'),
  
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),

  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_EXPIRATION: z.string().default('1d'),

  CORS_ORIGINS: z.string().default(''),
});

export type AppEnv = z.infer<typeof EnvSchema>;

export const env: AppEnv = EnvSchema.parse(process.env);
