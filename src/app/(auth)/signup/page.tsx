'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-white border border-wborder rounded-card p-8 text-center">
        <div className="text-4xl mb-4">✈️</div>
        <h2 className="font-display text-2xl font-medium text-wtext mb-2">
          Check your email
        </h2>
        <p className="text-sm text-wtext-3 mb-6">
          We sent a confirmation link to <strong className="text-wtext">{email}</strong>.
          Click it to start wandering.
        </p>
        <Link
          href="/login"
          className="text-gold font-medium text-sm hover:text-gold-3"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white border border-wborder rounded-card p-8">
      <h2 className="font-display text-2xl font-medium text-wtext mb-1 text-center">
        Start your journey
      </h2>
      <p className="text-sm text-wtext-3 mb-6 text-center">
        Create your WANDER account
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <div>
          <label className="text-xs text-wtext-2 font-medium mb-1 block">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-cream border border-wborder rounded-lg px-3 py-2.5 text-sm text-wtext font-body outline-none focus:border-wborder-2 transition-colors"
            placeholder="Emily M."
            required
          />
        </div>
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
            minLength={6}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-gradient-to-br from-gold to-gold-2 text-white text-sm font-medium font-body transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-wtext-3 mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-gold font-medium hover:text-gold-3">
          Sign in
        </Link>
      </p>
    </div>
  );
}
