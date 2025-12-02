import { NextRequest, NextResponse } from 'next/server';
import { saveOffer, deleteOffer, SpecialOffer } from '@/lib/db';
import { validateAdminAuth, sanitizeInput, createSecureResponse, rateLimit, getClientIdentifier } from '@/lib/security';

export async function POST(request: NextRequest) {
    try {
        // Verify admin authentication
        if (!validateAdminAuth(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Rate limiting
        const clientId = getClientIdentifier(request);
        const { allowed } = rateLimit(clientId);
        if (!allowed) {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }

        const offer: SpecialOffer = await request.json();

        // Validate input
        if (!offer || typeof offer !== 'object') {
            return NextResponse.json({ error: 'Invalid offer data' }, { status: 400 });
        }

        if (!offer.title || typeof offer.title !== 'string' || offer.title.length > 100) {
            return NextResponse.json({ error: 'Invalid title' }, { status: 400 });
        }

        if (!offer.description || typeof offer.description !== 'string' || offer.description.length > 500) {
            return NextResponse.json({ error: 'Invalid description' }, { status: 400 });
        }

        if (!Array.isArray(offer.itemIds) || offer.itemIds.length > 50) {
            return NextResponse.json({ error: 'Invalid item IDs' }, { status: 400 });
        }

        // Sanitize inputs
        offer.title = sanitizeInput(offer.title);
        offer.description = sanitizeInput(offer.description);

        await saveOffer(offer);
        return createSecureResponse({ success: true, offer });
    } catch (error) {
        console.error('Offer save error:', error);
        return NextResponse.json({ error: 'Failed to save offer' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        // Verify admin authentication
        if (!validateAdminAuth(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Rate limiting
        const clientId = getClientIdentifier(request);
        const { allowed } = rateLimit(clientId);
        if (!allowed) {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id || typeof id !== 'string' || id.length > 50) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        await deleteOffer(id);

        return createSecureResponse({ success: true });
    } catch (error) {
        console.error('Offer delete error:', error);
        return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 });
    }
}
