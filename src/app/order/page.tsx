import Navbar from '@/components/Navbar';
import OrderForm from '@/components/OrderForm';
import { getMenu } from '@/lib/db';

export default async function OrderPage() {
    const menu = await getMenu();

    return (
        <main>
            <Navbar />
            <div style={{ paddingTop: '100px' }} className="container section">
                <h1 style={{ marginBottom: '2rem' }}>Place Your Order</h1>
                <OrderForm menu={menu} />
            </div>
        </main>
    );
}
