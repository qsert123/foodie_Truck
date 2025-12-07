import { NextRequest, NextResponse } from 'next/server';
import { addOrder, getOrders } from '@/lib/db';
import { Order } from '@/lib/types';
import { validateOrder, sanitizeInput, createSecureResponse, rateLimit, getClientIdentifier } from '@/lib/security';

export async function POST(request: NextRequest) {
    try {
        // Rate limiting: max 10 orders per 15 minutes per IP
        const clientId = getClientIdentifier(request);
        const { allowed } = rateLimit(clientId + ':orders');
        if (!allowed) {
            return NextResponse.json({ error: 'Too many orders. Please wait before placing another order.' }, { status: 429 });
        }

        const body = await request.json();

        // Validate order data
        const validation = validateOrder(body);
        if (!validation.valid) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const { customerName, items, total, notes, deviceId } = body;

        // Sanitize inputs
        const sanitizedCustomerName = sanitizeInput(customerName);
        const sanitizedNotes = notes ? sanitizeInput(notes) : '';

        // Validate items array
        if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
            return NextResponse.json({ error: 'Invalid items' }, { status: 400 });
        }

        // Validate each item
        for (const item of items) {
            if (!item.id || !item.name || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
                return NextResponse.json({ error: 'Invalid item data' }, { status: 400 });
            }
            if (item.quantity < 1 || item.quantity > 100) {
                return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
            }
        }

        const newOrder: Order = {
            id: Date.now().toString(),
            customerName: sanitizedCustomerName,
            items,
            total,
            status: 'pending',
            createdAt: new Date().toISOString(),
            notes: sanitizedNotes,
            deviceId,
        };

        await addOrder(newOrder);

        return createSecureResponse({ success: true, order: newOrder });
    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        // Rate limiting for GET requests
        const clientId = getClientIdentifier(request);
        const { allowed } = rateLimit(clientId + ':get-orders');
        if (!allowed) {
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
        }

        const orders = await getOrders();
        // Return active orders (pending or ready)
        const activeOrders = orders.filter(o => o.status !== 'completed');
        return createSecureResponse(activeOrders);
    } catch (error) {
        console.error('Order fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
