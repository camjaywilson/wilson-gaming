export interface Game {
  id: string;
  prompt: string;
  html: string;
  createdAt: number;
  playCount: number;
  parentId?: string; // set when this is a tweaked version of another game
  tweakPrompt?: string; // the tweak instruction used
}
