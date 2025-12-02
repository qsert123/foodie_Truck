import Header from '@/components/Header';
import HomeClient from '@/components/HomeClient';
import HeroCarousel from '@/components/HeroCarousel';
import { getMenu } from '@/lib/db';
import { headers } from 'next/headers';

// Force dynamic rendering to always get fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
    // Force no-cache headers
    const headersList = await headers();

    // Fetch directly from database to ensure fresh data
    const menu = await getMenu();

    // Select a few items for the carousel
    const featuredItems = menu.slice(0, 5);

    return (
        <>
            <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
            <meta httpEquiv="Pragma" content="no-cache" />
            <meta httpEquiv="Expires" content="0" />

            <main style={{ paddingBottom: '80px', background: '#F9F9F9', minHeight: '100vh' }}>
                <Header />

                <div className="container" style={{ padding: '0 1rem' }}>
                    <HeroCarousel items={featuredItems} />

                    <HomeClient initialMenu={menu} />
                </div>
            </main>
        </>
    );
}
