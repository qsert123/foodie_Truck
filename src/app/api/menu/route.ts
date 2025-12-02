import { NextResponse } from 'next/server';
import { getMenu } from '@/lib/db';

export async function GET() {
    try {
        const menu = await getMenu();
        return NextResponse.json(menu);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
    }
}
