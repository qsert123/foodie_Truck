'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import MenuGrid from '@/components/MenuGrid';
import { MenuItem } from '@/lib/types';
import { useOffers } from '@/hooks/useOffers';
import { useMenuData } from '@/hooks/useMenuData';

interface MenuClientProps {
    initialMenu: MenuItem[];
}

export default function MenuClient({ initialMenu }: MenuClientProps) {
    const menu = useMenuData(initialMenu);
    const offers = useOffers();
    const [dismissedOffers, setDismissedOffers] = useState<string[]>([]);

    // Filter active offers that haven't been dismissed
    const activeOffers = offers.filter(o => o.active && !dismissedOffers.includes(o.id));

    // Group by category
    const categories = Array.from(new Set(menu.map(item => item.category)));

    const handleApply = () => {
        alert('Offer Applied! Discount will be reflected at checkout.');
    };

    const handleClose = (id: string) => {
        setDismissedOffers(prev => [...prev, id]);
    };

    return (
        <main>
            <Navbar />
            <div style={{ paddingTop: '100px' }} className="container section">
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary)' }}>Our Menu</h1>

                {/* Special Offers Section */}
                {activeOffers.length > 0 && (
                    <div style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#FFC107' }}>Special Offers</h2>
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {activeOffers.map(offer => (
                                <div key={offer.id} className="card" style={{
                                    border: '2px solid #FFC107',
                                    background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(0,0,0,0) 100%)',
                                    padding: '1.5rem'
                                }}>
                                    {/* Heading */}
                                    <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: '#FFC107', fontFamily: '"Transcity", "Brush Script MT", cursive' }}>
                                        {offer.title}
                                    </h3>

                                    {/* Discount Percentage Line */}
                                    {offer.discountPercentage && (
                                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.5rem' }}>
                                            Get <span style={{ color: '#FFC107', fontSize: '1.4rem' }}>{offer.discountPercentage}%</span> off on
                                        </p>
                                    )}

                                    {/* Content */}
                                    <p style={{ fontSize: '1.1rem', color: '#ddd', whiteSpace: 'pre-wrap', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                                        {offer.description}
                                    </p>

                                    {/* Buttons: Apply & Close */}
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button
                                            className="btn btn-primary"
                                            onClick={handleApply}
                                            style={{ padding: '0.5rem 1.5rem' }}
                                        >
                                            Apply
                                        </button>
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => handleClose(offer.id)}
                                            style={{ padding: '0.5rem 1.5rem' }}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {categories.map(category => (
                    <div key={category} style={{ marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                            {category}
                        </h2>
                        <MenuGrid items={menu.filter(item => item.category === category)} />
                    </div>
                ))}
            </div>
        </main>
    );
}
