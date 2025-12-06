// Custom Error Classes for Rhytheme API

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly code: string;

    constructor(message: string, statusCode: number, code: string = 'INTERNAL_ERROR') {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.code = code;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    public readonly errors?: Record<string, string>;

    constructor(message: string, errors?: Record<string, string>) {
        super(message, 400, 'VALIDATION_ERROR');
        this.errors = errors;
    }
}

export class AuthError extends AppError {
    constructor(message: string = 'Authentication required') {
        super(message, 401, 'AUTH_ERROR');
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = 'Access denied') {
        super(message, 403, 'FORBIDDEN_ERROR');
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string = 'Resource') {
        super(`${resource} not found`, 404, 'NOT_FOUND');
    }
}

export class ConflictError extends AppError {
    constructor(message: string = 'Resource already exists') {
        super(message, 409, 'CONFLICT_ERROR');
    }
}

export class RateLimitError extends AppError {
    constructor(message: string = 'Too many requests') {
        super(message, 429, 'RATE_LIMIT_ERROR');
    }
}
