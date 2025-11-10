import { Leaf, ShoppingCart, LogOut, Package, LayoutDashboard, User } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useApp } from '../contexts/AppContext';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  onOpenCart: () => void;
  currentPage?: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart, currentPage }) => {
  const { user, logout, cartItemCount } = useApp();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <Link to="/">
              <Leaf className="h-6 w-6 text-green-600" />
              <span className="text-green-600">ExpressFood</span>
            </Link>
          </div>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {!user && currentPage !== '/login' && (
              <Button variant="ghost" asChild>
                <Link to="/">Home</Link>
              </Button>
            )}
            {user?.role === 'ROLE_CUSTOMER' && (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/">Restaurants</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/my-orders">My Orders</Link>
                </Button>
              </>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {user.role === 'ROLE_CUSTOMER' && (
                  <Button variant="ghost" className="relative" onClick={onOpenCart}>
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-green-600">
                        {cartItemCount}
                      </Badge>
                    )}
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline">{user.username}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    
                    
                    {user.role === 'ROLE_DRIVER' && (
                      <DropdownMenuItem onClick={() => navigate('/driver')}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => { logout(); navigate('/login'); }}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
