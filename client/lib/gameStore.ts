import { create } from 'zustand';
import { GAME_STATUS, TILE_COUNT_MAP, LETTER_VALUES } from '@/lib/constants';
import type { Player, GameState, Tile, Position, PlacedTile } from '@/types/game';

type GameStore = {
  gameState: GameState;
  playerTiles: Tile[];
  playerId: string | null;
  playerName: string;
  setPlayerId: (id: string) => void;
  setPlayerName: (name: string) => void;
  setGameState: (state: GameState) => void;
  setPlayerTiles: (tiles: Tile[]) => void;
  updateGameBoard: (board: PlacedTile[][]) => void;
  addTilesToRack: (tiles: Tile[]) => void;
  removeTileFromRack: (tileId: string) => void;
  resetGame: () => void;
  placeTileOnBoard: (tile: Tile, position: Position) => void;
  calculateWordScore: (word: PlacedTile[]) => number;
};

// Initial state for the game board is a 15x15 grid of null values
const createEmptyBoard = (): (PlacedTile | null)[][] => {
  return Array(15).fill(null).map(() => Array(15).fill(null));
};

// Initial game state
const initialGameState: GameState = {
  id: '',
  status: GAME_STATUS.WAITING,
  players: [],
  board: createEmptyBoard(),
  currentTurn: null,
  tileBag: [],
  scores: {},
  roomCode: '',
  hostId: '',
  winner: null,
  messages: [],
};

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: initialGameState,
  playerTiles: [],
  playerId: null,
  playerName: '',
  
  setPlayerId: (id) => set({ playerId: id }),
  setPlayerName: (name) => set({ playerName: name }),
  
  setGameState: (state) => set({ gameState: state }),
  
  setPlayerTiles: (tiles) => set({ playerTiles: tiles }),
  
  updateGameBoard: (board) => set((state) => ({
    gameState: {
      ...state.gameState,
      board
    }
  })),
  
  addTilesToRack: (tiles) => set((state) => ({
    playerTiles: [...state.playerTiles, ...tiles]
  })),
  
  removeTileFromRack: (tileId) => set((state) => ({
    playerTiles: state.playerTiles.filter(tile => tile.id !== tileId)
  })),
  
  resetGame: () => set({
    gameState: initialGameState,
    playerTiles: []
  }),

  placeTileOnBoard: (tile, position) => set((state) => {
    const { x, y } = position;
    const newBoard = [...state.gameState.board];
    
    // Create a placed tile with position information
    const placedTile: PlacedTile = {
      ...tile,
      position: { x, y },
      isLocked: false
    };
    
    // Update the board with the new tile
    if (!newBoard[y]) newBoard[y] = [];
    newBoard[y][x] = placedTile;
    
    return {
      gameState: {
        ...state.gameState,
        board: newBoard
      },
      // Remove the placed tile from the player's rack
      playerTiles: state.playerTiles.filter(t => t.id !== tile.id)
    };
  }),

  calculateWordScore: (word) => {
    return word.reduce((score, tile) => {
      return score + (LETTER_VALUES[tile.letter] || 0);
    }, 0);
  }
}));