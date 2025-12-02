import { getMenu } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function DiagnosticPage() {
    let diagnostics: any = {
        firebaseConfigured: false,
        menuCount: 0,
        error: null,
        items: []
    };

    try {
        const menu = await getMenu();
        diagnostics.menuCount = menu.length;
        diagnostics.items = menu.map(item => ({ id: item.id, name: item.name }));
        diagnostics.firebaseConfigured = true;
    } catch (error) {
        diagnostics.error = error instanceof Error ? error.message : 'Unknown error';
    }

    return (
        <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
            <h1>🔍 Firebase Diagnostic</h1>

            <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
                <h2>Status:</h2>
                <pre>{JSON.stringify(diagnostics, null, 2)}</pre>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h2>Environment Variables:</h2>
                <ul>
                    <li>API Key: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing'}</li>
                    <li>Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing'}</li>
                    <li>Storage Bucket: {process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Missing'}</li>
                </ul>
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', background: '#fff3cd', borderRadius: '8px' }}>
                <h3>📝 Instructions:</h3>
                <p>1. Check the server console (terminal) for detailed logs</p>
                <p>2. Look for lines starting with <code>[getMenu]</code></p>
                <p>3. If Firebase is not initialized, check your .env.local file</p>
                <p>4. If there's an error, it will show above</p>
            </div>
        </div>
    );
}
