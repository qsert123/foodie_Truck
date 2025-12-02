'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function StatusChecker() {
    const [isOnline, setIsOnline] = useState(true);
    const [nextOnlineTime, setNextOnlineTime] = useState<string | undefined>(undefined);
    const [phone, setPhone] = useState<string | undefined>(undefined);
    const [instagram, setInstagram] = useState<string | undefined>(undefined);
    const pathname = usePathname();

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await fetch('/api/location');
                if (res.ok) {
                    const data = await res.json();
                    // If isOnline is undefined, assume true
                    setIsOnline(data.isOnline !== false);
                    setNextOnlineTime(data.nextOnlineTime);
                    setPhone(data.phone);
                    setInstagram(data.instagram);
                }
            } catch (error) {
                console.error('Failed to check status', error);
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 10000); // Check every 10 seconds
        return () => clearInterval(interval);
    }, []);

    // Don't show on admin or kitchen pages
    if (pathname.startsWith('/admin') || pathname === '/kitchen') {
        return null;
    }

    if (isOnline) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: '#0a0a1a', // Dark blue background
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            textAlign: 'center',
            padding: '2rem'
        }}>
            <div className="animate-pulse" style={{ marginBottom: '2rem', position: 'relative', width: '300px', height: '300px' }}>
                <Image
                    src="/images/offline_truck.png"
                    alt="Truck Offline"
                    fill
                    style={{ objectFit: 'contain' }}
                />
            </div>

            <h1 className="animate-slide-up" style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                color: '#FFC107',
                textShadow: '0 0 10px rgba(255, 193, 7, 0.5)'
            }}>
                Truck is Offline
            </h1>

            <p className="animate-slide-up delay-200" style={{
                fontSize: '1.5rem',
                color: '#B0B0B0',
                maxWidth: '600px',
                padding: '0 1rem',
                marginBottom: '2rem'
            }}>
                We are currently closed.
                {nextOnlineTime && (
                    <span style={{ display: 'block', marginTop: '1rem', color: '#fff', fontWeight: 'bold', fontSize: '1.8rem' }}>
                        Back at {nextOnlineTime}
                    </span>
                )}
                {!nextOnlineTime && " Please check back later!"}
            </p>

            {/* Contact Details */}
            <div style={{
                display: 'flex',
                gap: '2rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginTop: '2rem'
            }}>
                {phone && (
                    <a
                        href={`tel:${phone.replace(/\s/g, '')}`}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem',
                            textDecoration: 'none',
                            color: '#fff',
                            padding: '1rem',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            transition: 'transform 0.2s, background 0.2s',
                            minWidth: '150px'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.background = 'rgba(255, 193, 7, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        }}
                    >
                        <div style={{ fontSize: '2rem' }}>📞</div>
                        <span style={{ fontSize: '0.9rem', color: '#FFC107' }}>Call Us</span>
                        <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>{phone}</span>
                    </a>
                )}

                {instagram && (
                    <a
                        href={`https://instagram.com/${instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem',
                            textDecoration: 'none',
                            color: '#fff',
                            padding: '1rem',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(10px)',
                            transition: 'transform 0.2s, background 0.2s',
                            minWidth: '150px'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.background = 'rgba(225, 48, 108, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        }}
                    >
                        <div style={{ fontSize: '2rem' }}>📷</div>
                        <span style={{ fontSize: '0.9rem', color: '#E1306C' }}>Follow Us</span>
                        <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>{instagram}</span>
                    </a>
                )}
            </div>
        </div>
    );
}
