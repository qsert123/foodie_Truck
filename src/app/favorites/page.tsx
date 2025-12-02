'use client';

import MenuGrid from '@/components/MenuGrid';
import { MenuItem } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, we would fetch saved favorites.
        // For now, we'll just show a placeholder or fetch some random items.
        const fetchFavorites = async () => {
            try {
                const res = await fetch('/api/menu');
                if (res.ok) {
                    const data = await res.json();
                    // Just show the first 2 items as "favorites" for demo
                    setFavorites(data.slice(0, 2));
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchFavorites();
    }, []);

    return (
        <main style={{ padding: '2rem', paddingTop: '100px', minHeight: '100vh', background: '#F9F9F9' }}>
            <div className="container">
                <h1 style={{ marginBottom: '2rem' }}>My Favorites</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : favorites.length > 0 ? (
                    <MenuGrid items={favorites} />
                ) : (
                    <p>No favorites yet.</p>
                )}
            </div>
        </main>
    );
}
