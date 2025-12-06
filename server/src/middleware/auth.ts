import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { AuthError } from '../utils/errors';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
            };
        }
    }
}

/**
 * Authentication middleware - requires valid JWT token
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            throw new AuthError('No authorization header');
        }

        if (!authHeader.startsWith('Bearer ')) {
            throw new AuthError('Invalid authorization format');
        }

        const token = authHeader.substring(7); // Remove 'Bearer '
        
        if (!token) {
            throw new AuthError('No token provided');
        }

        // Verify token and attach user to request
        const payload = authService.verifyAccessToken(token);
        req.user = payload;
        
        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Optional authentication middleware - attaches user if token present
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            if (token) {
                const payload = authService.verifyAccessToken(token);
                req.user = payload;
            }
        }
        
        next();
    } catch (error) {
        // For optional auth, just continue without user
        next();
    }
};
