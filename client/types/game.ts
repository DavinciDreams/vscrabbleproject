import { PLAYER_STATUS, GAME_STATUS, CellType } from '@/lib/constants';

export interface Position {
  x: number;
  y: number;
}

export interface Tile {
  id: string;
  letter: string;
  value: number;
}

export interface PlacedTile extends Tile {
  position: Position;
  isLocked: boolean;
}

export interface Player {
  id: string;
  name: string;
  status: typeof PLAYER_STATUS[keyof typeof PLAYER_STATUS];
  tilesCount: number;
}

export interface GameMessage {
  id: string;
  playerId: string;
  playerName: string;
  content: string;
  timestamp: number;
  type: 'chat' | 'system' | 'error';
}

export interface GameState {
  id: string;
  status: typeof GAME_STATUS[keyof typeof GAME_STATUS];
  players: Player[];
  board: (PlacedTile | null)[][];
  currentTurn: string | null; // playerId
  tileBag: Tile[];
  scores: Record<string, number>;
  roomCode: string;
  hostId: string;
  winner: string | null; // playerId
  messages: GameMessage[];
}

export interface GameMove {
  playerId: string;
  tiles: PlacedTile[];
  score: number;
  word: string;
}

export interface RoomInfo {
  roomCode: string;
  hostName: string;
  playerCount: number;
  maxPlayers: number;
  status: typeof GAME_STATUS[keyof typeof GAME_STATUS];
}