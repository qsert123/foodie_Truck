import { NextRequest, NextResponse } from 'next/server';
import { cleanOldOrders } from '@/lib/db';
import { createSecureResponse } from '@/lib/security';

export async function POST(request: NextRequest) {
    try {
        const deletedCount = await cleanOldOrders(7);
        return createSecureResponse({ success: true, deletedCount });
    } catch (error) {
        console.error('Cleanup error:', error);
        return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 });
    }
}
