import Link from 'next/link';
import { listGames } from '@/lib/gameStore';
import GameCard from '@/components/GameCard';
import AdBanner from '@/components/AdBanner';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const featuredGames = listGames(8);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 via-blue-500 to-cyan-400 font-[family-name:var(--font-geist-sans)]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-black/20 backdrop-blur-sm">
        <span className="text-white font-bold text-xl">🎮 Wilson Gaming</span>
        <nav className="flex gap-2">
          <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-white text-purple-700">
            Home
          </span>
          <Link
            href="/create"
            className="px-3 py-1.5 rounded-full text-sm font-semibold text-white hover:bg-white/20 transition-all"
          >
            Create
          </Link>
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

      <main className="flex flex-col items-center gap-12 pb-12">
        {/* Hero */}
        <section className="w-full max-w-3xl mx-auto px-4 py-12 text-center flex flex-col items-center gap-6">
          <div className="text-6xl">🎮</div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white drop-shadow-lg leading-tight">
            Wilson Gaming
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 font-semibold max-w-xl">
            The AI game studio for kids. Describe any game and watch it come to life in seconds!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full justify-center">
            <Link
              href="/create"
              className="px-8 py-4 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-extrabold text-xl shadow-lg transition-all hover:scale-[1.03] active:scale-95 text-center"
            >
              ✨ Create a Game
            </Link>
            <Link
              href="/gallery"
              className="px-8 py-4 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-extrabold text-xl shadow-lg transition-all hover:scale-[1.03] active:scale-95 text-center"
            >
              🎲 Play Games
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section className="w-full max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-extrabold text-white text-center mb-6">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { emoji: '💬', title: 'Describe', desc: 'Type what game you want to play in your own words' },
              { emoji: '🤖', title: 'AI Builds It', desc: 'Our AI creates a unique playable game just for you' },
              { emoji: '🕹️', title: 'Play & Share', desc: 'Play instantly and share your creation with friends' },
            ].map(({ emoji, title, desc }) => (
              <div
                key={title}
                className="bg-white/20 rounded-2xl p-6 flex flex-col items-center gap-3 text-center"
              >
                <span className="text-4xl">{emoji}</span>
                <h3 className="text-white font-extrabold text-lg">{title}</h3>
                <p className="text-white/80 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured games */}
        <section className="w-full max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-extrabold text-white">Featured Games</h2>
            <Link
              href="/gallery"
              className="text-white/80 hover:text-white text-sm font-semibold underline underline-offset-2"
            >
              See all →
            </Link>
          </div>

          {featuredGames.length === 0 ? (
            <div className="bg-white/20 rounded-2xl p-8 text-center">
              <p className="text-white/80 text-lg mb-4">No games yet — be the first!</p>
              <Link
                href="/create"
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-xl transition-all inline-block"
              >
                Create the First Game
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {featuredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </section>

        {/* Bottom CTA */}
        <section className="w-full max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white/20 rounded-3xl p-8 flex flex-col items-center gap-4">
            <p className="text-white font-extrabold text-2xl">Ready to build your dream game?</p>
            <Link
              href="/create"
              className="px-10 py-4 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-extrabold text-xl shadow-lg transition-all hover:scale-[1.03] active:scale-95"
            >
              ✨ Create My Game
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
