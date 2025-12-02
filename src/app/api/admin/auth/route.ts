import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, generateSecureToken, rateLimit, getClientIdentifier } from '@/lib/security';

// IMPORTANT: Change this password in production!
// Generate hash: await hashPassword('your-secure-password')
const ADMIN_PASSWORD_HASH = '7042907cc0b44a00091526cc99ab14cf4b190ce4c4ac011004de6ca7100786f5'; // 'foodie'

// Store for rate limiting (use Redis in production)
const loginAttempts = new Map<string, { count: number; resetTime: number }>();

export async function POST(request: NextRequest) {
    try {
        const clientId = getClientIdentifier(request);

        // Rate limiting: max 5 attempts per 15 minutes
        const now = Date.now();
        const attempts = loginAttempts.get(clientId);

        if (attempts && now < attempts.resetTime) {
            if (attempts.count >= 5) {
                return NextResponse.json(
                    { error: 'Too many login attempts. Please try again later.' },
                    { status: 429 }
                );
            }
        } else {
            // Reset if window expired
            loginAttempts.set(clientId, { count: 0, resetTime: now + 15 * 60 * 1000 });
        }

        const { password } = await request.json();

        if (!password || typeof password !== 'string') {
            return NextResponse.json(
                { error: 'Invalid request' },
                { status: 400 }
            );
        }

        // Hash the provided password
        const hashedPassword = await hashPassword(password);

        // Compare hashes
        if (hashedPassword !== ADMIN_PASSWORD_HASH) {
            // Increment failed attempts
            const current = loginAttempts.get(clientId) || { count: 0, resetTime: now + 15 * 60 * 1000 };
            current.count++;
            loginAttempts.set(clientId, current);

            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Clear failed attempts on successful login
        loginAttempts.delete(clientId);

        // Generate secure session token
        const token = generateSecureToken(32);

        // Create response with secure cookie
        const response = NextResponse.json({ success: true });

        // Set httpOnly, secure cookie
        response.cookies.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
}

// Logout endpoint
export async function DELETE(request: NextRequest) {
    const response = NextResponse.json({ success: true });
    response.cookies.delete('admin_token');
    return response;
}
