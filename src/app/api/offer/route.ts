import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';
import { SpecialOffer } from '@/lib/types';

export async function GET() {
    try {
        const db = await getDB();
        return NextResponse.json(db.offers || []);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const offer: SpecialOffer = await req.json();
        const db = await getDB();

        let offers = db.offers || [];
        const existingIndex = offers.findIndex(o => o.id === offer.id);

        if (existingIndex > -1) {
            offers[existingIndex] = offer;
        } else {
            offers.push(offer);
        }

        db.offers = offers;
        await saveDB(db);

        return NextResponse.json({ success: true, offer });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save offer' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const db = await getDB();
        db.offers = (db.offers || []).filter(o => o.id !== id);
        await saveDB(db);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 });
    }
}
