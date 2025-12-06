import { Router } from 'express';
import { authService } from '../services/authService';
import { asyncHandler } from '../utils/asyncHandler';
import { validateBody } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { registerSchema, loginSchema, refreshSchema } from '../utils/validation';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post(
    '/register',
    validateBody(registerSchema),
    asyncHandler(async (req, res) => {
        const { user, tokens } = await authService.register(req.body);
        
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                user,
                ...tokens,
            },
        });
    })
);

/**
 * POST /api/auth/login
 * Login user
 */
router.post(
    '/login',
    validateBody(loginSchema),
    asyncHandler(async (req, res) => {
        const { user, tokens } = await authService.login(req.body);
        
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user,
                ...tokens,
            },
        });
    })
);

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post(
    '/refresh',
    validateBody(refreshSchema),
    asyncHandler(async (req, res) => {
        const tokens = await authService.refreshToken(req.body.refreshToken);
        
        res.json({
            success: true,
            message: 'Token refreshed',
            data: tokens,
        });
    })
);

/**
 * GET /api/auth/me
 * Get current user info (protected route)
 */
router.get(
    '/me',
    authenticate,
    asyncHandler(async (req, res) => {
        const user = await authService.getUserById(req.user!.userId);
        
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }
        
        res.json({
            success: true,
            data: { user },
        });
    })
);

export default router;
