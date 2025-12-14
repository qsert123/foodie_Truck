import { db, isFirebaseInitialized } from './firebase';
import { collection, getDocs, doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc, query, where, writeBatch, runTransaction } from 'firebase/firestore';
import { Order, MenuItem, LocationData, SpecialOffer, DBData, LoginRequest } from './types';
export type { Order, MenuItem, LocationData, SpecialOffer, DBData, LoginRequest };
import fs from 'fs/promises';
import path from 'path';

// Collection Names
const COL_MENU = 'menu';
const COL_ORDERS = 'orders';
const COL_OFFERS = 'offers';
const COL_SETTINGS = 'settings';
const DOC_LOCATION = 'location';

// Helper to convert Firestore doc to object
const docToData = (doc: any) => ({ id: doc.id, ...doc.data() });

// --- Migration / Seeding ---
const dataPath = path.join(process.cwd(), 'src/lib/data.json');

async function getLocalData(): Promise<DBData | null> {
    try {
        const data = await fs.readFile(dataPath, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        console.error("Failed to read local data.json", e);
        return null;
    }
}

export async function seedFromLocal(): Promise<void> {
    if (!isFirebaseInitialized) return;
    const localData = await getLocalData();
    if (!localData) return;

    const batch = writeBatch(db);

    // Seed Menu
    localData.menu.forEach(item => {
        const ref = doc(db, COL_MENU, item.id);
        batch.set(ref, item);
    });

    // Seed Location
    const locRef = doc(db, COL_SETTINGS, DOC_LOCATION);
    batch.set(locRef, localData.location);

    // Seed Offers
    localData.offers.forEach(offer => {
        const ref = doc(db, COL_OFFERS, offer.id);
        batch.set(ref, offer);
    });

    await batch.commit();
    console.log("Database seeded from local JSON");
}

// --- Menu Functions ---
export async function getMenu(): Promise<MenuItem[]> {
    console.log('[getMenu] Starting...');
    console.log('[getMenu] Firebase initialized:', isFirebaseInitialized);

    if (!isFirebaseInitialized) {
        console.warn('[getMenu] Firebase NOT initialized - using local data');
        const local = await getLocalData();
        return local?.menu || [];
    }

    try {
        console.log('[getMenu] Fetching from Firebase...');
        const snapshot = await getDocs(collection(db, COL_MENU));
        console.log('[getMenu] Firebase returned', snapshot.size, 'items');

        if (snapshot.empty) {
            console.warn('[getMenu] Firebase collection is empty - seeding...');
            await seedFromLocal();
            const retry = await getDocs(collection(db, COL_MENU));
            console.log('[getMenu] After seeding:', retry.size, 'items');
            return retry.docs.map(d => d.data() as MenuItem);
        }

        const items = snapshot.docs.map(d => d.data() as MenuItem);
        console.log('[getMenu] Successfully fetched', items.length, 'items from Firebase');
        return items;
    } catch (e) {
        console.error('[getMenu] Firebase error:', e);
        console.error('[getMenu] Error details:', JSON.stringify(e, null, 2));

        // Instead of silently falling back, throw the error so we can see what's wrong
        throw new Error(`Failed to fetch menu from Firebase: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
}

export async function saveMenuItem(item: MenuItem): Promise<void> {
    if (!isFirebaseInitialized) throw new Error("Firebase not configured");
    const ref = doc(db, COL_MENU, item.id);
    await setDoc(ref, item);
}

export async function deleteMenuItem(id: string): Promise<void> {
    if (!isFirebaseInitialized) throw new Error("Firebase not configured");
    await deleteDoc(doc(db, COL_MENU, id));
}

export async function deleteCategory(categoryName: string): Promise<void> {
    if (!isFirebaseInitialized) throw new Error("Firebase not configured");

    const batch = writeBatch(db);
    const q = query(collection(db, COL_MENU), where("category", "==", categoryName));
    const snapshot = await getDocs(q);

    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });

    await batch.commit();
}

export async function cleanOldOrders(days: number = 7): Promise<number> {
    if (!isFirebaseInitialized) return 0;

    // Calculate cutoff date
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffISO = cutoffDate.toISOString();

    const q = query(collection(db, COL_ORDERS), where("createdAt", "<", cutoffISO));
    const snapshot = await getDocs(q);

    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });

    await batch.commit();
    return snapshot.size;
}

// --- Order Functions ---
export async function getOrders(): Promise<Order[]> {
    if (!isFirebaseInitialized) {
        const local = await getLocalData();
        return local?.orders || [];
    }
    const snapshot = await getDocs(collection(db, COL_ORDERS));
    return snapshot.docs.map(d => d.data() as Order);
}

export async function addOrder(order: Order): Promise<void> {
    if (!isFirebaseInitialized) throw new Error("Firebase not configured");
    const ref = doc(db, COL_ORDERS, order.id);
    await setDoc(ref, order);
}

export async function updateOrder(order: Order): Promise<void> {
    if (!isFirebaseInitialized) throw new Error("Firebase not configured");
    const ref = doc(db, COL_ORDERS, order.id);
    await setDoc(ref, order, { merge: true });
}

export async function updateOrderStatus(id: string, status: string): Promise<void> {
    if (!isFirebaseInitialized) throw new Error("Firebase not configured");
    const ref = doc(db, COL_ORDERS, id);
    await updateDoc(ref, { status });
}

// --- Location Functions ---
export async function getLocation(): Promise<LocationData> {
    if (!isFirebaseInitialized) {
        const local = await getLocalData();
        if (!local) throw new Error("No local data");
        return local.location;
    }
    try {
        const ref = doc(db, COL_SETTINGS, DOC_LOCATION);
        const snap = await getDoc(ref);
        if (snap.exists()) {
            return snap.data() as LocationData;
        }
        // Fallback or seed
        const local = await getLocalData();
        if (local) {
            await setDoc(ref, local.location);
            return local.location;
        }
        throw new Error("Location data not found");
    } catch (e) {
        const local = await getLocalData();
        if (!local) throw new Error("No local data");
        return local.location;
    }
}

export async function saveLocation(data: LocationData): Promise<void> {
    if (!isFirebaseInitialized) throw new Error("Firebase not configured");
    const ref = doc(db, COL_SETTINGS, DOC_LOCATION);
    await setDoc(ref, data);
}

// --- Offer Functions ---
export async function getOffers(): Promise<SpecialOffer[]> {
    if (!isFirebaseInitialized) {
        const local = await getLocalData();
        return local?.offers || [];
    }
    const snapshot = await getDocs(collection(db, COL_OFFERS));
    return snapshot.docs.map(d => d.data() as SpecialOffer);
}

export async function saveOffer(offer: SpecialOffer): Promise<void> {
    if (!isFirebaseInitialized) throw new Error("Firebase not configured");
    const ref = doc(db, COL_OFFERS, offer.id);
    await setDoc(ref, offer);
}

export async function deleteOffer(id: string): Promise<void> {
    if (!isFirebaseInitialized) throw new Error("Firebase not configured");
    await deleteDoc(doc(db, COL_OFFERS, id));
}

// --- Legacy Support (Deprecated) ---
export async function getDB(): Promise<DBData> {
    const [menu, location, orders, offers] = await Promise.all([
        getMenu(),
        getLocation(),
        getOrders(),
        getOffers()
    ]);
    return { menu, location, orders, offers, loginRequests: [] };
}

export async function saveDB(data: DBData): Promise<void> {
    console.warn("saveDB is deprecated. Use specific save functions.");
}

// --- Login Request Helpers ---

export async function createLoginRequest(req: LoginRequest): Promise<void> {
    if (isFirebaseInitialized) {
        await setDoc(doc(db, 'login_requests', req.id), req);
    } else {
        // Fallback or no-op for local
        console.log('Mock DB: Created Login Request', req);
    }
}

export async function getLoginRequest(id: string): Promise<LoginRequest | null> {
    if (isFirebaseInitialized) {
        const docRef = doc(db, 'login_requests', id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
            return snapshot.data() as LoginRequest;
        }
        return null;
    }
    return null;
}

export async function updateLoginRequestStatus(id: string, status: LoginRequest['status']): Promise<void> {
    if (isFirebaseInitialized) {
        const docRef = doc(db, 'login_requests', id);
        await updateDoc(docRef, { status });
    }
}
