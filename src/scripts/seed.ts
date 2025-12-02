import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, setDoc, doc } from "firebase/firestore";
import data from "../lib/data.json";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if config is present
if (!firebaseConfig.apiKey) {
    console.error("❌ Firebase config missing. Make sure .env.local exists and has NEXT_PUBLIC_FIREBASE_API_KEY etc.");
    process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkAndSeed() {
    try {
        console.log("Checking database connection...");

        // Check if Menu collection exists/has data
        const menuSnap = await getDocs(collection(db, "menu"));
        if (!menuSnap.empty) {
            console.log("✅ Firestore already has data (menu). No seeding needed.");
            // You can uncomment the return if you want to skip seeding when data exists
            // return; 
            console.log("ℹ️ Proceeding to overwrite/update data anyway (as per request)...");
        } else {
            console.log("⚠️ Firestore (menu) is empty. Seeding now...");
        }

        // Seed Menu
        console.log("Seeding Menu...");
        for (const item of data.menu) {
            await setDoc(doc(db, "menu", item.id), item);
        }

        // Seed Orders
        console.log("Seeding Orders...");
        for (const order of data.orders) {
            await setDoc(doc(db, "orders", order.id), order);
        }

        // Seed Location (Single Document in 'settings' collection)
        console.log("Seeding Location...");
        // Note: data.location is an object, not an array
        if (data.location) {
            await setDoc(doc(db, "settings", "location"), data.location);
        }

        // Seed Offers
        console.log("Seeding Offers...");
        for (const offer of data.offers) {
            await setDoc(doc(db, "offers", offer.id), offer);
        }

        console.log("✅ Seeding complete.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error during seeding:", err);
        process.exit(1);
    }
}

checkAndSeed();
