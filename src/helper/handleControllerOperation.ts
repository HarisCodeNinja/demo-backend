import { BaseError } from 'sequelize';
import {env} from '../config/env'

/**
 * Wrapper for handling controller operations with standardized error handling
 * @param h Response toolkit for generating responses
 * @param operation The async operation to execute
 * @param errorCode Status code to return on error (defaults to 500 as it is a server error)
 * @returns Response with appropriate status code
 */
export const handleControllerOperation = async <T>(h: any, operation: () => Promise<T>, errorCode: number = 500) => {
  try {
    return await operation();
  } catch (err: any) {
    const errors = err?.errors as BaseError[];
    if (errors) {
      err.message = `Type: ${err?.name}, ${errors.map((x) => x.message).join(', ')}`;
    }

    return h
      .response({
        message: err.message,
        errorDetails: env.ENVIRONMENT === 'development' ? err : {},
      })
      .code(errorCode);
  }
};
