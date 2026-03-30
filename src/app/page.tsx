'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Game } from '@/types/game';

const GameRenderer = dynamic(() => import('@/components/GameRenderer'), { ssr: false });

const EXAMPLE_PROMPTS = [
  'A jumping frog that collects flies and avoids logs',
  'A colorful bubble-popping game with rainbow bubbles',
  'A space rocket dodging asteroids and collecting stars',
  'A friendly penguin sliding on ice collecting fish',
  'A balloon floating up and avoiding birds',
  'A turtle racing through an ocean maze',
];

const STORAGE_KEY = 'wilson-gaming-history';

function loadHistory(): Game[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(games: Game[]) {
  try {
    // Keep last 20 games, but don't store html to save space — store without html for listing
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games.slice(0, 20)));
  } catch {
    // localStorage quota exceeded — ignore
  }
}

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [history, setHistory] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'create' | 'play' | 'gallery'>('create');

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  async function generateGame(promptText: string) {
    if (!promptText.trim() || loading) return;

    setLoading(true);
    setError(null);
    setCurrentGame(null);

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

      const game: Game = {
        id: Date.now().toString(),
        prompt: promptText,
        html: data.html,
        createdAt: Date.now(),
      };

      setCurrentGame(game);
      setView('play');

      const newHistory = [game, ...history];
      setHistory(newHistory);
      saveHistory(newHistory);
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

  function playFromHistory(game: Game) {
    setCurrentGame(game);
    setView('play');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 via-blue-500 to-cyan-400 font-[family-name:var(--font-geist-sans)]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-black/20 backdrop-blur-sm">
        <button
          onClick={() => setView('create')}
          className="text-white font-bold text-xl hover:scale-105 transition-transform"
        >
          🎮 Wilson Gaming
        </button>
        <nav className="flex gap-2">
          <button
            onClick={() => setView('create')}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${view === 'create' ? 'bg-white text-purple-700' : 'text-white hover:bg-white/20'}`}
          >
            Create
          </button>
          <button
            onClick={() => setView('gallery')}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${view === 'gallery' ? 'bg-white text-purple-700' : 'text-white hover:bg-white/20'}`}
          >
            My Games {history.length > 0 && <span className="ml-1">({history.length})</span>}
          </button>
        </nav>
      </header>

      {/* Create view */}
      {view === 'create' && (
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
            <p className="text-white/80 text-sm font-semibold mb-2 text-center">
              Try one of these:
            </p>
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
        </main>
      )}

      {/* Play view */}
      {view === 'play' && currentGame && (
        <div className="flex flex-col" style={{ height: 'calc(100vh - 56px)' }}>
          <div className="flex items-center gap-2 px-4 py-2 bg-black/30 text-white text-sm">
            <button
              onClick={() => setView('create')}
              className="hover:text-yellow-300 transition-colors font-semibold"
            >
              ← New Game
            </button>
            <span className="text-white/50">|</span>
            <span className="truncate opacity-80">{currentGame.prompt}</span>
          </div>
          <div className="flex-1">
            <GameRenderer html={currentGame.html} />
          </div>
        </div>
      )}

      {/* Gallery view */}
      {view === 'gallery' && (
        <main className="px-4 py-6 max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-4 text-center">My Games</h2>
          {history.length === 0 ? (
            <div className="text-center text-white/80 py-12">
              <p className="text-5xl mb-4">🎮</p>
              <p className="text-lg font-semibold">No games yet!</p>
              <p className="text-sm mt-1">Go create your first game.</p>
              <button
                onClick={() => setView('create')}
                className="mt-4 px-6 py-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-xl transition-all"
              >
                Create a Game
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {history.map((game) => (
                <button
                  key={game.id}
                  onClick={() => playFromHistory(game)}
                  className="bg-white/20 hover:bg-white/30 text-white rounded-2xl p-4 text-left transition-all hover:scale-[1.02] active:scale-95"
                >
                  <div className="text-2xl mb-1">🕹️</div>
                  <p className="font-semibold text-sm leading-snug">{game.prompt}</p>
                  <p className="text-xs text-white/60 mt-1">
                    {new Date(game.createdAt).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          )}
        </main>
      )}
    </div>
  );
}
