'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, action: 'login' }),
    });

    setLoading(false);

    if (res.ok) {
      router.push('/');
    } else {
      setError('Wrong password. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-100 to-amber-50 p-8">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-sky-900 mb-2">StoryTunes</h1>
        <p className="text-sky-600 mb-8">English Picture Books for Kids</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter family password"
            className="w-full text-xl text-center border-2 border-sky-200 rounded-xl p-4 mb-4 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none"
            autoFocus
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-200 text-white text-xl font-bold py-4 px-8 rounded-xl transition-colors"
          >
            {loading ? 'Checking...' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  );
}
