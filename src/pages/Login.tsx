
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock login - in a real app, this would call an API
    setTimeout(() => {
      if (email === 'demo@example.com' && password === 'password123') {
        toast.success('Login successful!');
        navigate('/');
      } else {
        toast.error('Invalid credentials. Please try again.');
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleDemoLogin = () => {
    setEmail('demo@example.com');
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex flex-col bg-neo-bg">
      {/* Header */}
      <header className="neo-flat px-6 py-4">
        <div className="flex items-center space-x-4">
          <div 
            className="neo-convex h-12 w-12 rounded-full flex items-center justify-center cursor-pointer"
            onClick={() => navigate('/')}
          >
            <span className="text-neo-primary text-xl font-bold">N</span>
          </div>
          <h1 
            className="text-2xl font-bold text-neo-text-primary cursor-pointer"
            onClick={() => navigate('/')}
          >
            NeoLytic CRM
          </h1>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12 animate-fade-in">
        <div className="w-full max-w-md">
          <div className="neo-flat p-8 rounded-xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-neo-text-primary mb-2">Welcome Back</h2>
              <p className="text-neo-text-secondary">Sign in to access your dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-neo-text-secondary" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="neo-input pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    className="text-xs text-neo-primary hover:text-neo-primary/80 -mr-2"
                    onClick={() => toast.info('Password reset functionality is not available in this demo.')}
                  >
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-neo-text-secondary" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="neo-input pl-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neo-text-secondary hover:text-neo-text-primary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-neo-primary hover:bg-neo-primary/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neo-shadow-dark"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-neo-bg text-neo-text-secondary">
                    Demo Credentials
                  </span>
                </div>
              </div>
              
              <div className="mt-4 p-4 neo-pressed rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Email:</p>
                    <p className="text-neo-text-secondary">demo@example.com</p>
                  </div>
                  <div>
                    <p className="font-medium">Password:</p>
                    <p className="text-neo-text-secondary">password123</p>
                  </div>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  className="w-full mt-4 neo-button bg-neo-bg hover:bg-neo-bg"
                  onClick={handleDemoLogin}
                >
                  Auto-fill Demo Credentials
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
