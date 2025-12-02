'use client';

import { useState } from 'react';

const categories = [
    { id: 'burger', name: 'Burger', icon: '🍔' },
    { id: 'chicken', name: 'Chicken', icon: '🍗' },
    { id: 'fries', name: 'Fries', icon: '🍟' },
    { id: 'drink', name: 'Drink', icon: '🥤' },
    { id: 'other', name: 'Other', icon: '🍽️' },
];

interface CategoriesProps {
    activeCategory: string;
    onSelectCategory: (id: string) => void;
}

export default function Categories({ activeCategory, onSelectCategory }: CategoriesProps) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '1rem',
            gap: '1rem'
        }}>
            {categories.map(cat => (
                <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.id)}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: activeCategory === cat.id ? 'var(--primary)' : '#fff',
                        border: 'none',
                        borderRadius: '16px',
                        padding: '1rem 0.5rem',
                        flex: 1,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                    }}
                >
                    <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
                    <span style={{
                        fontSize: '0.8rem',
                        fontWeight: activeCategory === cat.id ? 'bold' : 'normal',
                        color: '#000'
                    }}>{cat.name}</span>
                </button>
            ))}
        </div>
    );
}
