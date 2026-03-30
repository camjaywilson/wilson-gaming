import { NextResponse } from 'next/server';
import { listGames } from '@/lib/gameStore';

export async function GET() {
  const games = listGames(50);
  return NextResponse.json({ games });
}
