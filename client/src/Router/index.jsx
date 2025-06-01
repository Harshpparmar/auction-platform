import { Routes, Route, Navigate } from 'react-router-dom';
import PublicAuction from '../Pages/PublicAuction';
import AdminLogin from '../Pages/AdminLogin';
import AdminDashboard from '../Pages/AdminDashboard';
import ProtectedRoute from '../components/ProtectedRoute';
import Navbar from '../components/Navbar';

function Router() {
    return (
        <>
            <Navbar />
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<PublicAuction />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Protected routes */}
                <Route path="/admin" element={
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}

export default Router;