import { NextResponse } from 'next/server';
import { getLocation } from '@/lib/db';

export async function GET() {
    try {
        const location = await getLocation();
        return NextResponse.json(location);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch location' }, { status: 500 });
    }
}
