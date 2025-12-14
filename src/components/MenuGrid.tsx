'use client';

import Image from 'next/image';
import styles from './menu-grid.module.css';
import { MenuItem } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

interface MenuGridProps {
    items: MenuItem[];
}

export default function MenuGrid({ items }: MenuGridProps) {
    const { cart, addToCart, updateQuantity } = useCart();

    const getItemQuantity = (itemId: string) => {
        return cart.find(i => i.item.id === itemId)?.quantity || 0;
    };

    return (
        <div className={styles.grid}>
            {items.map((item, index) => {
                const isAvailable = item.available !== false; // Default to true if undefined
                const quantity = getItemQuantity(item.id);

                return (
                    <div
                        key={item.id}
                        className={`${styles.card} animate-fade-in`}
                        style={{
                            animationDelay: `${index * 100}ms`,
                            background: '#fff',
                            borderRadius: '20px',
                            padding: '1rem',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                            border: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            filter: isAvailable ? 'none' : 'grayscale(100%)',
                            opacity: isAvailable ? 1 : 0.7,
                            position: 'relative',
                            pointerEvents: isAvailable ? 'auto' : 'none'
                        }}
                    >
                        {!isAvailable && (
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                background: 'rgba(0,0,0,0.8)',
                                color: '#fff',
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                zIndex: 10,
                                whiteSpace: 'nowrap',
                                border: '1px solid #fff'
                            }}>
                                OUT OF STOCK
                            </div>
                        )}

                        <div className={styles.imageWrapper} style={{
                            position: 'relative',
                            width: '100%',
                            paddingBottom: '80%', // Aspect ratio
                            borderRadius: '16px',
                            overflow: 'hidden',
                            marginBottom: '1rem'
                        }}>
                            {item.image ? (
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className={styles.image}
                                    style={{ objectFit: 'cover' }}
                                />
                            ) : (
                                <div style={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    background: '#f0f0f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#ccc'
                                }}>
                                    No Image
                                </div>
                            )}
                        </div>

                        <div style={{ flex: 1 }}>
                            <h3 style={{
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                margin: '0 0 0.25rem 0',
                                textAlign: 'left'
                            }}>{item.name}</h3>
                            <p style={{
                                fontSize: '0.75rem',
                                color: '#888',
                                margin: '0 0 1rem 0',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textAlign: 'left'
                            }}>{item.description}</p>
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: 'auto'
                        }}>
                            <span style={{
                                fontSize: '1.1rem',
                                fontWeight: 'bold'
                            }}>₹{item.price.toFixed(2)}</span>

                            {quantity === 0 ? (
                                <button
                                    onClick={() => isAvailable && addToCart(item)}
                                    disabled={!isAvailable}
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: isAvailable ? 'var(--primary)' : '#ccc',
                                        color: '#000',
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold',
                                        boxShadow: isAvailable ? '0 2px 8px rgba(198, 233, 0, 0.4)' : 'none',
                                        cursor: isAvailable ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    +
                                </button>
                            ) : (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    background: '#f5f5f5',
                                    borderRadius: '20px',
                                    padding: '2px 8px'
                                }}>
                                    <button
                                        onClick={() => updateQuantity(item.id, -1)}
                                        style={{ fontWeight: 'bold', fontSize: '1rem' }}
                                    >-</button>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, 1)}
                                        style={{ fontWeight: 'bold', fontSize: '1rem' }}
                                    >+</button>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
