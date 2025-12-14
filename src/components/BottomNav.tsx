'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './BottomNav.module.css';

export default function BottomNav() {
    const pathname = usePathname();

    // Don't show on admin or kitchen pages
    if (pathname.startsWith('/admin') || pathname === '/kitchen') {
        return null;
    }

    return (
        <nav className={styles.bottomNav}>
            <Link href="/" className={`${styles.navItem} ${pathname === '/' ? styles.active : ''}`}>
                <span className={styles.icon}>🏠</span>
            </Link>

            <Link href="/order" className={`${styles.navItem} ${pathname === '/order' ? styles.active : ''}`}>
                <span className={styles.icon}>🛍</span>
            </Link>
        </nav>
    );
}
