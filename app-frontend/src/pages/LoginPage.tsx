import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    const success = await login(username, password);
    if (success) {
      toast.success('Login successful!');
      onNavigate('home');
    } else {
      toast.error('Invalid credentials. Try: customer/customer123, admin/admin123, or driver/driver123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login to ExpressFood</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              Login
            </Button>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('register')}
                className="text-green-600 hover:underline"
              >
                Register
              </button>
            </p>

            <div className="mt-4 p-4 bg-gray-100 rounded-lg text-sm">
              <p className="text-gray-700 mb-2">Demo credentials:</p>
              <ul className="space-y-1 text-gray-600">
                <li>Customer: customer / customer123</li>
                <li>Admin: admin / admin123</li>
                <li>Driver: driver / driver123</li>
              </ul>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
