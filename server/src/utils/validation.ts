import { z } from 'zod';

// User Registration Schema
export const registerSchema = z.object({
    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be at most 20 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: z.string()
        .email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});

// User Login Schema
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

// Token Refresh Schema
export const refreshSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
});

// Session Creation Schema
export const createSessionSchema = z.object({
    title: z.string()
        .min(1, 'Title is required')
        .max(100, 'Title must be at most 100 characters'),
    maxUsers: z.number().int().min(2).max(8).optional().default(8),
    isPublic: z.boolean().optional().default(true),
});

// Track Creation Schema
export const createTrackSchema = z.object({
    title: z.string()
        .min(1, 'Title is required')
        .max(100, 'Title must be at most 100 characters'),
    description: z.string().max(500).optional(),
    sessionId: z.string().uuid('Invalid session ID'),
    beatData: z.array(z.array(z.boolean())),
});

// Session Update Schema
export const updateSessionSchema = z.object({
    title: z.string().min(1).max(100).optional(),
    maxUsers: z.number().int().min(2).max(8).optional(),
    isPublic: z.boolean().optional(),
    isActive: z.boolean().optional(),
});

// Track Update Schema
export const updateTrackSchema = z.object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    beatData: z.array(z.array(z.boolean())).optional(),
    isPublic: z.boolean().optional(),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type CreateTrackInput = z.infer<typeof createTrackSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
export type UpdateTrackInput = z.infer<typeof updateTrackSchema>;
