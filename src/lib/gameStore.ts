import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { Game } from '@/types/game';

const DATA_DIR = path.join(process.cwd(), 'data');

function getDb(): Database.Database {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const db = new Database(path.join(DATA_DIR, 'games.db'));
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY,
      prompt TEXT NOT NULL,
      html TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      play_count INTEGER NOT NULL DEFAULT 0,
      parent_id TEXT,
      tweak_prompt TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_games_created_at ON games(created_at DESC);
  `);
  return db;
}

// Singleton for the process lifetime (Next.js keeps the module alive between requests)
let _db: Database.Database | null = null;
function db(): Database.Database {
  if (!_db) _db = getDb();
  return _db;
}

function rowToGame(row: Record<string, unknown>): Game {
  return {
    id: row.id as string,
    prompt: row.prompt as string,
    html: row.html as string,
    createdAt: row.created_at as number,
    playCount: row.play_count as number,
    parentId: (row.parent_id as string | null) ?? undefined,
    tweakPrompt: (row.tweak_prompt as string | null) ?? undefined,
  };
}

export function saveGame(game: Omit<Game, 'playCount'>): Game {
  const existing = db()
    .prepare('SELECT * FROM games WHERE id = ?')
    .get(game.id) as Record<string, unknown> | undefined;
  if (existing) return rowToGame(existing);

  db()
    .prepare(
      `INSERT INTO games (id, prompt, html, created_at, play_count, parent_id, tweak_prompt)
       VALUES (?, ?, ?, ?, 0, ?, ?)`
    )
    .run(
      game.id,
      game.prompt,
      game.html,
      game.createdAt,
      game.parentId ?? null,
      game.tweakPrompt ?? null
    );

  return { ...game, playCount: 0 };
}

export function listGames(limit = 50): Game[] {
  const rows = db()
    .prepare(
      `SELECT id, prompt, '' AS html, created_at, play_count, parent_id, tweak_prompt
       FROM games ORDER BY created_at DESC LIMIT ?`
    )
    .all(limit) as Record<string, unknown>[];
  return rows.map(rowToGame);
}

export function getGame(id: string): Game | null {
  const row = db()
    .prepare('SELECT * FROM games WHERE id = ?')
    .get(id) as Record<string, unknown> | undefined;
  return row ? rowToGame(row) : null;
}

export function incrementPlayCount(id: string): void {
  db().prepare('UPDATE games SET play_count = play_count + 1 WHERE id = ?').run(id);
}

export function updateGame(id: string, updates: Partial<Game>): Game | null {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (updates.prompt !== undefined) {
    fields.push('prompt = ?');
    values.push(updates.prompt);
  }
  if (updates.html !== undefined) {
    fields.push('html = ?');
    values.push(updates.html);
  }
  if (updates.playCount !== undefined) {
    fields.push('play_count = ?');
    values.push(updates.playCount);
  }
  if (updates.parentId !== undefined) {
    fields.push('parent_id = ?');
    values.push(updates.parentId ?? null);
  }
  if (updates.tweakPrompt !== undefined) {
    fields.push('tweak_prompt = ?');
    values.push(updates.tweakPrompt ?? null);
  }

  if (fields.length === 0) return getGame(id);

  values.push(id);
  db()
    .prepare(`UPDATE games SET ${fields.join(', ')} WHERE id = ?`)
    .run(...values);

  return getGame(id);
}
