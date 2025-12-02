import Navbar from '@/components/Navbar';
import MenuGrid from '@/components/MenuGrid';
import { getMenu } from '@/lib/db';

export default async function MenuPage() {
    const menu = await getMenu();

    // Group by category
    const categories = Array.from(new Set(menu.map(item => item.category)));

    return (
        <main>
            <Navbar />
            <div style={{ paddingTop: '100px' }} className="container section">
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary)' }}>Our Menu</h1>


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
