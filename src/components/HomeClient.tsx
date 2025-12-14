'use client';

import { useState } from 'react';
import Categories from '@/components/Categories';
import MenuGrid from '@/components/MenuGrid';
import { MenuItem } from '@/lib/types';
import Link from 'next/link';
import { useMenuData } from '@/hooks/useMenuData';

interface HomeClientProps {
    initialMenu: MenuItem[];
}

export default function HomeClient({ initialMenu }: HomeClientProps) {
    const menu = useMenuData(initialMenu);
    const [activeCategory, setActiveCategory] = useState('burger');

    const filteredItems = menu
        .filter(item => item.available) // Hides unavailable items
        .filter(item => {
            const cat = item.category.toLowerCase();
            if (activeCategory === 'burger') return cat.includes('burger');
            if (activeCategory === 'chicken') return cat.includes('chicken');
            if (activeCategory === 'fries') return cat.includes('fries');
            if (activeCategory === 'drink') return cat.includes('drink') || cat.includes('beverage');
            if (activeCategory === 'other') {
                return !cat.includes('burger') &&
                    !cat.includes('chicken') &&
                    !cat.includes('fries') &&
                    !cat.includes('drink') &&
                    !cat.includes('beverage');
            }
            return true;
        });

    return (
        <>
            {/* Categories */}
            <Categories
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
            />

            {/* Recommended Section */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '1.5rem',
                marginBottom: '1rem'
            }}>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
                    {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}s
                </h3>
                <Link href="/" style={{ color: '#888', fontSize: '0.9rem' }}>See More</Link>
            </div>

            <MenuGrid items={filteredItems} />
        </>
    );
}
