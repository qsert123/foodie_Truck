import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import OrderStatus from "@/components/OrderStatus";
import { CartProvider } from "@/context/CartContext";
import OffersModal from "@/components/OffersModal";
import CartSummary from "@/components/CartSummary";
import StatusChecker from "@/components/StatusChecker";
import BottomNav from "@/components/BottomNav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
    title: "Foodie | Premium Food Truck",
    description: "Gourmet street food on the go. Find us near you!",
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: '#C6E900',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${outfit.variable}`}>
                <CartProvider>
                    <StatusChecker />
                    {children}
                    <OrderStatus />
                    <OffersModal />
                    <CartSummary />
                    <BottomNav />
                </CartProvider>
            </body>
        </html>
    );
}
