'use client';

import { useState, useEffect } from 'react';
import { MenuItem, LocationData } from '@/lib/types';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'menu' | 'location' | 'offer' | 'stats'>('menu');
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const [location, setLocation] = useState<LocationData | null>(null);
    const [offers, setOffers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Menu Form State
    const [editingItem, setEditingItem] = useState<Partial<MenuItem>>({});
    const [isEditing, setIsEditing] = useState(false);

    // Offer Form State
    const [editingOffer, setEditingOffer] = useState<any>(null);
    const [isEditingOffer, setIsEditingOffer] = useState(false);

    useEffect(() => {
        fetchData();
        // Trigger auto-cleanup of old orders
        fetch('/api/admin/cleanup', { method: 'POST' }).catch(console.error);
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const [menuRes, locRes, offerRes] = await Promise.all([
            fetch('/api/menu'),
            fetch('/api/location'),
            fetch('/api/offer')
        ]);
        const menuData = await menuRes.json();
        const locData = await locRes.json();
        const offersData = await offerRes.json();
        setMenu(menuData);
        setLocation(locData);
        setOffers(offersData);
        setLoading(false);
    };

    const handleDownloadReport = async () => {
        try {
            const res = await fetch('/api/admin/reports');
            if (!res.ok) throw new Error('Failed to fetch report');

            const data = await res.json();
            const orders = data.orders || [];

            if (orders.length === 0) {
                alert('No orders found for this week.');
                return;
            }

            // 1. Identify all unique item names across all orders to build dynamic columns
            const allItemNames = new Set<string>();
            orders.forEach((o: any) => {
                o.items.forEach((i: any) => allItemNames.add(i.name));
            });
            // Sort item columns alphabetically for consistency
            const itemColumns = Array.from(allItemNames).sort();

            // 2. Create Headers
            const headers = ['Order ID', 'Date', 'Time', 'Customer Name', ...itemColumns, 'Total Amount'];

            // 3. Map orders to rows
            const rows = orders.map((o: any) => {
                const dateObj = new Date(o.createdAt);
                const dateStr = dateObj.toLocaleDateString();
                const timeStr = dateObj.toLocaleTimeString();

                // Create a map for this order's items for quick lookup
                const itemMap = new Map();
                o.items.forEach((i: any) => {
                    itemMap.set(i.name, i.quantity);
                });

                // Build the row
                const rowData = [
                    o.formattedOrderId || o.id,
                    dateStr,
                    timeStr,
                    `"${o.customerName.replace(/"/g, '""')}"`, // Escape quotes
                    ...itemColumns.map(itemName => itemMap.get(itemName) || ''), // Quantity or empty
                    o.total
                ];

                return rowData.join(',');
            });

            // 4. Combine headers and rows
            const csvContent = [
                headers.join(','),
                ...rows
            ].join('\n');

            // 5. Download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `weekly_sales_report_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error(error);
            alert('Failed to download report');
        }
    };

    const handleDeleteCategory = async (category: string) => {
        if (!confirm(`Warning: This will delete ALL items in the category "${category}".\nThis action cannot be undone.\n\nAre you sure?`)) return;

        try {
            const res = await fetch(`/api/admin/categories?category=${encodeURIComponent(category)}`, { method: 'DELETE' });
            if (res.ok) {
                alert(`Category "${category}" deleted.`);
                fetchData();
            } else {
                alert('Failed to delete category.');
            }
        } catch (error) {
            console.error(error);
            alert('Error deleting category.');
        }
    };

    const handleClearAllOrders = async () => {
        if (!confirm('DANGER: This will delete ALL order history from the database.\nThis action cannot be undone.\n\nAre you sure you want to proceed?')) return;

        try {
            const res = await fetch('/api/admin/cleanup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ days: 0 }) // 0 days means delete all
            });
            if (res.ok) {
                const data = await res.json();
                alert(`✅ Successfully deleted ${data.deletedCount} orders.`);
                fetchData();
            } else {
                alert('❌ Failed to delete orders.');
            }
        } catch (error) {
            console.error(error);
            alert('❌ Error deleting orders.');
        }
    };

    const handleSaveItem = async (e: React.FormEvent) => {
        e.preventDefault();
        const item = {
            ...editingItem,
            id: editingItem.id || Date.now().toString(),
            price: Number(editingItem.price),
            available: editingItem.available ?? true
        };

        await fetch('/api/admin/menu', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });

        setIsEditing(false);
        setEditingItem({});
        fetchData();
    };

    const handleDeleteItem = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            const res = await fetch(`/api/admin/menu?id=${id}`, { method: 'DELETE' });

            if (res.ok) {
                alert('✅ Item deleted successfully!');
                fetchData();
            } else {
                const error = await res.json();
                alert(`❌ Failed to delete: ${error.error || 'Unknown error'}`);
            }
        } catch (err) {
            console.error('Delete error:', err);
            alert('❌ Failed to delete item. Check console for details.');
        }
    };

    const handleSaveLocation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!location) return;

        await fetch('/api/admin/location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(location)
        });
        alert('Location updated!');
    };

    const handleSaveOffer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingOffer) return;

        const offerToSave = {
            ...editingOffer,
            id: editingOffer.id || Date.now().toString(),
            active: editingOffer.active ?? true,
            itemIds: editingOffer.itemIds || [],
            price: editingOffer.price ? Number(editingOffer.price) : undefined,
            discountPercentage: editingOffer.discountPercentage ? Number(editingOffer.discountPercentage) : undefined,
            image: editingOffer.image || undefined
        };

        await fetch('/api/admin/offer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(offerToSave)
        });

        setIsEditingOffer(false);
        setEditingOffer(null);
        fetchData();
    };

    const handleDeleteOffer = async (id: string) => {
        if (!confirm('Delete this offer?')) return;
        await fetch(`/api/admin/offer?id=${id}`, { method: 'DELETE' });
        fetchData();
    };

    const toggleOfferItem = (itemId: string) => {
        if (!editingOffer) return;
        const currentIds = editingOffer.itemIds || [];
        const newIds = currentIds.includes(itemId)
            ? currentIds.filter((id: string) => id !== itemId)
            : [...currentIds, itemId];
        setEditingOffer({ ...editingOffer, itemIds: newIds });
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    className={`btn ${activeTab === 'menu' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveTab('menu')}
                >
                    Manage Menu
                </button>
                <button
                    className={`btn ${activeTab === 'offer' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveTab('offer')}
                >
                    Special Offers
                </button>
                <button
                    className={`btn ${activeTab === 'stats' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveTab('stats')}
                >
                    Stats & Reports
                </button>

                <a
                    href="/"
                    target="_blank"
                    className="btn btn-secondary"
                    style={{ marginLeft: 'auto' }}
                >
                    Preview Menu ↗
                </a>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Store Status</h2>
                {location ? (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{
                                    color: location.isOnline !== false ? '#4CAF50' : '#F44336',
                                    fontWeight: 'bold'
                                }}>
                                    {location.isOnline !== false ? 'ONLINE' : 'OFFLINE'}
                                </span>
                                <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
                                    <input
                                        type="checkbox"
                                        checked={location.isOnline !== false}
                                        onChange={async (e) => {
                                            const newStatus = e.target.checked;
                                            const newLocation = { ...location, isOnline: newStatus };
                                            setLocation(newLocation);

                                            await fetch('/api/admin/location', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify(newLocation)
                                            });
                                        }}
                                        style={{ opacity: 0, width: 0, height: 0 }}
                                    />
                                    <span style={{
                                        position: 'absolute',
                                        cursor: 'pointer',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: location.isOnline !== false ? '#4CAF50' : '#ccc',
                                        transition: '.4s',
                                        borderRadius: '34px'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            content: '""',
                                            height: '26px',
                                            width: '26px',
                                            left: location.isOnline !== false ? '30px' : '4px',
                                            bottom: '4px',
                                            backgroundColor: 'white',
                                            transition: '.4s',
                                            borderRadius: '50%'
                                        }} />
                                    </span>
                                </label>
                            </div>
                        </div>
                        {location.isOnline === false && (
                            <div style={{ marginTop: '1rem', padding: '1rem', background: '#222', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #444' }}>
                                <span style={{ color: '#FFC107', fontWeight: 'bold' }}>🕒 Back at:</span>
                                <input
                                    value={location.nextOnlineTime || ''}
                                    onChange={(e) => setLocation({ ...location, nextOnlineTime: e.target.value })}
                                    placeholder="e.g. 5:00 PM Today"
                                    style={{ padding: '0.5rem', flex: 1, borderRadius: '4px', border: '1px solid #555', background: '#333', color: '#fff' }}
                                />
                                <button
                                    className="btn btn-primary"
                                    onClick={async () => {
                                        await fetch('/api/admin/location', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify(location)
                                        });
                                        alert('Status updated!');
                                    }}
                                >
                                    Save
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <p>Loading location...</p>
                )}
            </div>

            {activeTab === 'menu' && (
                <div>
                    <button
                        className="btn btn-primary"
                        style={{ marginBottom: '1rem' }}
                        onClick={() => { setIsEditing(true); setEditingItem({}); }}
                    >
                        Add New Item
                    </button>

                    {isEditing && (
                        <form onSubmit={handleSaveItem} className="card" style={{ marginBottom: '2rem' }}>
                            <h3>{editingItem.id ? 'Edit Item' : 'New Item'}</h3>
                            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                                <input
                                    placeholder="Name"
                                    value={editingItem.name || ''}
                                    onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                                    required
                                    style={{ padding: '0.5rem' }}
                                />
                                <textarea
                                    placeholder="Description"
                                    value={editingItem.description || ''}
                                    onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                                    required
                                    style={{ padding: '0.5rem' }}
                                />
                                <input
                                    type="number"
                                    placeholder="Price"
                                    value={editingItem.price || ''}
                                    onChange={e => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                                    required
                                    style={{ padding: '0.5rem' }}
                                />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <select
                                        value={menu.some(i => i.category === editingItem.category) ? editingItem.category : 'new'}
                                        onChange={e => {
                                            if (e.target.value === 'new') {
                                                setEditingItem({ ...editingItem, category: '' });
                                            } else {
                                                setEditingItem({ ...editingItem, category: e.target.value });
                                            }
                                        }}
                                        style={{ padding: '0.5rem' }}
                                    >
                                        <option value="" disabled>Select Category</option>
                                        {Array.from(new Set(menu.map(item => item.category))).map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                        <option value="new">+ Create New Category</option>
                                    </select>
                                    {(!editingItem.category || !menu.some(i => i.category === editingItem.category)) && (
                                        <input
                                            placeholder="Enter New Category Name"
                                            value={editingItem.category || ''}
                                            onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                                            required
                                            style={{ padding: '0.5rem' }}
                                        />
                                    )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Image</label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input
                                            placeholder="Paste image URL (Google Drive, ImgBB, etc.) or upload below"
                                            value={editingItem.image || ''}
                                            onChange={e => setEditingItem({ ...editingItem, image: e.target.value })}
                                            style={{ padding: '0.5rem', flex: 1 }}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => {
                                                const url = editingItem.image || '';
                                                // Check if it's a Google Drive link
                                                const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
                                                if (driveMatch) {
                                                    const fileId = driveMatch[1];
                                                    const directUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
                                                    setEditingItem({ ...editingItem, image: directUrl });
                                                    alert('✅ Converted to direct Google Drive link!');
                                                } else if (url.includes('drive.google.com')) {
                                                    alert('❌ Invalid Google Drive link format. Make sure it contains /file/d/FILE_ID/');
                                                } else {
                                                    alert('ℹ️ This is not a Google Drive link. No conversion needed.');
                                                }
                                            }}
                                            style={{ whiteSpace: 'nowrap' }}
                                        >
                                            🔄 Convert Drive Link
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <label className="btn btn-secondary" style={{ cursor: 'pointer', margin: 0 }}>
                                            📤 Upload to Firebase
                                            <input
                                                type="file"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;

                                                    const formData = new FormData();
                                                    formData.append('file', file);

                                                    try {
                                                        const res = await fetch('/api/upload', {
                                                            method: 'POST',
                                                            body: formData
                                                        });
                                                        if (res.ok) {
                                                            const data = await res.json();
                                                            setEditingItem(prev => ({ ...prev, image: data.url }));
                                                            alert('Image uploaded successfully!');
                                                        } else {
                                                            alert('Upload failed');
                                                        }
                                                    } catch (err) {
                                                        console.error(err);
                                                        alert('Upload failed');
                                                    }
                                                }}
                                            />
                                        </label>
                                        <span style={{ fontSize: '0.8rem', color: '#888' }}>or paste URL above</span>
                                    </div>
                                    {editingItem.image && (
                                        <div style={{ marginTop: '0.5rem' }}>
                                            <p style={{ fontSize: '0.8rem', color: '#888', margin: '0 0 0.5rem 0' }}>Preview:</p>
                                            <img
                                                src={editingItem.image}
                                                alt="Preview"
                                                style={{
                                                    maxWidth: '200px',
                                                    maxHeight: '200px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #333'
                                                }}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input
                                        type="checkbox"
                                        checked={editingItem.available ?? true}
                                        onChange={e => setEditingItem({ ...editingItem, available: e.target.checked })}
                                    />
                                    Available / In Stock
                                </label>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button type="submit" className="btn btn-primary">Save</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                                </div>
                            </div>
                        </form>
                    )}

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {menu.map(item => (
                            <div key={item.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4>{item.name}</h4>
                                    <p>₹{item.price}</p>
                                    {!item.available && <span style={{ color: 'red', fontSize: '0.8rem', fontWeight: 'bold' }}>OUT OF STOCK</span>}
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn btn-secondary" onClick={() => { setEditingItem(item); setIsEditing(true); }}>Edit</button>
                                    <button className="btn btn-secondary" style={{ borderColor: 'red', color: 'red' }} onClick={() => handleDeleteItem(item.id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}



            {activeTab === 'offer' && (
                <div>
                    {/* ... (existing offer content) ... */}
                    <button
                        className="btn btn-primary"
                        style={{ marginBottom: '1rem' }}
                        onClick={() => { setIsEditingOffer(true); setEditingOffer({}); }}
                    >
                        Add New Offer
                    </button>

                    {isEditingOffer && (
                        <form onSubmit={handleSaveOffer} className="card" style={{ marginBottom: '2rem' }}>
                            {/* ... form content ... */}
                            <h3>{editingOffer.id ? 'Edit Offer' : 'New Offer'}</h3>
                            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Heading</label>
                                    <input
                                        placeholder="e.g. Today's Special"
                                        value={editingOffer.title || ''}
                                        onChange={e => setEditingOffer({ ...editingOffer, title: e.target.value })}
                                        required
                                        style={{ padding: '0.5rem', width: '100%' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Discount Percentage</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 20"
                                        value={editingOffer.discountPercentage || ''}
                                        onChange={e => setEditingOffer({ ...editingOffer, discountPercentage: e.target.value })}
                                        style={{ padding: '0.5rem', width: '100%' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Content</label>
                                    <textarea
                                        placeholder="Type the details here..."
                                        value={editingOffer.description || ''}
                                        onChange={e => setEditingOffer({ ...editingOffer, description: e.target.value })}
                                        required
                                        rows={4}
                                        style={{ padding: '0.5rem', width: '100%' }}
                                    />
                                </div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input
                                        type="checkbox"
                                        checked={editingOffer.active ?? true}
                                        onChange={e => setEditingOffer({ ...editingOffer, active: e.target.checked })}
                                    />
                                    Active / Visible
                                </label>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button type="submit" className="btn btn-primary">Save Offer</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setIsEditingOffer(false)}>Cancel</button>
                                </div>
                            </div>
                        </form>
                    )}

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {offers.map(offer => (
                            <div key={offer.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {offer.title}
                                        {!offer.active && <span style={{ fontSize: '0.7rem', background: '#333', padding: '2px 6px', borderRadius: '4px' }}>INACTIVE</span>}
                                    </h4>
                                    <p style={{ fontSize: '0.9rem', color: '#888', whiteSpace: 'pre-wrap' }}>{offer.description}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn btn-secondary" onClick={() => { setEditingOffer(offer); setIsEditingOffer(true); }}>Edit</button>
                                    <button className="btn btn-secondary" style={{ borderColor: 'red', color: 'red' }} onClick={() => handleDeleteOffer(offer.id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'stats' && (
                <div className="card">
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Weekly Reports & Stats</h2>

                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Weekly Orders</h3>
                        <p style={{ color: '#888', marginBottom: '1rem' }}>Download a CSV report of all orders from the last 7 days. Orders older than 7 days are automatically deleted.</p>
                        <button className="btn btn-primary" onClick={handleDownloadReport}>
                            📥 Download Weekly CSV Report
                        </button>
                    </div>

                    <div style={{ borderTop: '1px solid #333', paddingTop: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem', color: '#F44336' }}>Danger Zone</h3>

                        <div style={{ marginBottom: '2rem' }}>
                            <p style={{ color: '#888', marginBottom: '0.5rem' }}>Delete all order history from the database. This is useful for clearing test data.</p>
                            <button
                                className="btn btn-secondary"
                                style={{ borderColor: 'red', color: 'red', fontWeight: 'bold' }}
                                onClick={handleClearAllOrders}
                            >
                                🗑️ Clear All Order History
                            </button>
                        </div>

                        <h4 style={{ marginBottom: '1rem', color: '#F44336' }}>Delete Category</h4>
                        <p style={{ color: '#888', marginBottom: '1rem' }}>Deleting a category will <strong>permanently delete all menu items</strong> within it.</p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                            {Array.from(new Set(menu.map(item => item.category))).map(cat => (
                                <div key={cat} style={{ background: '#222', padding: '1rem', borderRadius: '8px', border: '1px solid #444', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{ fontWeight: 'bold' }}>{cat}</span>
                                    <button
                                        className="btn btn-secondary"
                                        style={{ borderColor: 'red', color: 'red', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                        onClick={() => handleDeleteCategory(cat)}
                                    >
                                        Delete Category
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
