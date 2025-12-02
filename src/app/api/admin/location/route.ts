import { NextRequest, NextResponse } from 'next/server';
import { saveLocation, LocationData } from '@/lib/db';
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

        const location: LocationData = await request.json();

        // Validate input
        if (!location || typeof location !== 'object') {
            return NextResponse.json({ error: 'Invalid location data' }, { status: 400 });
        }

        if (!location.name || typeof location.name !== 'string' || location.name.length > 100) {
            return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
        }

        if (!location.address || typeof location.address !== 'string' || location.address.length > 200) {
            return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
        }

        // Sanitize inputs
        location.name = sanitizeInput(location.name);
        location.address = sanitizeInput(location.address);
        location.openTime = sanitizeInput(location.openTime);
        location.closeTime = sanitizeInput(location.closeTime);
        if (location.nextOnlineTime) {
            location.nextOnlineTime = sanitizeInput(location.nextOnlineTime);
        }

        await saveLocation(location);
        return createSecureResponse({ success: true, location });
    } catch (error) {
        console.error('Location update error:', error);
        return NextResponse.json({ error: 'Failed to update location' }, { status: 500 });
    }
}
