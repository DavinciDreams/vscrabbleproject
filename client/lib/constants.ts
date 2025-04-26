export const GAME_STATUS = {
  WAITING: 'waiting',
  STARTING: 'starting',
  ACTIVE: 'active',
  FINISHED: 'finished',
};

export const PLAYER_STATUS = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  PLAYING: 'playing',
  WAITING: 'waiting',
};

// Map of how many of each letter should be in the tile bag
export const TILE_COUNT_MAP: Record<string, number> = {
  'A': 9, 'B': 2, 'C': 2, 'D': 4, 'E': 12, 'F': 2, 'G': 3, 'H': 2, 'I': 9,
  'J': 1, 'K': 1, 'L': 4, 'M': 2, 'N': 6, 'O': 8, 'P': 2, 'Q': 1, 'R': 6,
  'S': 4, 'T': 6, 'U': 4, 'V': 2, 'W': 2, 'X': 1, 'Y': 2, 'Z': 1, '_': 2, // _ is blank
};

// Point values for each letter
export const LETTER_VALUES: Record<string, number> = {
  'A': 1, 'B': 3, 'C': 3, 'D': 2, 'E': 1, 'F': 4, 'G': 2, 'H': 4, 'I': 1,
  'J': 8, 'K': 5, 'L': 1, 'M': 3, 'N': 1, 'O': 1, 'P': 3, 'Q': 10, 'R': 1,
  'S': 1, 'T': 1, 'U': 1, 'V': 4, 'W': 4, 'X': 8, 'Y': 4, 'Z': 10, '_': 0, // _ is blank
};

// Special board cells - Double Letter, Triple Letter, Double Word, Triple Word
export enum CellType {
  NORMAL = 'normal',
  DOUBLE_LETTER = 'double_letter',
  TRIPLE_LETTER = 'triple_letter',
  DOUBLE_WORD = 'double_word',
  TRIPLE_WORD = 'triple_word',
  START = 'start',
}

// Dictionary API endpoint for word validation
export const DICTIONARY_API = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

// The maximum number of players in a game
export const MAX_PLAYERS = 4;

// Number of tiles each player starts with
export const PLAYER_TILE_COUNT = 7;