'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Game } from '@/types/game';

const GameRenderer = dynamic(() => import('@/components/GameRenderer'), { ssr: false });

interface PageProps {
  params: { id: string };
}

export default function GamePage({ params }: PageProps) {
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [tweaking, setTweaking] = useState(false);
  const [tweakPrompt, setTweakPrompt] = useState('');
  const [tweakError, setTweakError] = useState<string | null>(null);
  const [showTweak, setShowTweak] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/games/${params.id}`);
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setGame(data.game);
        // Increment play count
        fetch(`/api/games/${params.id}/play`, { method: 'POST' }).catch(() => {});
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  async function handleTweak(e: React.FormEvent) {
    e.preventDefault();
    if (!tweakPrompt.trim() || tweaking || !game) return;

    setTweaking(true);
    setTweakError(null);

    try {
      const res = await fetch('/api/tweak-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: game.id, tweakPrompt }),
      });
      const data = await res.json();
      if (!res.ok) {
        setTweakError(data.error || 'Something went wrong!');
        return;
      }
      router.push(`/game/${data.id}`);
    } catch {
      setTweakError('Could not connect. Try again!');
    } finally {
      setTweaking(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-600 to-cyan-400 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="inline-block w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-bold text-lg">Loading game...</p>
        </div>
      </div>
    );
  }

  if (notFound || !game) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-600 to-cyan-400 flex flex-col items-center justify-center gap-4 text-white">
        <p className="text-5xl">😢</p>
        <p className="text-xl font-bold">Game not found</p>
        <Link href="/" className="px-6 py-2 bg-yellow-400 text-gray-900 font-bold rounded-xl">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 via-blue-500 to-cyan-400 flex flex-col font-[family-name:var(--font-geist-sans)]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-black/20 backdrop-blur-sm shrink-0">
        <Link
          href="/"
          className="text-white font-bold text-xl hover:scale-105 transition-transform"
        >
          🎮 Wilson Gaming
        </Link>
        <div className="flex gap-2">
          <Link href="/gallery" className="text-white/80 hover:text-white text-sm font-semibold">
            Gallery
          </Link>
        </div>
      </header>

      {/* Game prompt bar */}
      <div className="px-4 py-2 bg-black/20 shrink-0 flex items-center gap-3">
        <span className="text-white/80 text-sm flex-1 truncate">{game.prompt}</span>
        <div className="flex items-center gap-2 text-white/60 text-xs shrink-0">
          <span>▶ {(game.playCount ?? 0) + 1} plays</span>
          {game.parentId && (
            <Link
              href={`/game/${game.parentId}`}
              className="bg-white/20 hover:bg-white/30 rounded-full px-2 py-0.5 transition-colors"
            >
              Based on original ↗
            </Link>
          )}
        </div>
      </div>

      {/* Game canvas */}
      <div className="flex-1 relative" style={{ minHeight: '400px' }}>
        <GameRenderer html={game.html} />
      </div>

      {/* Tweak panel */}
      <div className="shrink-0 bg-black/30 backdrop-blur-sm">
        {!showTweak ? (
          <div className="px-4 py-3 flex gap-3">
            <button
              onClick={() => setShowTweak(true)}
              className="flex-1 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-sm transition-all"
            >
              ✏️ Improve this game
            </button>
            <Link
              href="/create"
              className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-sm transition-all"
            >
              + New Game
            </Link>
          </div>
        ) : (
          <form onSubmit={handleTweak} className="px-4 py-3 flex flex-col gap-2">
            <p className="text-white font-semibold text-sm">What should change?</p>
            <div className="flex gap-2">
              <input
                value={tweakPrompt}
                onChange={(e) => setTweakPrompt(e.target.value)}
                placeholder="e.g. Make it faster, Add more colors, Change the character"
                maxLength={500}
                className="flex-1 px-3 py-2 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
                disabled={tweaking}
                autoFocus
              />
              <button
                type="submit"
                disabled={tweaking || !tweakPrompt.trim()}
                className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-900 font-bold text-sm transition-all"
              >
                {tweaking ? (
                  <span className="inline-flex items-center gap-1">
                    <span className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                    Working...
                  </span>
                ) : (
                  '✨ Improve!'
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowTweak(false);
                  setTweakError(null);
                  setTweakPrompt('');
                }}
                className="px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm transition-all"
              >
                ✕
              </button>
            </div>
            {tweakError && <p className="text-red-300 text-xs font-semibold">{tweakError}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
