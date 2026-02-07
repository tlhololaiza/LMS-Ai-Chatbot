import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import LMSLogo from '@/assets/LMS-Logo.png';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden">
              <img src={LMSLogo} alt="CodeTribe Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-sidebar-foreground">CodeTribe</h1>
              <p className="text-sm text-sidebar-foreground/60">Academy</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-semibold text-sidebar-foreground leading-tight">
            Empowering the next generation of digital innovators
          </h2>
          <p className="text-sidebar-foreground/70 text-lg">
            Access world-class training in software development, data science, and digital skills.
            Your journey to becoming a tech professional starts here.
          </p>
          <div className="flex gap-8">
            <div>
              <p className="text-3xl font-bold text-sidebar-primary">500+</p>
              <p className="text-sm text-sidebar-foreground/60">Active Learners</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-sidebar-primary">95%</p>
              <p className="text-sm text-sidebar-foreground/60">Completion Rate</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-sidebar-primary">50+</p>
              <p className="text-sm text-sidebar-foreground/60">Partner Companies</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-sidebar-foreground/40">
          © 2024 CodeTribe Academy. All rights reserved.
        </p>
      </div>

      {/* Right panel - Login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl overflow-hidden">
              <img src={LMSLogo} alt="CodeTribe Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">CodeTribe</h1>
              <p className="text-sm text-muted-foreground">Academy</p>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-semibold">Welcome back</h2>
            <p className="text-muted-foreground mt-2">
              Sign in to continue your learning journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <a href="#" className="text-primary hover:underline font-medium">
              Contact your program coordinator
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
