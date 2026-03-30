'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdBanner from '@/components/AdBanner';

const EXAMPLE_PROMPTS = [
  'A jumping frog that collects flies and avoids logs',
  'A colorful bubble-popping game with rainbow bubbles',
  'A space rocket dodging asteroids and collecting stars',
  'A friendly penguin sliding on ice collecting fish',
  'A balloon floating up and avoiding birds',
  'A turtle racing through an ocean maze',
];

export default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateGame(promptText: string) {
    if (!promptText.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Try again!');
        return;
      }

      router.push(`/game/${data.id}`);
    } catch {
      setError('Could not connect. Check your internet and try again!');
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    generateGame(prompt);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 via-blue-500 to-cyan-400 font-[family-name:var(--font-geist-sans)]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-black/20 backdrop-blur-sm">
        <span className="text-white font-bold text-xl">🎮 Wilson Gaming</span>
        <nav className="flex gap-2">
          <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-white text-purple-700">
            Create
          </span>
          <Link
            href="/gallery"
            className="px-3 py-1.5 rounded-full text-sm font-semibold text-white hover:bg-white/20 transition-all"
          >
            Gallery
          </Link>
        </nav>
      </header>

      {/* Ad banner */}
      <AdBanner className="bg-black/10 py-1" />

      <main className="flex flex-col items-center px-4 py-8 gap-6 max-w-2xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white drop-shadow-lg mb-2">
            Make Your Own Game!
          </h1>
          <p className="text-white/90 text-lg">
            Describe any game you can imagine and AI will build it for you!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your game... e.g. 'A jumping bunny collecting carrots'"
              maxLength={500}
              rows={3}
              className="w-full px-4 py-3 rounded-2xl text-gray-800 text-base resize-none focus:outline-none focus:ring-4 focus:ring-yellow-300 shadow-lg"
              disabled={loading}
            />
            <span className="absolute bottom-2 right-3 text-xs text-gray-400">
              {prompt.length}/500
            </span>
          </div>

          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="w-full py-4 rounded-2xl bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-900 font-extrabold text-xl shadow-lg transition-all active:scale-95 hover:scale-[1.02]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-5 h-5 border-4 border-gray-600 border-t-transparent rounded-full animate-spin" />
                Building your game...
              </span>
            ) : (
              '✨ Create My Game!'
            )}
          </button>
        </form>

        {error && (
          <div className="w-full bg-red-100 border-2 border-red-400 text-red-700 rounded-xl px-4 py-3 text-center font-semibold">
            {error}
          </div>
        )}

        {/* Example prompts */}
        <div className="w-full">
          <p className="text-white/80 text-sm font-semibold mb-2 text-center">Try one of these:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {EXAMPLE_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPrompt(p);
                  generateGame(p);
                }}
                disabled={loading}
                className="bg-white/20 hover:bg-white/30 text-white text-sm px-3 py-2 rounded-xl text-left transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery link */}
        <Link
          href="/gallery"
          className="text-white/80 hover:text-white text-sm font-semibold underline underline-offset-2"
        >
          Browse games others made →
        </Link>
      </main>
    </div>
  );
}
