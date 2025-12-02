import { NextResponse } from 'next/server';
import { getMenu } from '@/lib/db';

// Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const menu = await getMenu();
        return NextResponse.json(menu, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
    }
}
