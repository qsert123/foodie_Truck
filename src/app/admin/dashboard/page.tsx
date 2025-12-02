
import AdminDashboard from '@/components/AdminDashboard';

export default function DashboardPage() {
    return (
        <main style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
            <div className="container section">
                <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>
                <AdminDashboard />
            </div>
        </main>
    );
}
