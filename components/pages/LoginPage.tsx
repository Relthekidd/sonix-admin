import { useState } from "react";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { useAuth } from "../../utils/auth/AuthContext";

export function LoginPage() {
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      await signIn(email, password);
      // Navigation will be handled by the auth context
    } catch (error: any) {
      setError(error.message || "Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sonix-black flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 via-purple-500 to-violet-600 rounded-3xl flex items-center justify-center mx-auto mb-6 sonix-glow relative overflow-hidden">
            <span className="text-white text-3xl relative z-10">🎵</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] animate-pulse"></div>
          </div>
          <h1 className="text-3xl font-bold text-sonix-primary mb-2">Sonix</h1>
          <p className="text-sonix-secondary font-medium">Admin Dashboard</p>
          <Badge className="mt-3 bg-sonix-tag text-sonix-secondary">🔐 Supabase Authentication</Badge>
        </div>

        {/* Login Form */}
        <div className="sonix-card">
          <div className="pb-8">
            <h2 className="text-2xl font-bold text-sonix-primary mb-2">Welcome back</h2>
            <p className="text-sonix-secondary">Sign in to your admin account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-sonix-primary mb-2">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="admin@sonix.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-sonix-black border-sonix text-sonix-primary focus:border-sonix-purple focus:sonix-glow"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-sonix-primary mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-sonix-black border-sonix text-sonix-primary pr-12 focus:border-sonix-purple focus:sonix-glow"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sonix-secondary hover:text-sonix-primary transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-sonix-error/10 border border-sonix-error/30 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-sonix-error flex-shrink-0" />
                <p className="text-sonix-error text-sm">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-sonix bg-sonix-black text-sonix-purple focus:ring-sonix-purple"
                  disabled={isLoading}
                />
                <span className="text-sm text-sonix-secondary">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-sonix-purple hover:text-purple-400 transition-colors"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full sonix-button-primary py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-sonix">
            <div className="text-center">
              <p className="text-sm text-sonix-secondary">
                Don't have admin access?{" "}
                <button className="text-sonix-purple hover:text-purple-400 transition-colors">
                  Contact support
                </button>
              </p>
            </div>
          </div>

          {/* Development Backdoor */}
          <div className="mt-6 p-4 bg-sonix-hover rounded-lg border border-sonix">
            <h4 className="text-sm font-semibold text-sonix-primary mb-2">Development Mode</h4>
            <p className="text-xs text-sonix-secondary mb-3">Quick access for testing (remove in production)</p>
            <div className="space-y-2 text-xs text-sonix-secondary">
              <p><strong>Email:</strong> admin@sonix.com</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail("admin@sonix.com");
                setPassword("admin123");
              }}
              className="mt-2 text-xs text-sonix-purple hover:text-purple-400 transition-colors"
              disabled={isLoading}
            >
              Fill Demo Credentials
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-sonix-secondary">
            © 2024 Sonix. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}