import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { saveGame } from '@/lib/gameStore';

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a kids game creator. When given a prompt, you MUST respond with ONLY a complete, self-contained HTML5 game that works in a sandboxed iframe.

RULES (follow exactly):
1. Respond with ONLY raw HTML — no markdown, no code blocks, no explanation, no backticks.
2. The entire game must be in a single HTML file with inline CSS and JavaScript.
3. Games must be fun, colorful, and appropriate for kids ages 6-12.
4. No violence, no scary content, no adult themes.
5. Keep it simple but playable — one clear goal, easy controls.
6. Use keyboard (arrow keys, spacebar) or mouse/touch controls.
7. Show score or progress. Show a "Game Over" or "You Win" screen.
8. Do NOT use external CDN libraries. Use only vanilla JS and Canvas API or DOM elements.
9. Make the game fill the full viewport (100vw x 100vh).
10. Include a visible title at the top and brief instructions.
11. The game must be deterministic enough to work on first load with no network requests.

Start your response with <!DOCTYPE html> and nothing else before it.`;

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (prompt.trim().length > 500) {
      return NextResponse.json({ error: 'Prompt too long (max 500 chars)' }, { status: 400 });
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Create a kids game: ${prompt.trim()}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'Unexpected response from AI' }, { status: 500 });
    }

    let gameHtml = content.text.trim();

    // Strip any accidental markdown code fences
    gameHtml = gameHtml.replace(/^```html\s*/i, '').replace(/\s*```$/i, '');
    gameHtml = gameHtml.replace(/^```\s*/, '').replace(/\s*```$/, '');

    if (!gameHtml.toLowerCase().includes('<!doctype html')) {
      return NextResponse.json({ error: 'AI did not return valid HTML' }, { status: 500 });
    }

    const game = saveGame({
      id: Date.now().toString(),
      prompt: prompt.trim(),
      html: gameHtml,
      createdAt: Date.now(),
    });

    return NextResponse.json({ html: gameHtml, id: game.id });
  } catch (error) {
    console.error('Game generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate game. Please try again.' },
      { status: 500 }
    );
  }
}
