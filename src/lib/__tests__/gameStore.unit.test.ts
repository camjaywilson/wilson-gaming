/**
 * Unit tests for gameStore.ts
 * Tags: unit, smoke
 *
 * Tests the SQLite-backed game persistence layer.
 * Uses an in-memory or temp-file DB to avoid polluting production data.
 */

// Mock better-sqlite3 so tests run without a real FS DB
jest.mock('better-sqlite3');

import Database from 'better-sqlite3';

const mockRun = jest.fn();
const mockGet = jest.fn();
const mockAll = jest.fn();
const mockPrepare = jest.fn(() => ({ run: mockRun, get: mockGet, all: mockAll }));
const mockExec = jest.fn();
const mockPragma = jest.fn();

(Database as unknown as jest.Mock).mockImplementation(() => ({
  prepare: mockPrepare,
  exec: mockExec,
  pragma: mockPragma,
}));

// Reset module between tests so the singleton _db is cleared
beforeEach(() => {
  jest.resetModules();
  mockRun.mockReset();
  mockGet.mockReset();
  mockAll.mockReset();
  mockPrepare.mockReturnValue({ run: mockRun, get: mockGet, all: mockAll });
});

describe('gameStore', () => {
  // ── saveGame ────────────────────────────────────────────────────────────────

  describe('saveGame', () => {
    it('inserts a new game and returns it with playCount=0', async () => {
      mockGet.mockReturnValue(undefined); // no existing game
      const { saveGame } = await import('../gameStore');

      const result = saveGame({
        id: 'game-1',
        prompt: 'A simple platformer',
        html: '<html/>',
        createdAt: 1_000_000,
      });

      expect(mockRun).toHaveBeenCalled();
      expect(result).toEqual({
        id: 'game-1',
        prompt: 'A simple platformer',
        html: '<html/>',
        createdAt: 1_000_000,
        playCount: 0,
      });
    });

    it('returns existing game without re-inserting on duplicate id', async () => {
      const existing = {
        id: 'game-1',
        prompt: 'old prompt',
        html: '<html/>',
        created_at: 1_000_000,
        play_count: 5,
        parent_id: null,
        tweak_prompt: null,
      };
      mockGet.mockReturnValue(existing);
      const { saveGame } = await import('../gameStore');

      const result = saveGame({
        id: 'game-1',
        prompt: 'new prompt',
        html: '<html/>',
        createdAt: 2_000_000,
      });

      expect(mockRun).not.toHaveBeenCalled();
      expect(result.prompt).toBe('old prompt');
      expect(result.playCount).toBe(5);
    });

    it('stores parentId and tweakPrompt for tweaked games', async () => {
      mockGet.mockReturnValue(undefined);
      const { saveGame } = await import('../gameStore');

      saveGame({
        id: 'game-2',
        prompt: 'Tweak: make it faster',
        html: '<html/>',
        createdAt: 2_000_000,
        parentId: 'game-1',
        tweakPrompt: 'make it faster',
      });

      const insertCall = mockRun.mock.calls[0];
      // args: id, prompt, html, created_at, parent_id, tweak_prompt
      expect(insertCall[4]).toBe('game-1');
      expect(insertCall[5]).toBe('make it faster');
    });
  });

  // ── listGames ───────────────────────────────────────────────────────────────

  describe('listGames', () => {
    it('returns games mapped from DB rows', async () => {
      mockAll.mockReturnValue([
        { id: 'a', prompt: 'p1', html: '', created_at: 100, play_count: 2, parent_id: null, tweak_prompt: null },
        { id: 'b', prompt: 'p2', html: '', created_at: 200, play_count: 0, parent_id: 'a', tweak_prompt: 'faster' },
      ]);
      const { listGames } = await import('../gameStore');

      const games = listGames();

      expect(games).toHaveLength(2);
      expect(games[0].id).toBe('a');
      expect(games[1].parentId).toBe('a');
      expect(games[1].tweakPrompt).toBe('faster');
    });

    it('passes limit to the SQL query', async () => {
      mockAll.mockReturnValue([]);
      const { listGames } = await import('../gameStore');

      listGames(10);

      const preparedSql: string = mockPrepare.mock.calls.find(([sql]: [string]) =>
        sql.includes('LIMIT')
      )?.[0];
      expect(preparedSql).toBeTruthy();
      expect(mockAll).toHaveBeenCalledWith(10);
    });
  });

  // ── getGame ─────────────────────────────────────────────────────────────────

  describe('getGame', () => {
    it('returns null for missing game', async () => {
      mockGet.mockReturnValue(undefined);
      const { getGame } = await import('../gameStore');

      expect(getGame('nonexistent')).toBeNull();
    });

    it('returns mapped game for existing id', async () => {
      mockGet.mockReturnValue({
        id: 'x', prompt: 'q', html: '<h/>', created_at: 999, play_count: 3,
        parent_id: null, tweak_prompt: null,
      });
      const { getGame } = await import('../gameStore');

      const game = getGame('x');

      expect(game).not.toBeNull();
      expect(game!.playCount).toBe(3);
    });
  });

  // ── incrementPlayCount ──────────────────────────────────────────────────────

  describe('incrementPlayCount', () => {
    it('executes an UPDATE for the given id', async () => {
      const { incrementPlayCount } = await import('../gameStore');

      incrementPlayCount('game-1');

      expect(mockRun).toHaveBeenCalledWith('game-1');
    });
  });

  // ── updateGame ──────────────────────────────────────────────────────────────

  describe('updateGame', () => {
    it('returns null when game does not exist after update', async () => {
      mockGet.mockReturnValue(undefined); // after update
      const { updateGame } = await import('../gameStore');

      const result = updateGame('missing', { prompt: 'new' });

      expect(result).toBeNull();
    });

    it('does not issue UPDATE when no fields are provided', async () => {
      mockGet.mockReturnValue({
        id: 'g', prompt: 'p', html: '', created_at: 1, play_count: 0,
        parent_id: null, tweak_prompt: null,
      });
      const { updateGame } = await import('../gameStore');

      updateGame('g', {});

      // prepare is called for SELECT only, not UPDATE
      const updatePrepare = mockPrepare.mock.calls.find(([sql]: [string]) =>
        sql.startsWith('UPDATE')
      );
      expect(updatePrepare).toBeUndefined();
    });
  });
});
