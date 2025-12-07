import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { authService } from '../services/authService';
import { asyncHandler } from '../utils/asyncHandler';
import { validateBody } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { refreshSchema } from '../utils/validation';

const router = Router();

/**
 * GET /api/auth/google
 * Initiate Google OAuth login
 */
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    })
);

/**
 * GET /api/auth/google/callback
 * Google OAuth callback
 */
router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    asyncHandler(async (req, res) => {
        const user = req.user as any;

        // Generate JWT tokens
        const accessToken = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_REFRESH_SECRET!,
            { expiresIn: '7d' }
        );

        // Redirect to frontend with tokens
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        res.redirect(`${frontendUrl}/auth/callback?access_token=${accessToken}&refresh_token=${refreshToken}`);
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
