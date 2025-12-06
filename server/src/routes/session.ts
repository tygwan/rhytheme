import { Router } from 'express';
import { sessionService } from '../services/sessionService';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createSessionSchema, updateSessionSchema } from '../utils/validation';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

/**
 * POST /api/sessions
 * Create a new session
 * @auth required
 */
router.post(
    '/',
    authenticate,
    validate(createSessionSchema),
    asyncHandler(async (req, res) => {
        const session = await sessionService.createSession(req.body, req.user!.userId);

        res.status(201).json({
            success: true,
            data: session,
        });
    })
);

/**
 * GET /api/sessions
 * Get all sessions
 * @auth optional
 */
router.get(
    '/',
    asyncHandler(async (req, res) => {
        const userId = req.headers.authorization ? req.user?.userId : undefined;
        const { isPublic, isActive, limit, offset } = req.query;

        const filters = {
            isPublic: isPublic === 'true' ? true : isPublic === 'false' ? false : undefined,
            isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
            limit: limit ? parseInt(limit as string) : undefined,
            offset: offset ? parseInt(offset as string) : undefined,
        };

        const sessions = await sessionService.getAllSessions(userId, filters);

        res.json({
            success: true,
            data: sessions,
        });
    })
);

/**
 * GET /api/sessions/:id
 * Get session by ID
 * @auth optional
 */
router.get(
    '/:id',
    asyncHandler(async (req, res) => {
        const userId = req.headers.authorization ? req.user?.userId : undefined;
        const session = await sessionService.getSessionById(req.params.id, userId);

        res.json({
            success: true,
            data: session,
        });
    })
);

/**
 * PUT /api/sessions/:id
 * Update session
 * @auth required
 */
router.put(
    '/:id',
    authenticate,
    validate(updateSessionSchema),
    asyncHandler(async (req, res) => {
        const session = await sessionService.updateSession(
            req.params.id,
            req.body,
            req.user!.userId
        );

        res.json({
            success: true,
            data: session,
        });
    })
);

/**
 * DELETE /api/sessions/:id
 * Delete session
 * @auth required
 */
router.delete(
    '/:id',
    authenticate,
    asyncHandler(async (req, res) => {
        await sessionService.deleteSession(req.params.id, req.user!.userId);

        res.json({
            success: true,
            message: 'Session deleted successfully',
        });
    })
);

/**
 * POST /api/sessions/:id/join
 * Join session
 * @auth required
 */
router.post(
    '/:id/join',
    authenticate,
    asyncHandler(async (req, res) => {
        const session = await sessionService.joinSession(req.params.id, req.user!.userId);

        res.json({
            success: true,
            data: session,
        });
    })
);

/**
 * POST /api/sessions/:id/leave
 * Leave session
 * @auth required
 */
router.post(
    '/:id/leave',
    authenticate,
    asyncHandler(async (req, res) => {
        const session = await sessionService.leaveSession(req.params.id, req.user!.userId);

        res.json({
            success: true,
            data: session,
        });
    })
);

/**
 * PUT /api/sessions/:id/beat-data
 * Update session beat data
 * @auth required
 */
router.put(
    '/:id/beat-data',
    authenticate,
    asyncHandler(async (req, res) => {
        const session = await sessionService.updateBeatData(
            req.params.id,
            req.body.beatData,
            req.user!.userId
        );

        res.json({
            success: true,
            data: session,
        });
    })
);

export default router;
