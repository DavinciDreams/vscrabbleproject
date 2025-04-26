"use client"

import { useMemo } from 'react';
import { useGameStore } from '@/lib/gameStore';
import { CellType } from '@/lib/constants';
import Tile from '@/components/game/Tile';
import { useDrop } from '@/hooks/useDrop';
import type { Position } from '@/types/game';

// Define special cell positions
const SPECIAL_CELLS = {
  TRIPLE_WORD: [
    {x: 0, y: 0}, {x: 7, y: 0}, {x: 14, y: 0},
    {x: 0, y: 7}, {x: 14, y: 7},
    {x: 0, y: 14}, {x: 7, y: 14}, {x: 14, y: 14},
  ],
  DOUBLE_WORD: [
    {x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3}, {x: 4, y: 4},
    {x: 1, y: 13}, {x: 2, y: 12}, {x: 3, y: 11}, {x: 4, y: 10},
    {x: 10, y: 4}, {x: 11, y: 3}, {x: 12, y: 2}, {x: 13, y: 1},
    {x: 10, y: 10}, {x: 11, y: 11}, {x: 12, y: 12}, {x: 13, y: 13},
  ],
  TRIPLE_LETTER: [
    {x: 5, y: 1}, {x: 9, y: 1}, 
    {x: 1, y: 5}, {x: 5, y: 5}, {x: 9, y: 5}, {x: 13, y: 5},
    {x: 1, y: 9}, {x: 5, y: 9}, {x: 9, y: 9}, {x: 13, y: 9},
    {x: 5, y: 13}, {x: 9, y: 13},
  ],
  DOUBLE_LETTER: [
    {x: 3, y: 0}, {x: 11, y: 0},
    {x: 6, y: 2}, {x: 8, y: 2},
    {x: 0, y: 3}, {x: 7, y: 3}, {x: 14, y: 3},
    {x: 2, y: 6}, {x: 6, y: 6}, {x: 8, y: 6}, {x: 12, y: 6},
    {x: 3, y: 7}, {x: 11, y: 7},
    {x: 2, y: 8}, {x: 6, y: 8}, {x: 8, y: 8}, {x: 12, y: 8},
    {x: 0, y: 11}, {x: 7, y: 11}, {x: 14, y: 11},
    {x: 6, y: 12}, {x: 8, y: 12},
    {x: 3, y: 14}, {x: 11, y: 14},
  ],
  START: [{x: 7, y: 7}]
};

// Function to check if a position is in a list of positions
const isPositionInList = (pos: Position, list: Position[]): boolean => {
  return list.some(p => p.x === pos.x && p.y === pos.y);
};

// Get cell type based on position
const getCellType = (x: number, y: number): CellType => {
  const pos = { x, y };
  if (isPositionInList(pos, SPECIAL_CELLS.TRIPLE_WORD)) return CellType.TRIPLE_WORD;
  if (isPositionInList(pos, SPECIAL_CELLS.DOUBLE_WORD)) return CellType.DOUBLE_WORD;
  if (isPositionInList(pos, SPECIAL_CELLS.TRIPLE_LETTER)) return CellType.TRIPLE_LETTER;
  if (isPositionInList(pos, SPECIAL_CELLS.DOUBLE_LETTER)) return CellType.DOUBLE_LETTER;
  if (isPositionInList(pos, SPECIAL_CELLS.START)) return CellType.START;
  return CellType.NORMAL;
};

// Get cell background color based on type
const getCellBackground = (cellType: CellType): string => {
  switch (cellType) {
    case CellType.TRIPLE_WORD:
      return 'bg-red-600 text-white';
    case CellType.DOUBLE_WORD:
      return 'bg-pink-300 text-black';
    case CellType.TRIPLE_LETTER:
      return 'bg-blue-600 text-white';
    case CellType.DOUBLE_LETTER:
      return 'bg-blue-300 text-black';
    case CellType.START:
      return 'bg-amber-400 text-black';
    default:
      return 'bg-muted';
  }
};

// Get cell label based on type
const getCellLabel = (cellType: CellType): string => {
  switch (cellType) {
    case CellType.TRIPLE_WORD:
      return 'TW';
    case CellType.DOUBLE_WORD:
      return 'DW';
    case CellType.TRIPLE_LETTER:
      return 'TL';
    case CellType.DOUBLE_LETTER:
      return 'DL';
    case CellType.START:
      return '★';
    default:
      return '';
  }
};

export default function GameBoard() {
  const { gameState, placeTileOnBoard } = useGameStore();
  const { handleDrop } = useDrop();
  
  // Create a 15x15 grid
  const grid = useMemo(() => {
    return Array(15).fill(null).map((_, y) => 
      Array(15).fill(null).map((_, x) => {
        const cellType = getCellType(x, y);
        const placedTile = gameState.board[y]?.[x] || null;
        return { x, y, cellType, placedTile };
      })
    );
  }, [gameState.board]);

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-2xl mb-3 text-center">Game Board</h2>
      
      <div className="inline-block border-2 border-black shadow-comic">
        {grid.map((row, y) => (
          <div key={y} className="flex">
            {row.map((cell, x) => {
              const cellType = getCellType(x, y);
              const background = getCellBackground(cellType);
              const label = getCellLabel(cellType);
              
              return (
                <div
                  key={`${x}-${y}`}
                  className={`
                    game-board-cell
                    ${background}
                    w-9 h-9 md:w-10 md:h-10 
                    flex items-center justify-center
                    relative
                  `}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleDrop(e, { x, y }, (tile) => {
                      placeTileOnBoard(tile, { x, y });
                    });
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {cell.placedTile ? (
                    <Tile
                      tile={cell.placedTile}
                      showValue
                      size="sm"
                      isPlaced
                    />
                  ) : (
                    <span className="text-xs font-bold opacity-70">{label}</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}