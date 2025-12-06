import { Router } from 'express';
import { trackService } from '../services/trackService';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createTrackSchema, updateTrackSchema } from '../utils/validation';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

/**
 * POST /api/tracks
 * Create a new track
 * @auth required
 */
router.post(
    '/',
    authenticate,
    validate(createTrackSchema),
    asyncHandler(async (req, res) => {
        const track = await trackService.createTrack(req.body, req.user!.userId);

        res.status(201).json({
            success: true,
            data: track,
        });
    })
);

/**
 * GET /api/tracks
 * Get all tracks with optional filters
 * @auth optional
 */
router.get(
    '/',
    asyncHandler(async (req, res) => {
        const { sessionId, creatorId, isPublic, limit, offset, orderBy } = req.query;

        const filters = {
            sessionId: sessionId as string,
            creatorId: creatorId as string,
            isPublic: isPublic === 'true' ? true : isPublic === 'false' ? false : undefined,
            limit: limit ? parseInt(limit as string) : undefined,
            offset: offset ? parseInt(offset as string) : undefined,
            orderBy: (orderBy as 'createdAt' | 'likes' | 'plays') || 'createdAt',
        };

        const tracks = await trackService.getAllTracks(filters);

        res.json({
            success: true,
            data: tracks,
        });
    })
);

/**
 * GET /api/tracks/:id
 * Get track by ID
 * @auth optional
 */
router.get(
    '/:id',
    asyncHandler(async (req, res) => {
        const userId = req.headers.authorization ? req.user?.userId : undefined;
        const track = await trackService.getTrackById(req.params.id, userId);

        res.json({
            success: true,
            data: track,
        });
    })
);

/**
 * PUT /api/tracks/:id
 * Update track
 * @auth required
 */
router.put(
    '/:id',
    authenticate,
    validate(updateTrackSchema),
    asyncHandler(async (req, res) => {
        const track = await trackService.updateTrack(req.params.id, req.body, req.user!.userId);

        res.json({
            success: true,
            data: track,
        });
    })
);

/**
 * DELETE /api/tracks/:id
 * Delete track
 * @auth required
 */
router.delete(
    '/:id',
    authenticate,
    asyncHandler(async (req, res) => {
        await trackService.deleteTrack(req.params.id, req.user!.userId);

        res.json({
            success: true,
            message: 'Track deleted successfully',
        });
    })
);

/**
 * POST /api/tracks/:id/play
 * Increment play count
 * @auth not required
 */
router.post(
    '/:id/play',
    asyncHandler(async (req, res) => {
        const track = await trackService.incrementPlays(req.params.id);

        res.json({
            success: true,
            data: track,
        });
    })
);

/**
 * POST /api/tracks/:id/like
 * Increment like count
 * @auth not required
 */
router.post(
    '/:id/like',
    asyncHandler(async (req, res) => {
        const track = await trackService.incrementLikes(req.params.id);

        res.json({
            success: true,
            data: track,
        });
    })
);

export default router;
