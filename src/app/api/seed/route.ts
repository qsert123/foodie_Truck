import { NextResponse } from 'next/server';
import { seedFromLocal } from '@/lib/db';

export async function GET() {
    try {
        console.log("Starting manual seed...");
        await seedFromLocal();
        return NextResponse.json({ success: true, message: "Seeding attempted. Check server console for details." });
    } catch (error: any) {
        console.error("Manual seed failed:", error);
        return NextResponse.json({
            success: false,
            error: error.message,
            code: error.code,
            details: JSON.stringify(error)
        }, { status: 200 });
    }
}
