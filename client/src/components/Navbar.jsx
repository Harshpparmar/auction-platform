import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    // Check login status when component mounts and listen for changes
    useEffect(() => {
        const checkAuthStatus = () => {
            const token = localStorage.getItem('token');
            setIsLoggedIn(!!token);
        };
        
        checkAuthStatus();
        window.addEventListener('auth-change', checkAuthStatus);

        window.addEventListener('storage', checkAuthStatus);
        
        return () => {
            window.removeEventListener('auth-change', checkAuthStatus);
            window.removeEventListener('storage', checkAuthStatus);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <nav className="bg-gray-900/95 backdrop-blur-lg border-b border-slate-800/70 text-slate-100 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-xl font-semibold tracking-tight">
                    Auction Platform
                </Link>

                <div>
                    {isLoggedIn ? (
                        <div className="flex items-center space-x-5">
                            <Link 
                                to="/" 
                                className="text-slate-300 hover:text-white transition duration-200"
                            >
                                Home
                            </Link>
                            <Link 
                                to="/admin" 
                                className="text-slate-300 hover:text-white transition duration-200"
                            >
                                Admin Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/admin/login"
                            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            Admin Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;