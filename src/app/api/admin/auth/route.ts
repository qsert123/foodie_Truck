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

        // --- NEW: 2-Step Verification ---
        const requestId = crypto.randomUUID();
        const approvalToken = crypto.randomUUID();

        // Save request to DB
        await createLoginRequest({
            id: requestId,
            email: 'admin@system', // Placeholder or use env email
            token: approvalToken,
            status: 'pending',
            createdAt: new Date().toISOString(),
            expiresAt: Date.now() + 10 * 60 * 1000, // 10 mins
            ip: clientId
        });

        // Generate Approval Link
        const host = request.headers.get('host') || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        const approvalLink = `${protocol}://${host}/api/admin/approve?id=${requestId}&token=${approvalToken}`;

        // Send Email (Mock/Real)
        console.log('\n\n==================================================');
        console.log('🚨 ADMIN LOGIN APPROVAL REQUIRED 🚨');
        console.log(`Click here to approve: ${approvalLink}`);
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
                    subject: '🚨 Admin Login Approval Required - Broast N Bakes',
                    html: `
                        <h2>Admin Login Attempt</h2>
                        <p>Someone is trying to log in to the admin dashboard.</p>
                        <p><strong>IP:</strong> ${clientId}</p>
                        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                        <br/>
                        <a href="${approvalLink}" style="background: #C6E900; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Approve Login</a>
                        <br/><br/>
                        <p>If this wasn't you, ignore this email.</p>
                    `
                });
            }
        } catch (e) {
            console.error('Failed to send email:', e);
        }

        return NextResponse.json({
            success: true,
            requireApproval: true,
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
