'use client';

export default function ProfilePage() {
    return (
        <main style={{ padding: '2rem', paddingTop: '100px', minHeight: '100vh', background: '#F9F9F9' }}>
            <div className="container">
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: '#e0e0e0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem',
                        marginBottom: '1rem',
                        color: '#888'
                    }}>
                        👤
                    </div>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Guest User</h1>
                    <p style={{ color: '#666' }}>Welcome to Foodie!</p>
                </div>

                <div className="card" style={{ marginBottom: '1rem', background: '#fff', borderRadius: '16px', padding: '0' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', textAlign: 'left' }}>Account Settings</h3>
                    </div>
                    <div style={{ padding: '0.5rem' }}>
                        <button className="btn" style={{ width: '100%', textAlign: 'left', background: 'transparent', color: '#333', justifyContent: 'flex-start', padding: '1rem' }}>
                            Edit Profile
                        </button>
                        <button className="btn" style={{ width: '100%', textAlign: 'left', background: 'transparent', color: '#333', justifyContent: 'flex-start', padding: '1rem' }}>
                            Saved Addresses
                        </button>
                        <button className="btn" style={{ width: '100%', textAlign: 'left', background: 'transparent', color: '#333', justifyContent: 'flex-start', padding: '1rem' }}>
                            Payment Methods
                        </button>
                    </div>
                </div>

                <div className="card" style={{ background: '#fff', borderRadius: '16px', padding: '0' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', textAlign: 'left' }}>More</h3>
                    </div>
                    <div style={{ padding: '0.5rem' }}>
                        <a href="/admin" className="btn" style={{ width: '100%', textAlign: 'left', background: 'transparent', color: '#333', justifyContent: 'flex-start', padding: '1rem', display: 'flex' }}>
                            Admin Login
                        </a>
                        <button className="btn" style={{ width: '100%', textAlign: 'left', background: 'transparent', color: '#F44336', justifyContent: 'flex-start', padding: '1rem' }}>
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
