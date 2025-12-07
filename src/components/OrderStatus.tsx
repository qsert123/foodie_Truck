'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Order } from '@/lib/types';

export default function OrderStatus() {
    const [notifications, setNotifications] = useState<Order[]>([]);
    const [closedOrders, setClosedOrders] = useState<string[]>([]);
    const notifiedOrdersRef = useRef<Set<string>>(new Set());
    const pathname = usePathname();

    useEffect(() => {
        // Request notification permission
        if (typeof window !== 'undefined' && 'Notification' in window) {
            Notification.requestPermission();
        }

        const fetchStatus = async () => {
            const res = await fetch('/api/orders');
            if (res.ok) {
                const data: Order[] = await res.json();
                const activeNotifications = data.filter(o => o.status === 'ready' || o.status === 'cancelled');

                // Get current device ID
                const currentDeviceId = localStorage.getItem('street_bites_device_id');

                // Filter notifications for this device
                const myNotifications = activeNotifications.filter(o => {
                    // If order has no device ID (legacy), maybe show it? Or better safe than sorry: only show matches.
                    // For now, let's only show explicit matches to avoid spamming everyone.
                    return o.deviceId && o.deviceId === currentDeviceId;
                });

                setNotifications(myNotifications);

                // Check for new ready orders to notify
                myNotifications.forEach(order => {
                    if (order.status === 'ready' && !notifiedOrdersRef.current.has(order.id)) {
                        // Mark as notified
                        notifiedOrdersRef.current.add(order.id);

                        // Play Sound
                        playNotificationSound();

                        // System Notification
                        if (Notification.permission === 'granted') {
                            new Notification("Order Ready!", {
                                body: `Your order is ready! Please get it from the truck.`,
                                icon: '/images/burger.png'
                            });
                        }
                    }
                });
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 5000);
        return () => clearInterval(interval);
    }, []);

    const playNotificationSound = () => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;

            const audioCtx = new AudioContext();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(500, audioCtx.currentTime); // 500Hz beep
            oscillator.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.1); // Chirp up

            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.5);
        } catch (e) {
            console.error("Audio playback failed", e);
        }
    };

    const handleClose = (id: string) => {
        setClosedOrders(prev => [...prev, id]);
    };

    // Don't show on admin or kitchen pages
    if (pathname.startsWith('/admin') || pathname === '/kitchen') {
        return null;
    }

    const visibleOrders = notifications.filter(o => !closedOrders.includes(o.id));

    // Auto-dismiss after 30 seconds
    useEffect(() => {
        if (visibleOrders.length > 0) {
            const timer = setTimeout(() => {
                setClosedOrders(prev => [...prev, ...visibleOrders.map(o => o.id)]);
            }, 30000);
            return () => clearTimeout(timer);
        }
    }, [visibleOrders]);

    if (visibleOrders.length === 0) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.7)', // Dim background
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
        }}>
            <div className="card animate-scale-in" style={{
                border: '2px solid var(--primary)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                maxWidth: '400px',
                width: '90%',
                pointerEvents: 'auto',
                padding: '2rem'
            }}>
                <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1.8rem' }}>
                    <span style={{ fontSize: '2rem' }}>🔔</span> Order Update!
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {visibleOrders.map(order => (
                        <div key={order.id} style={{
                            background: 'var(--surface-hover)',
                            padding: '1rem',
                            borderRadius: '8px',
                            textAlign: 'center',
                            border: `2px solid ${order.status === 'ready' ? '#4CAF50' : '#F44336'}`
                        }}>
                            <div style={{
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                color: order.status === 'ready' ? '#4CAF50' : '#F44336',
                                textTransform: 'uppercase',
                                marginBottom: '0.5rem'
                            }}>
                                {order.status === 'ready' ? 'Ready! Get it from the truck' : 'Order Cancelled'}
                            </div>
                            <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                                {order.customerName}
                            </div>
                            <button
                                onClick={() => handleClose(order.id)}
                                className="btn btn-primary"
                                style={{ width: '100%' }}
                            >
                                Got it!
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
