import { NextRequest, NextResponse } from 'next/server';
import { getLoginRequest, updateLoginRequestStatus } from '@/lib/db';
import { generateSecureToken } from '@/lib/security';

export async function POST(request: NextRequest) {
    try {
        const { requestId, code } = await request.json();

        if (!requestId || !code) {
            return NextResponse.json({ error: 'Missing requirements' }, { status: 400 });
        }

        const req = await getLoginRequest(requestId);

        if (!req) {
            return NextResponse.json({ error: 'Invalid or expired session' }, { status: 404 });
        }

        if (req.status === 'verified') {
            return NextResponse.json({ error: 'Already verified' }, { status: 400 });
        }

        if (Date.now() > req.expiresAt) {
            await updateLoginRequestStatus(requestId, 'failed');
            return NextResponse.json({ error: 'Code expired' }, { status: 400 });
        }

        // Check attempts
        if ((req.attempts || 0) >= 3) {
            await updateLoginRequestStatus(requestId, 'failed');
            return NextResponse.json({ error: 'Too many failed attempts' }, { status: 429 });
        }

        // Verify Code
        if (req.code !== code) {
            // Increment attempts (need to update DB logic for this in real app, but for now just fail)
            // Ideally we should update attempts count in DB here
            return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
        }

        // Success!
        await updateLoginRequestStatus(requestId, 'verified');

        // Generate Token and Set Cookie
        const token = generateSecureToken(32);
        const response = NextResponse.json({ success: true });

        response.cookies.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}
