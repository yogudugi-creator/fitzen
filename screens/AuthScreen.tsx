import React, { useState } from 'react';

interface AuthScreenProps {
  onLogin: (email: string) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    setLoading(true);
    
    // Simulate auth delay
    setTimeout(() => {
      onLogin(email);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark flex flex-col p-8 animate-fadeIn">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 border border-primary/20">
             <span className="material-symbols-outlined text-4xl text-primary font-variation-settings-fill">bolt</span>
          </div>
          <h2 className="text-3xl font-display font-bold text-charcoal dark:text-white tracking-tighter">
            Fit<span className="text-primary">bro</span>
          </h2>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3 text-charcoal dark:text-white tracking-tight">
            {isLogin ? 'Welcome Back' : 'Join Fitbro'}
          </h1>
          <p className="text-charcoal/40 dark:text-white/40 text-sm font-medium">
            {isLogin ? 'Your digital spotter is waiting.' : 'Start your transformation journey today.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40 dark:text-white/40 ml-1">Email Address</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/20 dark:text-white/20">mail</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="athlete@fitbro.ai"
                className="w-full h-14 bg-white dark:bg-charcoal/30 border border-charcoal/5 dark:border-white/5 rounded-2xl pl-12 pr-4 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-charcoal dark:text-white font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40 dark:text-white/40 ml-1">Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/20 dark:text-white/20">lock</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-14 bg-white dark:bg-charcoal/30 border border-charcoal/5 dark:border-white/5 rounded-2xl pl-12 pr-12 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-charcoal dark:text-white font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/20 dark:text-white/20 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-shake">
              <span className="material-symbols-outlined text-red-500 text-sm">error</span>
              <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-16 bg-primary hover:bg-primary-dark text-charcoal font-bold rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all mt-4 flex items-center justify-center gap-3"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin"></div>
            ) : (
              <span className="uppercase tracking-[0.2em] text-xs">{isLogin ? 'Secure Log In' : 'Create Account'}</span>
            )}
          </button>
        </form>

        <div className="mt-auto pt-10 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[10px] font-bold uppercase tracking-[0.15em] text-charcoal/40 dark:text-white/40"
          >
            {isLogin ? "New to Fitbro? " : "Already an Athlete? "}
            <span className="text-primary border-b-2 border-primary/20 pb-0.5 ml-1">
              {isLogin ? 'Sign Up Free' : 'Secure Log In'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;