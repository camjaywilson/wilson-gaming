/**
 * Unit tests for GameCard component
 * Tags: unit
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import GameCard from '../GameCard';
import { Game } from '@/types/game';

const baseGame: Game = {
  id: 'abc',
  prompt: 'A fun jumping game for kids',
  html: '<html/>',
  createdAt: 1_000_000,
  playCount: 42,
};

describe('GameCard', () => {
  it('renders the game prompt text', () => {
    render(<GameCard game={baseGame} />);
    expect(screen.getByText('A fun jumping game for kids')).toBeInTheDocument();
  });

  it('renders the play count', () => {
    render(<GameCard game={baseGame} />);
    expect(screen.getByText(/42 plays/)).toBeInTheDocument();
  });

  it('links to the game page', () => {
    render(<GameCard game={baseGame} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/game/abc');
  });

  it('shows Remix badge for tweaked games', () => {
    const remixGame: Game = { ...baseGame, parentId: 'parent-1' };
    render(<GameCard game={remixGame} />);
    expect(screen.getByText('Remix')).toBeInTheDocument();
  });

  it('does not show Remix badge for original games', () => {
    render(<GameCard game={baseGame} />);
    expect(screen.queryByText('Remix')).toBeNull();
  });

  it('renders 0 plays when playCount is undefined/falsy', () => {
    const zeroGame: Game = { ...baseGame, playCount: 0 };
    render(<GameCard game={zeroGame} />);
    expect(screen.getByText(/0 plays/)).toBeInTheDocument();
  });

  it('renders a deterministic emoji for a given game id', () => {
    const { container: c1 } = render(<GameCard game={baseGame} />);
    const { container: c2 } = render(<GameCard game={baseGame} />);
    const emoji1 = c1.querySelector('.text-4xl')?.textContent;
    const emoji2 = c2.querySelector('.text-4xl')?.textContent;
    expect(emoji1).toBe(emoji2);
    expect(emoji1).toBeTruthy();
  });
});
