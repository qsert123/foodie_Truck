import { NextRequest, NextResponse } from 'next/server';
import { getOrders } from '@/lib/db';
import { createSecureResponse } from '@/lib/security';

export async function GET(request: NextRequest) {
    try {
        const orders = await getOrders();

        // Filter for last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentOrders = orders.filter(o => new Date(o.createdAt) >= sevenDaysAgo);

        // Sort by date desc
        recentOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return createSecureResponse({ orders: recentOrders });
    } catch (error) {
        console.error('Report fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch report' }, { status: 500 });
    }
}
