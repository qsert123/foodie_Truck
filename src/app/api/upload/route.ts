import { NextRequest, NextResponse } from 'next/server';
import { validateAdminAuth, validateFileUpload, rateLimit, getClientIdentifier } from '@/lib/security';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp, getApps } from 'firebase/app';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Initialize Firebase (only if not already initialized)
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const storage = getStorage(app);

export async function POST(request: NextRequest) {
    try {
        // Verify admin authentication
        if (!validateAdminAuth(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Rate limiting
        const clientId = getClientIdentifier(request);
        const { allowed } = rateLimit(clientId + ':upload');
        if (!allowed) {
            return NextResponse.json({ error: 'Too many upload requests' }, { status: 429 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Validate file
        const validation = validateFileUpload(file);
        if (!validation.valid) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        // Additional size check
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: 'File too large. Maximum size is 5MB' }, { status: 400 });
        }

        // Type check
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Sanitize filename - remove special characters and limit length
        const sanitizedName = file.name
            .replace(/[^a-zA-Z0-9.-]/g, '_')
            .slice(0, 100);

        // Create a unique filename with timestamp
        const filename = `menu-images/${Date.now()}-${sanitizedName}`;

        // Upload to Firebase Storage
        const storageRef = ref(storage, filename);
        await uploadBytes(storageRef, buffer, {
            contentType: file.type,
        });

        // Get the download URL
        const downloadURL = await getDownloadURL(storageRef);

        return NextResponse.json({
            url: downloadURL,
            success: true
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
