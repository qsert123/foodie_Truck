import { NextRequest, NextResponse } from 'next/server';
import { saveMenuItem, deleteMenuItem, MenuItem } from '@/lib/db';
import { validateAdminAuth, validateMenuItem, sanitizeInput, createSecureResponse, rateLimit, getClientIdentifier } from '@/lib/security';

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

        const item: MenuItem = await request.json();

        // Validate input
        const validation = validateMenuItem(item);
        if (!validation.valid) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        // Sanitize string inputs
        item.name = sanitizeInput(item.name);
        item.description = sanitizeInput(item.description);
        item.category = sanitizeInput(item.category);
        if (item.image) {
            item.image = sanitizeInput(item.image);
        }

        await saveMenuItem(item);
        return createSecureResponse({ success: true, item });
    } catch (error) {
        console.error('Menu save error:', error);
        return NextResponse.json({ error: 'Failed to save item' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        // Verify admin authentication
        if (!validateAdminAuth(request)) {
            console.error('[DELETE] Unauthorized attempt');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Rate limiting
        const clientId = getClientIdentifier(request);
        const { allowed } = rateLimit(clientId);
        if (!allowed) {
            console.error('[DELETE] Rate limit exceeded');
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id || typeof id !== 'string' || id.length > 50) {
            console.error('[DELETE] Invalid ID:', id);
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        console.log('[DELETE] Attempting to delete menu item:', id);

        await deleteMenuItem(id);

        console.log('[DELETE] Successfully deleted menu item:', id);

        return createSecureResponse({ success: true, deletedId: id });
    } catch (error) {
        console.error('[DELETE] Menu delete error:', error);
        return NextResponse.json({
            error: 'Failed to delete item',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
