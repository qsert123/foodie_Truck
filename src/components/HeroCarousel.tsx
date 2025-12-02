'use client';

import { useState, useEffect } from 'react';
import { MenuItem } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';

interface HeroCarouselProps {
    items: MenuItem[];
}

export default function HeroCarousel({ items }: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            handleNext();
        }, 4000); // Change every 4 seconds

        return () => clearInterval(interval);
    }, [currentIndex]);

    const handleNext = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
            setIsAnimating(false);
        }, 500); // Wait for exit animation
    };

    const currentItem = items[currentIndex];

    if (!currentItem) return null;

    return (
        <div style={{
            background: '#1a1a1a',
            borderRadius: '24px',
            padding: '1.5rem',
            color: '#fff',
            marginTop: '1rem',
            marginBottom: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: '180px'
        }}>
            <div
                style={{
                    zIndex: 2,
                    maxWidth: '60%',
                    opacity: isAnimating ? 0 : 1,
                    transform: isAnimating ? 'translateX(-20px)' : 'translateX(0)',
                    transition: 'all 0.5s ease-in-out'
                }}
            >
                <h2 style={{
                    fontSize: '1.5rem',
                    lineHeight: '1.2',
                    marginBottom: '0.5rem',
                    textAlign: 'left'
                }}>
                    {currentItem.name}
                </h2>
                <p style={{
                    fontSize: '1.2rem',
                    color: 'var(--primary)',
                    marginBottom: '0.5rem',
                    fontWeight: 'bold'
                }}>
                    ₹{currentItem.price}
                </p>
                <p style={{
                    fontSize: '0.8rem',
                    color: '#ccc',
                    marginBottom: '1rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {currentItem.description}
                </p>

            </div>

            <div
                style={{
                    position: 'absolute',
                    right: '-20px',
                    top: '50%',
                    transform: `translateY(-50%) ${isAnimating ? 'translateX(20px) scale(0.9)' : 'translateX(0) scale(1)'}`,
                    width: '160px',
                    height: '160px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '4px solid rgba(255,255,255,0.1)',
                    opacity: isAnimating ? 0 : 1,
                    transition: 'all 0.5s ease-in-out'
                }}
            >
                <div style={{ width: '100%', height: '100%', background: '#333', position: 'relative' }}>
                    <Image
                        src={currentItem.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60'}
                        alt={currentItem.name}
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                </div>
            </div>

            {/* Progress Indicators */}
            <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '5px',
                zIndex: 3
            }}>
                {items.map((_, idx) => (
                    <div
                        key={idx}
                        style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: idx === currentIndex ? 'var(--primary)' : 'rgba(255,255,255,0.3)',
                            transition: 'background 0.3s'
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
