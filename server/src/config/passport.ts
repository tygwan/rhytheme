import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function configurePassport() {
    // Serialize user for session
    passport.serializeUser((user: any, done) => {
        done(null, user.id);
    });

    // Deserialize user from session
    passport.deserializeUser(async (id: string, done) => {
        try {
            const user = await prisma.user.findUnique({ where: { id } });
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });

    // Google OAuth Strategy
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
                callbackURL: process.env.GOOGLE_CALLBACK_URL!,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // Check if user already exists
                    let user = await prisma.user.findUnique({
                        where: { googleId: profile.id },
                    });

                    if (!user) {
                        // Check if email already exists
                        const existingEmailUser = await prisma.user.findUnique({
                            where: { email: profile.emails?.[0]?.value },
                        });

                        if (existingEmailUser) {
                            // Update existing user with Google ID
                            user = await prisma.user.update({
                                where: { id: existingEmailUser.id },
                                data: {
                                    googleId: profile.id,
                                    avatar: profile.photos?.[0]?.value,
                                },
                            });
                        } else {
                            // Create new user
                            user = await prisma.user.create({
                                data: {
                                    googleId: profile.id,
                                    email: profile.emails?.[0]?.value || '',
                                    username: profile.displayName || profile.emails?.[0]?.value || '',
                                    avatar: profile.photos?.[0]?.value,
                                    password: null, // No password for OAuth users
                                },
                            });
                        }
                    }

                    return done(null, user);
                } catch (error) {
                    return done(error as Error, undefined);
                }
            }
        )
    );
}
