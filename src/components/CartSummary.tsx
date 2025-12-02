'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CartSummary() {
    const { cartCount, cartTotal } = useCart();
    const pathname = usePathname();

    // Don't show on order page, admin pages, or kitchen page
    if (pathname === '/order' || pathname.startsWith('/admin') || pathname === '/kitchen') {
        return null;
    }

    if (cartCount === 0) return null;

    return (
        <>
            <div style={{ height: '100px' }}></div>
            <div style={{
                position: 'fixed',
                bottom: '80px', // Moved up to avoid covering BottomNav if present, or just to be higher
                left: '0',
                width: '100%',
                background: 'var(--surface)',
                borderTop: '1px solid var(--primary)',
                padding: '1rem',
                zIndex: 90,
                display: 'flex',
                justifyContent: 'center',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
            }} className="cart-summary-container">
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div>
                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{cartCount} Items</span>
                        <span style={{ margin: '0 1rem', color: '#555' }}>|</span>
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.1rem' }}>₹{cartTotal}</span>
                    </div>
                    <Link href="/order" className="btn btn-primary">
                        View Order
                    </Link>
                </div>
            </div>
        </>
    );
}
