import { NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/db';

export async function PUT(request: Request) {
    try {
        const { id, status } = await request.json();

        if (!id || !status) {
            return NextResponse.json({ error: 'ID and status required' }, { status: 400 });
        }

        await updateOrderStatus(id, status);

        return NextResponse.json({ success: true, id, status });
    } catch (error) {
        console.error('Update order error:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
