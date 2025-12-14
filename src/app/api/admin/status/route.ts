import { NextRequest, NextResponse } from 'next/server';
import { getLoginRequest, updateLoginRequestStatus } from '@/lib/db';
import { generateSecureToken } from '@/lib/security';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const req = await getLoginRequest(id);

    if (!req) return NextResponse.json({ status: 'not_found' });

    if (req.status === 'approved') {
        // Mark as used so it can't be reused infinitely (optional, but good practice)
        await updateLoginRequestStatus(id, 'used');

        // Generate Token and Set Cookie
        const token = generateSecureToken(32);
        const response = NextResponse.json({ status: 'approved', success: true });

        response.cookies.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
        });

        return response;
    }

    if (req.status === 'rejected') {
        return NextResponse.json({ status: 'rejected' });
    }

    // Still pending
    return NextResponse.json({ status: 'pending' });
}
