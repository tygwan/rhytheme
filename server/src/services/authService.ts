import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { RegisterInput, LoginInput } from '../utils/validation';
import { AuthError, ConflictError, ValidationError } from '../utils/errors';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const SALT_ROUNDS = 12;

export interface TokenPayload {
    userId: string;
    email: string;
}

interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

interface UserResponse {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
}

export class AuthService {
    /**
     * Register a new user
     */
    async register(input: RegisterInput): Promise<{ user: UserResponse; tokens: AuthTokens }> {
        const { username, email, password } = input;

        // Check if email already exists
        const existingEmail = await prisma.user.findUnique({ where: { email } });
        if (existingEmail) {
            throw new ConflictError('Email already registered');
        }

        // Check if username already exists
        const existingUsername = await prisma.user.findUnique({ where: { username } });
        if (existingUsername) {
            throw new ConflictError('Username already taken');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Create user
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
            },
        });

        // Generate tokens
        const tokens = this.generateTokens({ userId: user.id, email: user.email });

        return { user, tokens };
    }

    /**
     * Login user
     */
    async login(input: LoginInput): Promise<{ user: UserResponse; tokens: AuthTokens }> {
        const { email, password } = input;

        // Find user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) {
            throw new AuthError('Invalid email or password');
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new AuthError('Invalid email or password');
        }

        // Generate tokens
        const tokens = this.generateTokens({ userId: user.id, email: user.email });

        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
            },
            tokens,
        };
    }

    /**
     * Refresh access token
     */
    async refreshToken(refreshToken: string): Promise<AuthTokens> {
        try {
            const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as TokenPayload;
            
            // Verify user still exists
            const user = await prisma.user.findUnique({ where: { id: payload.userId } });
            if (!user) {
                throw new AuthError('User not found');
            }

            // Generate new tokens
            return this.generateTokens({ userId: user.id, email: user.email });
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new AuthError('Refresh token expired');
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new AuthError('Invalid refresh token');
            }
            throw error;
        }
    }

    /**
     * Verify access token
     */
    verifyAccessToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, JWT_SECRET) as TokenPayload;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new AuthError('Access token expired');
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new AuthError('Invalid access token');
            }
            throw error;
        }
    }

    /**
     * Get user by ID
     */
    async getUserById(userId: string): Promise<UserResponse | null> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
            },
        });
        return user;
    }

    /**
     * Generate access and refresh tokens
     */
    private generateTokens(payload: TokenPayload): AuthTokens {
        const accessToken = jwt.sign(payload, JWT_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRY,
        });

        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
            expiresIn: REFRESH_TOKEN_EXPIRY,
        });

        return { accessToken, refreshToken };
    }
}

export const authService = new AuthService();
