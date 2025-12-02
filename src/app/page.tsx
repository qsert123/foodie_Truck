import Header from '@/components/Header';
import HomeClient from '@/components/HomeClient';
import HeroCarousel from '@/components/HeroCarousel';
import { getMenu } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';

export default async function Home() {
    const menu = await getMenu();
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
