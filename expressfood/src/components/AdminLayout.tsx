import React, { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Store, Users, Truck, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';

interface AdminLayoutProps {
    children: ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Redirect if not admin
    React.useEffect(() => {
        if (user && user.role !== 'ROLE_ADMIN') {
            navigate('/');
        }
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/restaurants', icon: Store, label: 'Restaurants' },
        { path: '/admin/customers', icon: Users, label: 'Customers' },
        { path: '/admin/drivers', icon: Truck, label: 'Drivers' },
    ];

    const isActive = (path: string) => {
        if (path === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-white
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center">
                                <span className="text-white font-bold text-xl">E</span>
                            </div>
                            <div>
                                <h2 className="font-bold text-lg">ExpressFood</h2>
                                <p className="text-xs text-slate-400">Admin Panel</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-slate-400 hover:text-white"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-lg
                                        transition-all duration-200
                                        ${active
                                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                        }
                                    `}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Section */}
                    <div className="p-4 border-t border-slate-800">
                        <div className="flex items-center gap-3 mb-3 px-2">
                            <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center">
                                <span className="text-sm font-bold">{user?.username?.charAt(0).toUpperCase()}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user?.username}</p>
                                <p className="text-xs text-slate-400">Administrator</p>
                            </div>
                        </div>
                        <Button
                            onClick={handleLogout}
                            className="w-full bg-slate-800 hover:bg-slate-700 text-white"
                            size="sm"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-slate-600 hover:text-slate-900"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <div className="flex-1 lg:ml-0 ml-4">
                            <h1 className="text-2xl font-bold text-slate-900">
                                {menuItems.find(item => isActive(item.path))?.label || 'Admin Panel'}
                            </h1>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};
