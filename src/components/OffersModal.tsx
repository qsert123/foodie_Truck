'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { SpecialOffer, MenuItem } from '@/lib/types';

export default function OffersModal() {
    const [show, setShow] = useState(false);
    const [offer, setOffer] = useState<SpecialOffer | null>(null);
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const { addToCart, applyOffer } = useCart();

    useEffect(() => {
        const fetchOffer = async () => {
            const [offerRes, menuRes] = await Promise.all([
                fetch('/api/offer'),
                fetch('/api/menu')
            ]);

            if (offerRes.ok && menuRes.ok) {
                const offersData = await offerRes.json();
                const menuData = await menuRes.json();

                // Handle both array (new) and object (legacy) formats just in case
                const offers = Array.isArray(offersData) ? offersData : [offersData];
                const activeOffer = offers.find((o: SpecialOffer) => o.active);

                if (activeOffer) {
                    setOffer(activeOffer);
                    setMenu(menuData);

                    const hasSeen = sessionStorage.getItem('seen_offer_' + activeOffer.id);
                    if (!hasSeen) {
                        setShow(true);
                        sessionStorage.setItem('seen_offer_' + activeOffer.id, 'true');
                    }
                }
            }
        };

        fetchOffer();
    }, []);

    const handleOrder = () => {
        if (!offer) return;
        applyOffer(offer);
        setShow(false);
    };

    if (!show || !offer) return null;

    const offerItems = menu.filter(item => offer.itemIds.includes(item.id));

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.8)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        }}>
            <div className="card animate-scale-in" style={{ maxWidth: '500px', width: '100%', position: 'relative', border: '2px solid var(--primary)' }}>
                <button
                    onClick={() => setShow(false)}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        color: '#fff',
                        fontSize: '1.5rem'
                    }}
                >
                    &times;
                </button>

                <h2 style={{ color: 'var(--primary)', textAlign: 'center', fontSize: '2rem', marginBottom: '1rem' }}>
                    🔥 {offer.title}
                </h2>

                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
                        {offer.description}
                    </p>
                    <div style={{
                        background: 'var(--surface-hover)',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem'
                    }}>
                        <h3 style={{ marginBottom: '0.5rem' }}>Get {offer.discountPercentage}% OFF on:</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {offerItems.map(item => (
                                <li key={item.id}>{item.name}</li>
                            ))}
                        </ul>
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={handleOrder}
                        style={{ width: '100%' }}
                    >
                        Apply Offer
                    </button>
                </div>
            </div>
        </div>
    );
}
