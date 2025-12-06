import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors';

interface ErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        errors?: Record<string, string>;
        stack?: string;
    };
}

/**
 * Global error handler middleware
 * Must be registered last in the middleware chain
 */
export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // Log error for debugging
    const timestamp = new Date().toISOString();
    console.error('[ERROR]', timestamp, {
        method: req.method,
        path: req.path,
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });

    // Handle known operational errors
    if (err instanceof AppError) {
        const response: ErrorResponse = {
            success: false,
            error: {
                code: err.code,
                message: err.message,
            },
        };

        // Include validation errors if present
        if (err instanceof ValidationError && err.errors) {
            response.error.errors = err.errors;
        }

        // Include stack in development
        if (process.env.NODE_ENV === 'development') {
            response.error.stack = err.stack;
        }

        res.status(err.statusCode).json(response);
        return;
    }

    // Handle Prisma errors
    if (err.name === 'PrismaClientKnownRequestError') {
        const prismaError = err as any;
        let message = 'Database error';
        let statusCode = 500;

        if (prismaError.code === 'P2002') {
            message = 'A record with this value already exists';
            statusCode = 409;
        } else if (prismaError.code === 'P2025') {
            message = 'Record not found';
            statusCode = 404;
        }

        res.status(statusCode).json({
            success: false,
            error: {
                code: prismaError.code,
                message,
            },
        });
        return;
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        res.status(401).json({
            success: false,
            error: {
                code: 'INVALID_TOKEN',
                message: 'Invalid authentication token',
            },
        });
        return;
    }

    if (err.name === 'TokenExpiredError') {
        res.status(401).json({
            success: false,
            error: {
                code: 'TOKEN_EXPIRED',
                message: 'Authentication token has expired',
            },
        });
        return;
    }

    // Handle unknown errors (dont expose details in production)
    const response: ErrorResponse = {
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message: process.env.NODE_ENV === 'production'
                ? 'An unexpected error occurred'
                : err.message,
        },
    };

    if (process.env.NODE_ENV === 'development') {
        response.error.stack = err.stack;
    }

    res.status(500).json(response);
};

/**
 * 404 handler for undefined routes
 */
export const notFoundHandler = (req: Request, res: Response): void => {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: 'Route ' + req.method + ' ' + req.path + ' not found',
        },
    });
};
