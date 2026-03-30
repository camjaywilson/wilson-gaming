import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { getGame, saveGame } from '@/lib/gameStore';

const client = new Anthropic();

const TWEAK_SYSTEM_PROMPT = `You are a kids game improver. You will receive an existing HTML5 game and a request to change it.
Return ONLY the updated complete HTML game — no explanation, no markdown, no backticks.
Keep all the good parts of the original. Only change what was requested.
Games must remain safe for kids ages 6-12 (no violence, no adult content).
Start your response with <!DOCTYPE html> and nothing else before it.`;

export async function POST(req: NextRequest) {
  try {
    const { gameId, tweakPrompt } = await req.json();

    if (!gameId || !tweakPrompt || typeof tweakPrompt !== 'string') {
      return NextResponse.json({ error: 'gameId and tweakPrompt are required' }, { status: 400 });
    }

    if (tweakPrompt.trim().length > 500) {
      return NextResponse.json({ error: 'Tweak prompt too long (max 500 chars)' }, { status: 400 });
    }

    const original = getGame(gameId);
    if (!original) {
      return NextResponse.json({ error: 'Original game not found' }, { status: 404 });
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: TWEAK_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Here is the current game:\n\n${original.html}\n\n---\n\nChange request: ${tweakPrompt.trim()}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'Unexpected response from AI' }, { status: 500 });
    }

    let gameHtml = content.text.trim();
    gameHtml = gameHtml.replace(/^```html\s*/i, '').replace(/\s*```$/i, '');
    gameHtml = gameHtml.replace(/^```\s*/, '').replace(/\s*```$/, '');

    if (!gameHtml.toLowerCase().includes('<!doctype html')) {
      return NextResponse.json({ error: 'AI did not return valid HTML' }, { status: 500 });
    }

    const tweaked = saveGame({
      id: Date.now().toString(),
      prompt: `${original.prompt} (tweaked: ${tweakPrompt.trim()})`,
      html: gameHtml,
      createdAt: Date.now(),
      parentId: gameId,
      tweakPrompt: tweakPrompt.trim(),
    });

    return NextResponse.json({ html: gameHtml, id: tweaked.id });
  } catch (error) {
    console.error('Tweak game error:', error);
    return NextResponse.json({ error: 'Failed to tweak game. Please try again.' }, { status: 500 });
  }
}
