'use client';

import { useState, useEffect } from 'react';
import { MenuItem } from '@/lib/types';
import { useCart } from '@/context/CartContext';

interface OrderFormProps {
    menu: MenuItem[];
}

export default function OrderForm({ menu }: OrderFormProps) {
    const { cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, appliedOffer, removeOffer } = useCart();
    const [name, setName] = useState('');
    const [notes, setNotes] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const [lastOrderTotal, setLastOrderTotal] = useState(0);
    const [lastOrderId, setLastOrderId] = useState('');

    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        const savedName = localStorage.getItem('street_bites_user_name');
        if (savedName) setName(savedName);

        // Ensure user has a device ID
        let deviceId = localStorage.getItem('street_bites_device_id');
        if (!deviceId) {
            deviceId = crypto.randomUUID();
            localStorage.setItem('street_bites_device_id', deviceId);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) return;
        setShowConfirmation(true);
    };

    const confirmOrder = async () => {
        localStorage.setItem('street_bites_user_name', name);
        const deviceId = localStorage.getItem('street_bites_device_id');

        const orderItems = cart.map(i => ({
            id: i.item.id,
            name: i.item.name,
            price: i.item.price,
            quantity: i.quantity
        }));

        const currentTotal = cartTotal;

        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customerName: name,
                items: orderItems,
                total: currentTotal,
                notes,
                deviceId
            })
        });

        if (res.ok) {
            const data = await res.json();
            setLastOrderTotal(currentTotal);
            if (data.order && data.order.formattedOrderId) {
                setLastOrderId(data.order.formattedOrderId);
            }
            setSubmitted(true);
            clearCart();
            setName('');
            setNotes('');
            setShowConfirmation(false);
        }
    };

    if (submitted) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Order Placed!</h2>
                {lastOrderId && (
                    <h3 style={{ color: 'var(--primary)', fontSize: '2rem', marginBottom: '1rem', border: '2px dashed var(--primary)', display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                        Order #{lastOrderId}
                    </h3>
                )}
                <div style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
                    <p style={{ marginBottom: '0.5rem' }}>Total to Pay: <strong style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>₹{lastOrderTotal}</strong></p>
                    <p style={{ color: '#888', fontSize: '1rem' }}>Please pick up your order from the truck and pay cash.</p>
                </div>
                <p>We will notify or call your name when the food is ready.</p>
                <button className="btn btn-secondary" style={{ marginTop: '2rem' }} onClick={() => setSubmitted(false)}>Place Another Order</button>
            </div>
        );
    }

    return (
        <div className="order-form-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="card" style={{ marginTop: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2 style={{ margin: 0 }}>Your Order</h2>
                    {cart.length > 0 && (
                        <a href="/" className="btn btn-secondary" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                            + Add More Items
                        </a>
                    )}
                </div>

                {cart.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <p style={{ color: '#888', marginBottom: '1rem' }}>Your cart is empty</p>
                        <a href="/" className="btn btn-primary">Browse Menu</a>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {appliedOffer && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(220, 20, 60, 0.1)', borderRadius: '8px', border: '1px solid var(--primary)' }}>
                                <div>
                                    <div style={{ fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.25rem' }}>🔥 Offer Applied: {appliedOffer.title}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#888' }}>{appliedOffer.description}</div>
                                </div>
                                <button
                                    onClick={removeOffer}
                                    style={{ color: 'red', background: 'none', fontSize: '1.5rem', cursor: 'pointer', padding: '0.5rem' }}
                                    aria-label="Remove offer"
                                >
                                    &times;
                                </button>
                            </div>
                        )}
                        {cart.map(({ item, quantity }) => {
                            const isDiscounted = appliedOffer && appliedOffer.itemIds && appliedOffer.itemIds.includes(item.id);
                            const originalPrice = item.price;
                            const discountedPrice = isDiscounted ? originalPrice * (1 - (appliedOffer.discountPercentage || 0) / 100) : originalPrice;

                            return (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', gap: '0.5rem', flexWrap: 'wrap', padding: '1rem', background: 'var(--surface-hover)', borderRadius: '8px' }}>
                                    <div style={{ flex: 1, minWidth: '120px' }}>
                                        <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{item.name}</div>
                                        <div>
                                            {isDiscounted ? (
                                                <>
                                                    <span style={{ textDecoration: 'line-through', color: '#888', marginRight: '0.5rem' }}>₹{originalPrice}</span>
                                                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>₹{discountedPrice.toFixed(2)}</span>
                                                </>
                                            ) : (
                                                <span style={{ color: '#888' }}>₹{originalPrice} each</span>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            style={{ background: '#333', color: '#fff', width: '32px', height: '32px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}
                                        >
                                            -
                                        </button>
                                        <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: 'bold' }}>{quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            style={{ background: '#333', color: '#fff', width: '32px', height: '32px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            style={{ color: 'red', background: 'none', marginLeft: '0.5rem', fontSize: '1.5rem' }}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        <div style={{ borderTop: '2px solid var(--primary)', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.5rem' }}>
                            <span>Total</span>
                            <span style={{ color: 'var(--primary)' }}>₹{cartTotal}</span>
                        </div>

                        <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Your Name</label>
                                <input
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: '#2C2C2C', border: '1px solid #333', color: '#fff' }}
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Special Instructions / Notes</label>
                                <textarea
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: '#2C2C2C', border: '1px solid #333', color: '#fff', minHeight: '80px' }}
                                    placeholder="E.g. No onions, extra sauce..."
                                />
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}>
                                Place Order - ₹{cartTotal}
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {showConfirmation && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.8)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div className="card animate-scale-in" style={{ maxWidth: '400px', width: '90%', padding: '2rem', textAlign: 'center', border: '2px solid var(--primary)' }}>
                        <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Confirm Order?</h3>
                        <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>Total Amount: <strong style={{ color: 'var(--primary)' }}>₹{cartTotal}</strong></p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="btn"
                                style={{ background: '#333', color: '#fff' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmOrder}
                                className="btn btn-primary"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
