import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, generateSecureToken, rateLimit, getClientIdentifier } from '@/lib/security';
import { createLoginRequest } from '@/lib/db';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

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

        // Clear failed attempts on successful password check
        loginAttempts.delete(clientId);

        // --- NEW: 2-Step Verification (OTP) ---
        const requestId = crypto.randomUUID();
        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Save request to DB
        await createLoginRequest({
            id: requestId,
            email: 'admin@system',
            code: code,
            status: 'pending',
            createdAt: new Date().toISOString(),
            expiresAt: Date.now() + 10 * 60 * 1000, // 10 mins
            ip: clientId,
            attempts: 0
        });

        // Send Email (Mock/Real)
        console.log('\n\n==================================================');
        console.log('🔐 ADMIN LOGIN OTP 🔐');
        console.log(`Verification Code: ${code}`);
        console.log('Emails sent to: arshekhjohn7@gmail.com, cyberthoughts421@gmail.com');
        console.log('==================================================\n\n');

        // Try to send real email if credentials exist
        try {
            if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });

                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: 'arshekhjohn7@gmail.com, cyberthoughts421@gmail.com',
                    subject: '🔐 Admin Verification Code - Broast N Bakes',
                    html: `
                        <div style="font-family: sans-serif; padding: 20px;">
                            <h2>Admin Login Verification</h2>
                            <p>Use the following code to complete your login:</p>
                            <h1 style="background: #f4f4f4; padding: 10px 20px; display: inline-block; letter-spacing: 5px; border-radius: 8px;">${code}</h1>
                            <p><strong>IP:</strong> ${clientId}</p>
                            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                            <p style="color: #666; font-size: 0.9em;">This code expires in 10 minutes.</p>
                        </div>
                    `
                });
            }
        } catch (e) {
            console.error('Failed to send email:', e);
        }

        return NextResponse.json({
            success: true,
            requireVerification: true,
            requestId: requestId
        });

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
