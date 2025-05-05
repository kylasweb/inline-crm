
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useSiteContext } from '@/contexts/SiteContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { siteName } = useSiteContext();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // For demo purposes, add a slight delay and then navigate to dashboard
    // In a real app, you'd authenticate with an API
    setTimeout(() => {
      if (formData.email === 'demo@example.com' && formData.password === 'password123') {
        // Success login case
        setIsLoading(false);
        toast({
          title: "Login Successful",
          description: "Welcome to the dashboard!",
        });
        navigate('/dashboard');
      } else {
        // Error login case
        setIsLoading(false);
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Try demo@example.com / password123.",
          variant: "destructive",
        });
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-neo-bg p-6">
      <div className="neo-flat p-8 rounded-xl max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="neo-convex h-16 w-16 rounded-full flex items-center justify-center">
              <span className="text-neo-primary text-3xl font-bold">N</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-neo-text-primary mb-1">{siteName}</h1>
          <p className="text-neo-text-secondary">Log in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="neo-input"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a 
                href="#" 
                className="text-sm text-neo-primary hover:text-neo-secondary"
                onClick={(e) => {
                  e.preventDefault();
                  toast({
                    title: "Reset Password",
                    description: "For this demo, use: demo@example.com / password123",
                  });
                }}
              >
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="neo-input"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="neo-pressed h-4 w-4 rounded"
            />
            <Label htmlFor="rememberMe" className="text-sm">Remember me</Label>
          </div>

          <div className="mt-6">
            <Button
              type="submit"
              className="w-full neo-button bg-neo-primary text-white hover:bg-neo-primary/90 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
          </div>

          <div className="mt-4 text-center">
            <div className="text-sm text-neo-text-secondary">
              <span className="block mb-2">Test credentials for demo:</span>
              <div className="neo-flat p-3 rounded-lg text-left space-y-2">
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="font-medium">demo@example.com</span>
                </div>
                <div className="flex justify-between">
                  <span>Password:</span>
                  <span className="font-medium">password123</span>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="mt-8 text-center">
          <a href="/" className="text-neo-primary hover:text-neo-secondary">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
