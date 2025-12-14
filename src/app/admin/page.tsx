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
                if (data.requireApproval) {
                    setRequestId(data.requestId);
                    pollStatus(data.requestId);
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

    const pollStatus = async (id: string) => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/admin/status?id=${id}`);
                const data = await res.json();

                if (data.status === 'approved') {
                    clearInterval(interval);
                    router.push('/admin/dashboard');
                } else if (data.status === 'rejected') {
                    clearInterval(interval);
                    setLoading(false);
                    setRequestId(null);
                    setError('Login request rejected.');
                }
            } catch (e) {
                console.error(e);
            }
        }, 2000); // Check every 2 seconds

        // Stop polling after 5 minutes
        setTimeout(() => {
            clearInterval(interval);
            if (loading) {
                setLoading(false);
                setRequestId(null);
                setError('Login request timed out.');
            }
        }, 5 * 60 * 1000);
    };

    return (
        <main style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <form onSubmit={handleLogin} className="card" style={{ width: '100%', maxWidth: '400px' }}>
                    <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Admin Login</h1>
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
                        <div style={{ textAlign: 'center' }}>
                            <div className="animate-pulse" style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
                            <h3>Waiting for Approval</h3>
                            <p style={{ color: '#666', marginTop: '1rem' }}>
                                We've sent an approval request to the admin emails.<br />
                                <strong>arshekhjohn7@gmail.com</strong><br />
                                <strong>cyberthoughts421@gmail.com</strong>
                            </p>
                            <div style={{ marginTop: '2rem' }}>
                                <div className="spinner" style={{
                                    border: '4px solid #f3f3f3',
                                    borderTop: '4px solid var(--primary)',
                                    borderRadius: '50%',
                                    width: '30px',
                                    height: '30px',
                                    animation: 'spin 1s linear infinite',
                                    margin: '0 auto'
                                }}></div>
                                <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '1rem' }}>Checking status...</p>
                            </div>
                        </div>
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
                <style jsx>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </main>
    );
}
