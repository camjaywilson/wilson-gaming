import fs from 'fs';
import path from 'path';
import { Game } from '@/types/game';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'games.json');

interface GamesDB {
  games: Game[];
}

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readDB(): GamesDB {
  ensureDir();
  if (!fs.existsSync(DB_FILE)) {
    return { games: [] };
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { games: [] };
  }
}

function writeDB(db: GamesDB) {
  ensureDir();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

export function saveGame(game: Omit<Game, 'playCount'>): Game {
  const db = readDB();
  const existing = db.games.find((g) => g.id === game.id);
  if (existing) return existing;
  const full: Game = { ...game, playCount: 0 };
  db.games.unshift(full);
  // Keep at most 200 games
  db.games = db.games.slice(0, 200);
  writeDB(db);
  return full;
}

export function listGames(limit = 50): Game[] {
  const db = readDB();
  return db.games.slice(0, limit).map((g) => ({ ...g, html: '' })); // omit html for listing
}

export function getGame(id: string): Game | null {
  const db = readDB();
  return db.games.find((g) => g.id === id) ?? null;
}

export function incrementPlayCount(id: string): void {
  const db = readDB();
  const game = db.games.find((g) => g.id === id);
  if (game) {
    game.playCount = (game.playCount ?? 0) + 1;
    writeDB(db);
  }
}

export function updateGame(id: string, updates: Partial<Game>): Game | null {
  const db = readDB();
  const idx = db.games.findIndex((g) => g.id === id);
  if (idx === -1) return null;
  db.games[idx] = { ...db.games[idx], ...updates };
  writeDB(db);
  return db.games[idx];
}
