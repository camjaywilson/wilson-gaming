import { NextRequest, NextResponse } from 'next/server';
import { getGame } from '@/lib/gameStore';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const game = getGame(params.id);
  if (!game) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 });
  }
  return NextResponse.json({ game });
}
