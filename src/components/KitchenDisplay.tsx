'use client';

import { useState, useEffect } from 'react';
import { Order } from '@/lib/types';

export default function KitchenDisplay() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [prevOrderCount, setPrevOrderCount] = useState(0);

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000); // Poll every 10 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            if (res.ok) {
                const data = await res.json();
                console.log('Fetched orders:', data);

                // Play sound if new orders arrived
                if (data.length > prevOrderCount) {
                    const audio = new Audio('https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3');
                    audio.play().catch(e => console.error("Audio play failed", e));
                }

                setOrders(data);
                setPrevOrderCount(data.length);
            } else {
                console.error('Failed to fetch orders:', res.status, res.statusText);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const updateStatus = async (id: string, status: 'pending' | 'ready' | 'completed' | 'cancelled') => {
        await fetch('/api/orders/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status })
        });
        fetchOrders();
    };

    return (
        <div className="grid">
            {orders.length === 0 && <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888' }}>No active orders</p>}

            {orders.map(order => (
                <div key={order.id} className="card" style={{ borderLeft: `4px solid ${order.status === 'ready' ? '#4CAF50' : order.status === 'cancelled' ? '#F44336' : '#FFC107'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0 }}>#{order.id.slice(-4)}</h3>
                        <span style={{
                            background: order.status === 'ready' ? '#4CAF50' : order.status === 'cancelled' ? '#F44336' : '#FFC107',
                            color: '#000',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                        }}>
                            {order.status}
                        </span>
                    </div>

                    <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{order.customerName}</p>

                    {order.items.some(item => item.id.endsWith('-offer')) && (
                        <div style={{
                            background: 'rgba(220, 20, 60, 0.1)',
                            color: 'var(--primary)',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            marginBottom: '0.5rem',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            border: '1px solid var(--primary)'
                        }}>
                            🔥 Offer Applied
                        </div>
                    )}

                    <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1rem' }}>
                        {order.items.map((item, idx) => (
                            <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', color: item.id.endsWith('-offer') ? 'var(--primary)' : '#ccc' }}>
                                <span>{item.quantity}x {item.name} {item.id.endsWith('-offer') && '(Offer)'}</span>
                            </li>
                        ))}
                    </ul>

                    {order.notes && (
                        <div style={{
                            background: '#333',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            marginBottom: '1rem',
                            fontSize: '0.9rem',
                            color: '#fff',
                            borderLeft: '3px solid #FF5722'
                        }}>
                            <strong>Note:</strong> {order.notes}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                        {order.status === 'pending' && (
                            <>
                                <button
                                    className="btn"
                                    style={{ background: '#4CAF50', color: '#fff', flex: 1 }}
                                    onClick={() => updateStatus(order.id, 'ready')}
                                >
                                    Ready
                                </button>
                                <button
                                    className="btn"
                                    style={{ background: '#F44336', color: '#fff', flex: 1 }}
                                    onClick={() => updateStatus(order.id, 'cancelled')}
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                        {order.status === 'ready' && (
                            <button
                                className="btn"
                                style={{ background: '#2196F3', color: '#fff', width: '100%' }}
                                onClick={() => updateStatus(order.id, 'completed')}
                            >
                                Complete
                            </button>
                        )}
                        {order.status === 'cancelled' && (
                            <>
                                <button
                                    className="btn"
                                    style={{ background: '#FFC107', color: '#000', flex: 1 }}
                                    onClick={() => updateStatus(order.id, 'pending')}
                                >
                                    Uncancel
                                </button>
                                <button
                                    className="btn"
                                    style={{ background: '#607D8B', color: '#fff', flex: 1 }}
                                    onClick={() => updateStatus(order.id, 'completed')}
                                >
                                    Close
                                </button>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
