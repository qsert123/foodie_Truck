import Header from '@/components/Header';
import HomeClient from '@/components/HomeClient';
import HeroCarousel from '@/components/HeroCarousel';
import Link from 'next/link';
import Image from 'next/image';

// Force dynamic rendering to always get fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
    // Fetch from API to ensure fresh data
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/menu`, {
        cache: 'no-store',
    });
    const menu = await res.json();

    // Select a few items for the carousel (e.g., top 5 or specific ones)
    const featuredItems = menu.slice(0, 5);

    return (
        <main style={{ paddingBottom: '80px', background: '#F9F9F9', minHeight: '100vh' }}>
            <Header />

            <div className="container" style={{ padding: '0 1rem' }}>
                <HeroCarousel items={featuredItems} />

                <HomeClient initialMenu={menu} />
            </div>
        </main>
    );
}
