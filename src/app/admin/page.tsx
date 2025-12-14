'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [attempts, setAttempts] = useState(0);
    const router = useRouter();

    const [requestId, setRequestId] = useState<string | null>(null);
    const [verificationCode, setVerificationCode] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (attempts >= 5) {
            setError('Too many failed attempts. Please wait 5 minutes.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                if (data.requireVerification) {
                    setRequestId(data.requestId);
                    setLoading(false);
                    setError('');
                } else {
                    router.push('/admin/dashboard');
                }
            } else {
                setLoading(false);
                setAttempts(prev => prev + 1);
                setError(data.error || 'Invalid password');
                setPassword('');
            }
        } catch (err) {
            setLoading(false);
            setError('Authentication failed. Please try again.');
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/admin/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId, code: verificationCode }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                router.push('/admin/dashboard');
            } else {
                setLoading(false);
                setError(data.error || 'Invalid code');
            }
        } catch (err) {
            setLoading(false);
            setError('Verification failed.');
        }
    };

    return (
        <main style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <form onSubmit={requestId ? handleVerify : handleLogin} className="card" style={{ width: '100%', maxWidth: '400px' }}>
                    <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        {requestId ? 'Verify Identity' : 'Admin Login'}
                    </h1>

                    {error && (
                        <div style={{
                            background: '#F44336',
                            color: '#fff',
                            padding: '0.75rem',
                            borderRadius: '4px',
                            marginBottom: '1rem',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    {requestId ? (
                        <>
                            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                                <p style={{ marginBottom: '1rem', color: '#666' }}>
                                    We sent a 6-digit code to your email.<br />
                                    <small>(Check spam if not found)</small>
                                </p>
                                <input
                                    type="text"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="Enter 6-digit code"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '4px',
                                        border: '1px solid #333',
                                        background: '#fff',
                                        color: '#000',
                                        fontSize: '1.5rem',
                                        textAlign: 'center',
                                        letterSpacing: '0.5rem'
                                    }}
                                    maxLength={6}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%' }}
                                disabled={loading || verificationCode.length !== 6}
                            >
                                {loading ? 'Verifying...' : 'Verify Code'}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setRequestId(null); setPassword(''); setError(''); }}
                                style={{
                                    width: '100%',
                                    marginTop: '1rem',
                                    background: 'none',
                                    border: 'none',
                                    color: '#666',
                                    cursor: 'pointer',
                                    textDecoration: 'underline'
                                }}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading || attempts >= 5}
                                    required
                                    minLength={6}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '4px',
                                        border: '1px solid #333',
                                        background: '#2C2C2C',
                                        color: '#fff'
                                    }}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%' }}
                                disabled={loading || attempts >= 5}
                            >
                                {loading ? 'Authenticating...' : 'Login'}
                            </button>
                        </>
                    )}
                </form>
            </div>
        </main>
    );
}
