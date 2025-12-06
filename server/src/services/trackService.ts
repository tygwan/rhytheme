import { PrismaClient } from '@prisma/client';
import { CreateTrackInput, UpdateTrackInput } from '../utils/validation';
import { NotFoundError, AuthError, ValidationError } from '../utils/errors';

const prisma = new PrismaClient();

interface TrackWithDetails {
    id: string;
    title: string;
    description: string | null;
    sessionId: string;
    audioUrl: string | null;
    beatData: any;
    creatorId: string;
    likes: number;
    plays: number;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
    creator: {
        id: string;
        username: string;
    };
    session: {
        id: string;
        title: string;
    };
}

export class TrackService {
    /**
     * Create a new track
     */
    async createTrack(data: CreateTrackInput, userId: string): Promise<TrackWithDetails> {
        // Verify session exists and user has access
        const session = await prisma.session.findUnique({
            where: { id: data.sessionId },
        });

        if (!session) {
            throw new NotFoundError('Session not found');
        }

        if (!session.participants.includes(userId)) {
            throw new ValidationError('User must be a participant in the session to create a track');
        }

        const track = await prisma.track.create({
            data: {
                title: data.title,
                description: data.description,
                sessionId: data.sessionId,
                beatData: data.beatData,
                creatorId: userId,
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
                session: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });

        return track;
    }

    /**
     * Get track by ID
     */
    async getTrackById(trackId: string, userId?: string): Promise<TrackWithDetails> {
        const track = await prisma.track.findUnique({
            where: { id: trackId },
            include: {
                creator: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
                session: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });

        if (!track) {
            throw new NotFoundError('Track not found');
        }

        // Check access for private tracks
        if (!track.isPublic && userId !== track.creatorId) {
            throw new AuthError('Access denied to private track');
        }

        return track;
    }

    /**
     * Get all tracks with filters
     */
    async getAllTracks(filters?: {
        sessionId?: string;
        creatorId?: string;
        isPublic?: boolean;
        limit?: number;
        offset?: number;
        orderBy?: 'createdAt' | 'likes' | 'plays';
    }): Promise<TrackWithDetails[]> {
        const where: any = {};

        if (filters?.sessionId) {
            where.sessionId = filters.sessionId;
        }

        if (filters?.creatorId) {
            where.creatorId = filters.creatorId;
        }

        if (filters?.isPublic !== undefined) {
            where.isPublic = filters.isPublic;
        }

        const orderBy: any = {};
        if (filters?.orderBy === 'likes') {
            orderBy.likes = 'desc';
        } else if (filters?.orderBy === 'plays') {
            orderBy.plays = 'desc';
        } else {
            orderBy.createdAt = 'desc';
        }

        const tracks = await prisma.track.findMany({
            where,
            include: {
                creator: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
                session: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
            orderBy,
            take: filters?.limit ?? 20,
            skip: filters?.offset ?? 0,
        });

        return tracks;
    }

    /**
     * Update track
     */
    async updateTrack(trackId: string, data: UpdateTrackInput, userId: string): Promise<TrackWithDetails> {
        const track = await prisma.track.findUnique({
            where: { id: trackId },
        });

        if (!track) {
            throw new NotFoundError('Track not found');
        }

        if (track.creatorId !== userId) {
            throw new AuthError('Only the creator can update the track');
        }

        const updatedTrack = await prisma.track.update({
            where: { id: trackId },
            data,
            include: {
                creator: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
                session: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });

        return updatedTrack;
    }

    /**
     * Delete track
     */
    async deleteTrack(trackId: string, userId: string): Promise<void> {
        const track = await prisma.track.findUnique({
            where: { id: trackId },
        });

        if (!track) {
            throw new NotFoundError('Track not found');
        }

        if (track.creatorId !== userId) {
            throw new AuthError('Only the creator can delete the track');
        }

        await prisma.track.delete({
            where: { id: trackId },
        });
    }

    /**
     * Increment play count
     */
    async incrementPlays(trackId: string): Promise<TrackWithDetails> {
        const track = await prisma.track.findUnique({
            where: { id: trackId },
        });

        if (!track) {
            throw new NotFoundError('Track not found');
        }

        const updatedTrack = await prisma.track.update({
            where: { id: trackId },
            data: {
                plays: {
                    increment: 1,
                },
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
                session: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });

        return updatedTrack;
    }

    /**
     * Increment like count
     */
    async incrementLikes(trackId: string): Promise<TrackWithDetails> {
        const track = await prisma.track.findUnique({
            where: { id: trackId },
        });

        if (!track) {
            throw new NotFoundError('Track not found');
        }

        const updatedTrack = await prisma.track.update({
            where: { id: trackId },
            data: {
                likes: {
                    increment: 1,
                },
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
                session: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });

        return updatedTrack;
    }
}

export const trackService = new TrackService();
