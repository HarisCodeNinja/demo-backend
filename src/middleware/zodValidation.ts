import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validateZodSchema = (schema: z.ZodSchema, segment: 'body' | 'query' | 'params') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req[segment];
      const result = await schema.safeParseAsync(data);
      
      if (!result.success) {
        const formattedErrors = result.error.issues.map((issue) => {
          const path = issue.path.length > 0 ? issue.path.join('.') : 'root';
          return {
            field: path,
            message: issue.message,
            code: issue.code,
            received: issue.code === 'invalid_type' ? (issue as any).received : undefined,
          };
        });

        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: `Validation failed for ${segment}`,
          errors: formattedErrors,
          timestamp: new Date().toISOString(),
        });
      }

      // Only replace the segment if it's not query (since query is read-only)
      if (segment !== 'query') {
        req[segment] = result.data;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

