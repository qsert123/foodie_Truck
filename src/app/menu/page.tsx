import Navbar from '@/components/Navbar';
import MenuClient from '@/components/MenuClient';
import { getMenu } from '@/lib/db';
import { headers } from 'next/headers';

// Force dynamic rendering to always get fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function MenuPage() {
    // Force no-cache headers
    const headersList = await headers();

    // Fetch directly from database to ensure fresh data
    const menu = await getMenu();

    return (
        <>
            <meta httpEquiv="Expires" content="0" />
            <MenuClient initialMenu={menu} />
        </>
    );
}
