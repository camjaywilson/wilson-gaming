'use client';

import Link from 'next/link';
import { Game } from '@/types/game';

const EMOJI_POOL = ['🎮', '🕹️', '🌟', '🚀', '🐸', '🦄', '🌈', '🐧', '🦊', '🐢', '🎯', '🎪'];

function gameEmoji(id: string): string {
  const idx = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return EMOJI_POOL[idx % EMOJI_POOL.length];
}

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/game/${game.id}`} className="block group">
      <div className="bg-white/20 hover:bg-white/30 rounded-2xl p-4 transition-all hover:scale-[1.03] active:scale-95 h-full flex flex-col gap-2">
        <div className="text-4xl">{gameEmoji(game.id)}</div>
        <p className="text-white font-bold text-sm leading-snug flex-1 line-clamp-3">
          {game.prompt}
        </p>
        <div className="flex items-center justify-between text-white/60 text-xs mt-1">
          <span>▶ {game.playCount ?? 0} plays</span>
          {game.parentId && <span className="bg-white/20 rounded-full px-2 py-0.5">Remix</span>}
        </div>
      </div>
    </Link>
  );
}
