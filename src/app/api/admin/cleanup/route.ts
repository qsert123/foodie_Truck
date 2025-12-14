import { NextRequest, NextResponse } from 'next/server';
import { cleanOldOrders } from '@/lib/db';
import { createSecureResponse } from '@/lib/security';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => ({})); // Handle empty body
        const days = body.days !== undefined ? Number(body.days) : 7; // Default to 7 days

        const deletedCount = await cleanOldOrders(days);
        return createSecureResponse({ success: true, deletedCount });
    } catch (error) {
        console.error('Cleanup error:', error);
        return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 });
    }
}
