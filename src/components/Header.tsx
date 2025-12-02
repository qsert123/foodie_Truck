'use client';

import { useState, useEffect } from 'react';
import { LocationData } from '@/lib/types';

export default function Header() {
    const [location, setLocation] = useState<LocationData | null>(null);
    const [showTiming, setShowTiming] = useState(false);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const res = await fetch('/api/location');
                if (res.ok) {
                    const data = await res.json();
                    setLocation(data);
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchLocation();
    }, []);

    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            background: 'var(--background)',
            position: 'sticky',
            top: 0,
            zIndex: 50
        }}>
            {/* Left: Title */}
            <h1 style={{
                fontSize: '4.5rem',
                fontFamily: '"Transcity", "Brush Script MT", cursive',
                color: 'var(--primary)',
                margin: 0,
                lineHeight: 1,
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
            }}>
                Foodie
            </h1>

            {/* Right: Location */}
            <div style={{ position: 'relative' }}>
                <div
                    onClick={() => setShowTiming(!showTiming)}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        cursor: 'pointer'
                    }}
                >
                    <span style={{ fontSize: '0.75rem', color: '#888', marginRight: '4px' }}>Location</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 'bold' }}>
                        <span style={{ color: 'var(--primary)' }}>📍</span>
                        <span>{location?.name || 'Loading...'}</span>
                        <span style={{ fontSize: '0.8rem' }}>▼</span>
                    </div>
                </div>

                {/* Timing Popover */}
                {showTiming && location && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '0.5rem',
                        background: '#fff',
                        padding: '1rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        minWidth: '200px',
                        zIndex: 100,
                        border: '1px solid #eee'
                    }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Opening Hours</h4>
                        <div style={{ fontSize: '0.9rem', color: '#555' }}>
                            <p style={{ margin: '0.25rem 0' }}>Open: {location.openTime}</p>
                            <p style={{ margin: '0.25rem 0' }}>Close: {location.closeTime}</p>
                        </div>
                        {location.isOnline === false && (
                            <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: 'bold' }}>
                                Currently Offline
                            </p>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}
