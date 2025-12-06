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

// Auth routes
app.use('/api/auth', authRoutes);

// In-memory storage for session state (replace with Redis later)
interface SessionState {
    beats: boolean[][];
    queue: { id: string; name: string; avatar: string }[];
    currentTurn: string | null; // socket.id
    turnStartTime: number | null;
}

const sessions: Record<string, SessionState> = {};

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        // Handle disconnect cleanup (remove from queues, etc.)
        // For simplicity, we'll iterate all sessions (optimize with Redis later)
        Object.keys(sessions).forEach(sessionId => {
            const session = sessions[sessionId];
            const queueIndex = session.queue.findIndex(u => u.id === socket.id);

            if (queueIndex !== -1) {
                session.queue.splice(queueIndex, 1);
                io.to(sessionId).emit('queue-update', {
                    queue: session.queue,
                    currentTurn: session.currentTurn
                });
            }

            if (session.currentTurn === socket.id) {
                // Pass turn to next person if current user disconnects
                const nextUser = session.queue[0];
                if (nextUser) {
                    session.currentTurn = nextUser.id;
                    session.turnStartTime = Date.now();
                } else {
                    session.currentTurn = null;
                    session.turnStartTime = null;
                }
                io.to(sessionId).emit('queue-update', {
                    queue: session.queue,
                    currentTurn: session.currentTurn
                });
            }
        });
    });

    socket.on('join-session', (sessionId) => {
        socket.join(sessionId);
        console.log(`Socket ${socket.id} joined session: ${sessionId}`);

        // Initialize session if not exists
        if (!sessions[sessionId]) {
            sessions[sessionId] = {
                beats: Array(8).fill(null).map(() => Array(16).fill(false)),
                queue: [],
                currentTurn: null,
                turnStartTime: null
            };
        }

        // Send current state to new user
        socket.emit('beat-update', sessions[sessionId].beats);
        socket.emit('queue-update', {
            queue: sessions[sessionId].queue,
            currentTurn: sessions[sessionId].currentTurn
        });
    });

    socket.on('join-queue', ({ sessionId, name, avatar }) => {
        const session = sessions[sessionId];
        if (!session) return;

        // Check if already in queue
        if (session.queue.find(u => u.id === socket.id)) return;

        const newUser = { id: socket.id, name, avatar };
        session.queue.push(newUser);

        // If no one has turn, give it to this user immediately
        if (!session.currentTurn) {
            session.currentTurn = socket.id;
            session.turnStartTime = Date.now();
        }

        io.to(sessionId).emit('queue-update', {
            queue: session.queue,
            currentTurn: session.currentTurn
        });
    });

    socket.on('finish-turn', (sessionId) => {
        const session = sessions[sessionId];
        if (!session || session.currentTurn !== socket.id) return;

        // Move current user to end of queue or remove? 
        // Let's implement "Round Robin" - move to back
        const currentUser = session.queue.find(u => u.id === socket.id);
        if (currentUser) {
            // Remove from front (or wherever they are)
            session.queue = session.queue.filter(u => u.id !== socket.id);
            // Add to back
            session.queue.push(currentUser);
        }

        // Give turn to next person (who is now at index 0)
        const nextUser = session.queue[0];
        if (nextUser) {
            session.currentTurn = nextUser.id;
            session.turnStartTime = Date.now();
        }

        io.to(sessionId).emit('queue-update', {
            queue: session.queue,
            currentTurn: session.currentTurn
        });
    });

    socket.on('leave-session', (sessionId) => {
        socket.leave(sessionId);
        console.log(`Socket ${socket.id} left session: ${sessionId}`);
    });

    socket.on('beat-update', ({ sessionId, grid }) => {
        if (!sessions[sessionId]) return;

        // Update server state
        sessions[sessionId].beats = grid;

        // Broadcast to everyone else in the room
        socket.to(sessionId).emit('beat-update', grid);
        console.log(`Beat updated in session ${sessionId} by ${socket.id}`);
    });
});

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
