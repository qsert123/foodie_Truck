export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    available: boolean;
}

export interface LocationData {
    name: string;
    address: string;
    openTime: string;
    closeTime: string;
    isOnline?: boolean;
    coordinates: {
        lat: number;
        lng: number;
    };
    nextOnlineTime?: string;
    phone?: string;
    instagram?: string;
}

export interface SpecialOffer {
    id: string;
    active: boolean;
    title: string;
    description: string;
    itemIds: string[];
    discountPercentage?: number;
    price?: number;
    image?: string;
}

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: string;
    customerName: string;
    items: OrderItem[];
    total: number;
    status: 'pending' | 'ready' | 'completed' | 'cancelled';
    createdAt: string;
    notes?: string;
    deviceId?: string;
    formattedOrderId?: string;
    orderNumber?: number;
    time?: string;
}

export interface DBData {
    menu: MenuItem[];
    location: LocationData;
    orders: Order[];
    offers: SpecialOffer[];
    loginRequests: LoginRequest[];
}

export interface LoginRequest {
    id: string;
    email: string; // The email waiting for approval
    token: string; // Secret token for the link
    status: 'pending' | 'approved' | 'rejected' | 'used';
    createdAt: string;
    expiresAt: number;
    ip?: string;
}
