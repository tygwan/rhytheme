import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { asyncHandler } from './utils/asyncHandler';
import authRoutes from './routes/auth';
import sessionRoutes from './routes/session';
import trackRoutes from './routes/track';
import { TurnQueueService } from './services/turnQueueService';

// Load environment variables
dotenv.config();

// Initialize Prisma and Redis
const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
});

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    },
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api', limiter);

// Health Check - Enhanced with DB and Redis status
app.get('/api/health', asyncHandler(async (req, res) => {
    const startTime = Date.now();
    const checks: Record<string, { status: string; latency?: number; error?: string }> = {};

    // Check PostgreSQL
    try {
        const dbStart = Date.now();
        await prisma.$queryRaw`SELECT 1`;
        checks.database = { status: 'healthy', latency: Date.now() - dbStart };
    } catch (error) {
        checks.database = { status: 'unhealthy', error: (error as Error).message };
    }

    // Check Redis
    try {
        const redisStart = Date.now();
        await redis.ping();
        checks.redis = { status: 'healthy', latency: Date.now() - redisStart };
    } catch (error) {
        checks.redis = { status: 'unhealthy', error: (error as Error).message };
    }

    // Overall status
    const isHealthy = Object.values(checks).every(c => c.status === 'healthy');

    res.status(isHealthy ? 200 : 503).json({
        success: true,
        status: isHealthy ? 'healthy' : 'degraded',
        message: 'Rhythme API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        responseTime: Date.now() - startTime,
        checks,
        environment: process.env.NODE_ENV || 'development',
    });
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/tracks', trackRoutes);

// Initialize Turn Queue Service
const turnQueueService = new TurnQueueService(redis);

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('disconnect', async () => {
        console.log(`Client disconnected: ${socket.id}`);
        // Note: We don't have a way to track which sessions this socket was in
        // In a production app, we'd maintain a socket->sessions mapping
        // For now, this will be handled by explicit leave-session events
    });

    socket.on('join-session', async (sessionId) => {
        socket.join(sessionId);
        console.log(`Socket ${socket.id} joined session: ${sessionId}`);

        // Get or initialize session state
        let state = await turnQueueService.getSessionState(sessionId);
        if (!state) {
            state = await turnQueueService.initializeSession(sessionId);
        }

        // Send current state to new user
        socket.emit('beat-update', state.beatData);
        socket.emit('queue-update', {
            queue: state.queue,
            currentTurn: state.currentTurn
        });
    });

    socket.on('join-queue', async ({ sessionId, name, avatar }) => {
        const state = await turnQueueService.joinQueue(sessionId, {
            id: socket.id,
            name,
            avatar
        });

        io.to(sessionId).emit('queue-update', {
            queue: state.queue,
            currentTurn: state.currentTurn
        });
    });

    socket.on('finish-turn', async (sessionId) => {
        const state = await turnQueueService.finishTurn(sessionId, socket.id);
        if (!state) return;

        io.to(sessionId).emit('queue-update', {
            queue: state.queue,
            currentTurn: state.currentTurn
        });

        // Persist beat data to database
        try {
            await prisma.session.update({
                where: { id: sessionId },
                data: { beatData: state.beatData }
            });
        } catch (error) {
            console.error('Failed to persist beat data:', error);
        }
    });

    socket.on('leave-session', async (sessionId) => {
        socket.leave(sessionId);
        console.log(`Socket ${socket.id} left session: ${sessionId}`);

        const state = await turnQueueService.leaveQueue(sessionId, socket.id);
        if (state) {
            io.to(sessionId).emit('queue-update', {
                queue: state.queue,
                currentTurn: state.currentTurn
            });
        }
    });

    socket.on('beat-update', async ({ sessionId, grid }) => {
        // Update beat data with turn validation
        const result = await turnQueueService.updateBeatData(
            sessionId,
            socket.id,
            grid
        );

        if (!result.success) {
            console.log(`Rejected beat update from ${socket.id} - not their turn`);
            return;
        }

        // Broadcast to everyone else in the room
        socket.to(sessionId).emit('beat-update', grid);
        console.log(`Beat updated in session ${sessionId} by ${socket.id}`);
    });
});

// Turn timeout checker - runs every 5 seconds
setInterval(async () => {
    // Get all active sessions from Redis
    // For simplicity, we'll check sessions that have been accessed
    // In production, maintain a list of active session IDs
}, 5000);

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Graceful shutdown
const shutdown = async () => {
    console.log('Shutting down gracefully...');
    await prisma.$disconnect();
    redis.disconnect();
    process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start server
httpServer.listen(PORT, () => {
    console.log(`🚀 Rhythme server is running on port ${PORT}`);
    console.log(`📡 WebSocket server is ready`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export { app, io, prisma, redis };
