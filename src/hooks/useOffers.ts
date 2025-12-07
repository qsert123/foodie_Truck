import { useState, useEffect } from 'react';
import { SpecialOffer } from '@/lib/types';

export function useOffers() {
    const [offers, setOffers] = useState<SpecialOffer[]>([]);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const res = await fetch(`/api/offer?t=${Date.now()}`);
                if (res.ok) {
                    const data = await res.json();
                    setOffers(data);
                }
            } catch (error) {
                console.error('Failed to poll offers:', error);
            }
        };

        // Poll every 5 seconds
        const interval = setInterval(fetchOffers, 5000);
        fetchOffers();

        const onFocus = () => fetchOffers();
        window.addEventListener('focus', onFocus);

        return () => {
            clearInterval(interval);
            window.removeEventListener('focus', onFocus);
        };
    }, []);

    return offers;
}
