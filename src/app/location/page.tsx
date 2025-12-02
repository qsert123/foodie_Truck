import Navbar from '@/components/Navbar';
import { getLocation } from '@/lib/db';

export default async function LocationPage() {
    const location = await getLocation();

    return (
        <main>
            <Navbar />
            <div style={{ paddingTop: '100px' }} className="container section">
                <h1 style={{ fontSize: '3rem', marginBottom: '2rem', color: 'var(--primary)' }}>Find Us</h1>

                <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Current Location</h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                        {location.name}
                    </p>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        {location.address}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
                        <div>
                            <span style={{ display: 'block', color: 'var(--primary)', fontWeight: 'bold' }}>Open</span>
                            {location.openTime}
                        </div>
                        <div>
                            <span style={{ display: 'block', color: 'var(--primary)', fontWeight: 'bold' }}>Close</span>
                            {location.closeTime}
                        </div>
                    </div>

                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${location.coordinates.lat},${location.coordinates.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                    >
                        Get Directions
                    </a>
                </div>
            </div>
        </main>
    );
}
