'use client';

import Link from 'next/link';
import styles from './Navbar.module.css';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await fetch('/api/location');
                if (res.ok) {
                    const data = await res.json();
                    setIsOnline(data.isOnline !== false);
                }
            } catch (error) {
                console.error('Failed to check status', error);
            }
        };
        checkStatus();
    }, []);

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <img src="/logo.png" alt="Broast N Bakes" className={styles.logoImage} style={{ height: '50px', width: 'auto' }} />
                </Link>
                <div className={styles.links}>
                    <Link href="/" className={styles.link}>Menu</Link>
                    <Link href="/order" className={styles.link}>
                        <span className="desktop-only">Order Now</span>
                        <span className="mobile-only">Order</span>
                    </Link>
                    <Link href="/location" className={styles.link}>Find Us</Link>
                    {isOnline && (
                        <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: '#FFC107',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            border: '1px solid #FFC107',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '20px',
                            marginLeft: '1rem'
                        }}>
                            <span style={{
                                width: '8px',
                                height: '8px',
                                backgroundColor: '#FFC107',
                                borderRadius: '50%',
                                display: 'inline-block',
                                boxShadow: '0 0 5px #FFC107'
                            }}></span>
                            OPEN NOW
                        </span>
                    )}
                </div>
            </div>
        </nav>
    );
}
