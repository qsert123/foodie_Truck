import { NextRequest, NextResponse } from 'next/server';
import { getLoginRequest, updateLoginRequestStatus } from '@/lib/db';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const token = searchParams.get('token');

    if (!id || !token) {
        return new NextResponse('Invalid Link', { status: 400 });
    }

    const req = await getLoginRequest(id);

    if (!req) {
        return new NextResponse('Request not found or expired', { status: 404 });
    }

    if (req.token !== token) {
        return new NextResponse('Invalid Token', { status: 403 });
    }

    if (req.status !== 'pending') {
        return new NextResponse(`Link already used (Status: ${req.status})`, { status: 400 });
    }

    if (Date.now() > req.expiresAt) {
        await updateLoginRequestStatus(id, 'rejected');
        return new NextResponse('Link Expired', { status: 400 });
    }

    // Approve it
    await updateLoginRequestStatus(id, 'approved');

    return new NextResponse(`
        <html>
            <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                <h1 style="color: green;">✅ Login Approved</h1>
                <p>The admin dashboard will open automatically in the other tab.</p>
                <p>You can close this window.</p>
            </body>
        </html>
    `, { headers: { 'Content-Type': 'text/html' } });
}
