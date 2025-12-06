import { PrismaClient } from '@prisma/client';
import { CreateSessionInput, UpdateSessionInput } from '../utils/validation';
import { NotFoundError, ValidationError, AuthError } from '../utils/errors';

const prisma = new PrismaClient();

interface SessionWithDetails {
    id: string;
    title: string;
    maxUsers: number;
    isActive: boolean;
    isPublic: boolean;
    creatorId: string;
    beatData: any;
    participants: string[];
    createdAt: Date;
    updatedAt: Date;
    creator: {
        id: string;
        username: string;
    };
    _count?: {
        tracks: number;
    };
}

export class SessionService {
    /**
     * Create a new session
     */
    async createSession(data: CreateSessionInput, userId: string): Promise<SessionWithDetails> {
        const session = await prisma.session.create({
            data: {
                title: data.title,
                maxUsers: data.maxUsers ?? 8,
                isPublic: data.isPublic ?? true,
                creatorId: userId,
                beatData: {},
                participants: [userId],
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
                _count: {
                    select: {
                        tracks: true,
                    },
                },
            },
        });

        return session;
    }

    /**
     * Get session by ID
     */
    async getSessionById(sessionId: string, userId?: string): Promise<SessionWithDetails> {
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
            include: {
                creator: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
                _count: {
                    select: {
                        tracks: true,
                    },
                },
            },
        });

        if (!session) {
            throw new NotFoundError('Session not found');
        }

        // Check if user has access to private session
        if (!session.isPublic && userId !== session.creatorId && !session.participants.includes(userId || '')) {
            throw new AuthError('Access denied to private session');
        }

        return session;
    }

    /**
     * Get all sessions (public or user's sessions)
     */
    async getAllSessions(userId?: string, filters?: {
        isPublic?: boolean;
        isActive?: boolean;
        limit?: number;
        offset?: number;
    }): Promise<SessionWithDetails[]> {
        const where: any = {};

        if (filters?.isPublic !== undefined) {
            where.isPublic = filters.isPublic;
        }

        if (filters?.isActive !== undefined) {
            where.isActive = filters.isActive;
        }

        // If user is authenticated, include their sessions
        if (userId && !where.isPublic) {
            where.OR = [
                { isPublic: true },
                { creatorId: userId },
                { participants: { has: userId } },
            ];
        }

        const sessions = await prisma.session.findMany({
            where,
            include: {
                creator: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
                _count: {
                    select: {
                        tracks: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: filters?.limit ?? 20,
            skip: filters?.offset ?? 0,
        });

        return sessions;
    }

    /**
     * Update session
     */
    async updateSession(sessionId: string, data: UpdateSessionInput, userId: string): Promise<SessionWithDetails> {
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
        });

        if (!session) {
            throw new NotFoundError('Session not found');
        }

        if (session.creatorId !== userId) {
            throw new AuthError('Only the creator can update the session');
        }

        const updatedSession = await prisma.session.update({
            where: { id: sessionId },
            data,
            include: {
                creator: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
                _count: {
                    select: {
                        tracks: true,
                    },
                },
            },
        });

        return updatedSession;
    }

    /**
     * Delete session
     */
    async deleteSession(sessionId: string, userId: string): Promise<void> {
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
        });

        if (!session) {
            throw new NotFoundError('Session not found');
        }

        if (session.creatorId !== userId) {
            throw new AuthError('Only the creator can delete the session');
        }

        await prisma.session.delete({
            where: { id: sessionId },
        });
    }

    /**
     * Join session
     */
    async joinSession(sessionId: string, userId: string): Promise<SessionWithDetails> {
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
        });

        if (!session) {
            throw new NotFoundError('Session not found');
        }

        if (!session.isActive) {
            throw new ValidationError('Session is not active');
        }

        if (session.participants.includes(userId)) {
            throw new ValidationError('User already in session');
        }

        if (session.participants.length >= session.maxUsers) {
            throw new ValidationError('Session is full');
        }

        const updatedSession = await prisma.session.update({
            where: { id: sessionId },
            data: {
                participants: {
                    push: userId,
                },
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
                _count: {
                    select: {
                        tracks: true,
                    },
                },
            },
        });

        return updatedSession;
    }

    /**
     * Leave session
     */
    async leaveSession(sessionId: string, userId: string): Promise<SessionWithDetails> {
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
        });

        if (!session) {
            throw new NotFoundError('Session not found');
        }

        if (!session.participants.includes(userId)) {
            throw new ValidationError('User not in session');
        }

        if (session.creatorId === userId) {
            throw new ValidationError('Creator cannot leave session, delete instead');
        }

        const updatedSession = await prisma.session.update({
            where: { id: sessionId },
            data: {
                participants: {
                    set: session.participants.filter(p => p !== userId),
                },
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
                _count: {
                    select: {
                        tracks: true,
                    },
                },
            },
        });

        return updatedSession;
    }

    /**
     * Update session beat data
     */
    async updateBeatData(sessionId: string, beatData: any, userId: string): Promise<SessionWithDetails> {
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
        });

        if (!session) {
            throw new NotFoundError('Session not found');
        }

        if (!session.participants.includes(userId)) {
            throw new AuthError('User not in session');
        }

        const updatedSession = await prisma.session.update({
            where: { id: sessionId },
            data: {
                beatData,
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
                _count: {
                    select: {
                        tracks: true,
                    },
                },
            },
        });

        return updatedSession;
    }
}

export const sessionService = new SessionService();
