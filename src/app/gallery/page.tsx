import Link from 'next/link';
import { listGames } from '@/lib/gameStore';
import GameCard from '@/components/GameCard';

export const dynamic = 'force-dynamic';

export default function GalleryPage() {
  const games = listGames(50);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 via-blue-500 to-cyan-400 font-[family-name:var(--font-geist-sans)]">
      <header className="flex items-center justify-between px-4 py-3 bg-black/20 backdrop-blur-sm">
        <Link
          href="/"
          className="text-white font-bold text-xl hover:scale-105 transition-transform"
        >
          🎮 Wilson Gaming
        </Link>
        <nav className="flex gap-2">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-full text-sm font-semibold text-white hover:bg-white/20 transition-all"
          >
            Home
          </Link>
          <Link
            href="/create"
            className="px-3 py-1.5 rounded-full text-sm font-semibold text-white hover:bg-white/20 transition-all"
          >
            Create
          </Link>
          <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-white text-purple-700">
            Gallery
          </span>
        </nav>
      </header>

      <main className="px-4 py-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-white">Game Gallery</h1>
          <span className="text-white/70 text-sm">{games.length} games</span>
        </div>

        {games.length === 0 ? (
          <div className="text-center text-white/80 py-16">
            <p className="text-5xl mb-4">🎮</p>
            <p className="text-lg font-semibold">No games yet!</p>
            <p className="text-sm mt-1 mb-4">Be the first to create one.</p>
            <Link
              href="/create"
              className="px-6 py-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-xl transition-all inline-block"
            >
              Create a Game
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
