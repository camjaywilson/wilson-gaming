import { NextRequest, NextResponse } from 'next/server';
import { incrementPlayCount, getGame } from '@/lib/gameStore';

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const game = getGame(params.id);
  if (!game) {
    return NextResponse.json({ error: 'Game not found' }, { status: 404 });
  }
  incrementPlayCount(params.id);
  return NextResponse.json({ ok: true });
}
