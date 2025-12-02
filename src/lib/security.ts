import { NextRequest, NextResponse } from 'next/server';

// Rate limiting store (in-memory, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Security headers configuration
export const securityHeaders = {
    'X-DNS-Prefetch-Control': 'on',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

// Rate limiting configuration
const RATE_LIMIT_MAX = 1000; // requests
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

/**
 * Rate limiting middleware
 */
export function rateLimit(identifier: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const record = rateLimitStore.get(identifier);

    if (!record || now > record.resetTime) {
        rateLimitStore.set(identifier, {
            count: 1,
            resetTime: now + RATE_LIMIT_WINDOW,
        });
        return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
    }

    if (record.count >= RATE_LIMIT_MAX) {
        return { allowed: false, remaining: 0 };
    }

    record.count++;
    return { allowed: true, remaining: RATE_LIMIT_MAX - record.count };
}

/**
 * Get client identifier for rate limiting
 */
export function getClientIdentifier(request: NextRequest): string {
    // Use IP address or fallback to a header
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    return ip;
}

/**
 * Validate admin authentication
 */
export function validateAdminAuth(request: NextRequest): boolean {
    const cookie = request.cookies.get('admin_token');
    if (!cookie) return false;

    try {
        // In production, verify JWT token here
        // For now, check if token exists and is not expired
        const token = cookie.value;
        if (!token || token.length < 10) return false;

        // Add JWT verification here in production
        return true;
    } catch {
        return false;
    }
}

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input: string): string {
    if (typeof input !== 'string') return '';

    return input
        .replace(/[<>]/g, '') // Remove < and >
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .trim()
        .slice(0, 1000); // Limit length
}

/**
 * Validate file upload
 */
export function validateFileUpload(file: File): { valid: boolean; error?: string } {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (file.size > MAX_SIZE) {
        return { valid: false, error: 'File size exceeds 5MB limit' };
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
        return { valid: false, error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF allowed' };
    }

    // Check file extension matches MIME type
    const ext = file.name.split('.').pop()?.toLowerCase();
    const typeMap: Record<string, string[]> = {
        'image/jpeg': ['jpg', 'jpeg'],
        'image/png': ['png'],
        'image/webp': ['webp'],
        'image/gif': ['gif'],
    };

    const validExts = typeMap[file.type] || [];
    if (ext && !validExts.includes(ext)) {
        return { valid: false, error: 'File extension does not match file type' };
    }

    return { valid: true };
}

/**
 * Validate menu item data
 */
export function validateMenuItem(item: any): { valid: boolean; error?: string } {
    if (!item || typeof item !== 'object') {
        return { valid: false, error: 'Invalid item data' };
    }

    if (!item.name || typeof item.name !== 'string' || item.name.length > 100) {
        return { valid: false, error: 'Invalid name' };
    }

    if (!item.description || typeof item.description !== 'string' || item.description.length > 500) {
        return { valid: false, error: 'Invalid description' };
    }

    if (typeof item.price !== 'number' || item.price < 0 || item.price > 100000) {
        return { valid: false, error: 'Invalid price' };
    }

    if (!item.category || typeof item.category !== 'string' || item.category.length > 50) {
        return { valid: false, error: 'Invalid category' };
    }

    if (item.image && typeof item.image !== 'string') {
        return { valid: false, error: 'Invalid image URL' };
    }

    return { valid: true };
}

/**
 * Create secure response with headers
 */
export function createSecureResponse(data: any, status = 200): NextResponse {
    const response = NextResponse.json(data, { status });

    Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    return response;
}

/**
 * Hash password using Web Crypto API
 */
export async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate secure random token
 */
export function generateSecureToken(length = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate order data
 */
export function validateOrder(order: any): { valid: boolean; error?: string } {
    if (!order || typeof order !== 'object') {
        return { valid: false, error: 'Invalid order data' };
    }

    if (!order.customerName || typeof order.customerName !== 'string' || order.customerName.length > 100) {
        return { valid: false, error: 'Invalid customer name' };
    }

    if (!Array.isArray(order.items) || order.items.length === 0 || order.items.length > 50) {
        return { valid: false, error: 'Invalid items' };
    }

    if (typeof order.total !== 'number' || order.total < 0 || order.total > 1000000) {
        return { valid: false, error: 'Invalid total' };
    }

    if (order.notes && (typeof order.notes !== 'string' || order.notes.length > 500)) {
        return { valid: false, error: 'Invalid notes' };
    }

    return { valid: true };
}
