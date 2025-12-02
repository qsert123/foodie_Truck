import { db, isFirebaseInitialized } from './firebase';
import { collection, getDocs, doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc, query, where, writeBatch } from 'firebase/firestore';
import { Order, MenuItem, LocationData, SpecialOffer, DBData } from './types';
export type { Order, MenuItem, LocationData, SpecialOffer, DBData };
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
    if (!isFirebaseInitialized) {
        const local = await getLocalData();
        return local?.menu || [];
    }
    try {
        const snapshot = await getDocs(collection(db, COL_MENU));
        if (snapshot.empty) {
            // Auto-seed if empty
            await seedFromLocal();
            const retry = await getDocs(collection(db, COL_MENU));
            return retry.docs.map(d => d.data() as MenuItem);
        }
        return snapshot.docs.map(d => d.data() as MenuItem);
    } catch (e) {
        console.error("Firebase error", e);
        const local = await getLocalData();
        return local?.menu || [];
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
    return { menu, location, orders, offers };
}

export async function saveDB(data: DBData): Promise<void> {
    console.warn("saveDB is deprecated. Use specific save functions.");
}
