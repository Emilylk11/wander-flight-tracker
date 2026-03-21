'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/deals');
      router.refresh();
    }
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  }

  return (
    <div className="bg-white border border-wborder rounded-card p-8">
      <h2 className="font-display text-2xl font-medium text-wtext mb-1 text-center">
        Welcome back
      </h2>
      <p className="text-sm text-wtext-3 mb-6 text-center">
        Sign in to continue your journey
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div>
          <label className="text-xs text-wtext-2 font-medium mb-1 block">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2 transition-colors"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label className="text-xs text-wtext-2 font-medium mb-1 block">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2 transition-colors"
            placeholder="••••••••"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-gradient-to-br from-gold to-gold-2 text-white text-sm font-medium font-body transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-wborder"></div>
        </div>
        <div className="relative flex justify-center text-xs text-wtext-3 bg-white px-3">
          or
        </div>
      </div>

      <button
        onClick={handleGoogleLogin}
        className="w-full py-2.5 rounded-lg border border-wborder-2 bg-transparent text-sm text-wtext-2 font-body transition-all hover:border-gold hover:text-gold-3"
      >
        Continue with Google
      </button>

      <p className="text-center text-sm text-wtext-3 mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-gold font-medium hover:text-gold-3">
          Sign up
        </Link>
      </p>
    </div>
  );
}
