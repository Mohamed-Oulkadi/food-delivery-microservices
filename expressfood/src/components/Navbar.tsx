import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, LogOut } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
    const { setIsOpen, itemCount } = useCart();
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                            <span className="text-white font-bold text-xl">E</span>
                        </div>
                        <span className="text-xl font-bold text-slate-900 hidden sm:inline-block">
                            ExpressFood
                        </span>
                    </Link>
                </div>

                <div className="hidden md:flex flex-1 max-w-md mx-8">
                    {(!user || user.role === 'ROLE_CUSTOMER') && (
                        <div className="relative w-full">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                            <Input
                                type="search"
                                placeholder="Search for restaurants or food..."
                                className="pl-9 bg-slate-100 border-transparent focus:bg-white"
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative"
                        onClick={() => setIsOpen(true)}
                    >
                        <ShoppingCart className="h-5 w-5" />
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-emerald-600 text-[10px] font-bold text-white flex items-center justify-center">
                                {itemCount}
                            </span>
                        )}
                    </Button>

                    {isAuthenticated ? (
                        <div className="flex items-center gap-2">
                            {user?.role === 'ROLE_CUSTOMER' && (
                                <Link to="/my-orders">
                                    <Button variant="ghost" size="sm" className="hidden sm:flex">
                                        My Orders
                                    </Button>
                                </Link>
                            )}
                            {user?.role === 'ROLE_DRIVER' && (
                                <>
                                    <Link to="/driver/dashboard">
                                        <Button variant="ghost" size="sm" className="hidden sm:flex">
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <Link to="/profile">
                                        <Button variant="ghost" size="sm" className="hidden sm:flex">
                                            Profile
                                        </Button>
                                    </Link>
                                </>
                            )}
                            {user?.role === 'ROLE_ADMIN' && (
                                <Link to="/admin">
                                    <Button variant="ghost" size="sm" className="hidden sm:flex">
                                        Admin Dashboard
                                    </Button>
                                </Link>
                            )}
                            <span className="text-sm font-medium hidden md:block">
                                {user?.username}
                            </span>
                            <Link to="/profile">
                                <Button variant="ghost" size="icon" title="Profile">
                                    <User className="h-5 w-5" />
                                </Button>
                            </Link>
                            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login">
                                <Button variant="ghost">Login</Button>
                            </Link>
                            <Link to="/register">
                                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                    Register
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
