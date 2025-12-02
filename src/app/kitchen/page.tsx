
import KitchenDisplay from '@/components/KitchenDisplay';

export default function KitchenPage() {
    return (
        <main style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
            <div className="container section">
                <h1 style={{ marginBottom: '2rem' }}>Kitchen Display System</h1>
                <KitchenDisplay />
            </div>
        </main>
    );
}
