import { useState, useEffect } from 'react';
import { MenuItem } from '@/lib/types';

export function useMenuData(initialData: MenuItem[]) {
    const [menu, setMenu] = useState<MenuItem[]>(initialData);

    useEffect(() => {
        // If we have initial data, set it (useful for client transitions)
        setMenu(initialData);

        const fetchMenu = async () => {
            try {
                // Add timestamp to prevent caching
                const res = await fetch(`/api/menu?t=${Date.now()}`);
                if (res.ok) {
                    const data = await res.json();

                    // Simple deep comparison to avoid unnecessary re-renders
                    // Note: This is a basic optimization. For large datasets, 
                    // we might want a more robust comparison or just rely on React's diffing.
                    setMenu(prev => {
                        const isSame = JSON.stringify(prev) === JSON.stringify(data);
                        return isSame ? prev : data;
                    });
                }
            } catch (error) {
                console.error('Failed to poll menu:', error);
            }
        };

        // Poll every 5 seconds
        const interval = setInterval(fetchMenu, 5000);

        // Also fetch immediately on mount/focus to ensure freshness
        fetchMenu();

        const onFocus = () => fetchMenu();
        window.addEventListener('focus', onFocus);

        return () => {
            clearInterval(interval);
            window.removeEventListener('focus', onFocus);
        };
    }, [initialData]);

    return menu;
}
