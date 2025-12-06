import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../utils/errors';

/**
 * Middleware factory for validating request body against Zod schema
 */
export const validateBody = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const result = schema.parse(req.body);
            req.body = result; // Replace with parsed/transformed data
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    const path = err.path.join('.');
                    errors[path] = err.message;
                });
                next(new ValidationError('Validation failed', errors));
            } else {
                next(error);
            }
        }
    };
};

/**
 * Middleware factory for validating query parameters
 */
export const validateQuery = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const result = schema.parse(req.query);
            req.query = result;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    const path = err.path.join('.');
                    errors[path] = err.message;
                });
                next(new ValidationError('Query validation failed', errors));
            } else {
                next(error);
            }
        }
    };
};

/**
 * Middleware factory for validating URL parameters
 */
export const validateParams = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const result = schema.parse(req.params);
            req.params = result;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    const path = err.path.join('.');
                    errors[path] = err.message;
                });
                next(new ValidationError('Parameter validation failed', errors));
            } else {
                next(error);
            }
        }
    };
};

/**
 * Default export - validates request body
 */
export const validate = validateBody;
