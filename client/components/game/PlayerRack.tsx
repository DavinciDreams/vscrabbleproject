"use client"

import { useState } from 'react';
import { useGameStore } from '@/lib/gameStore';
import { useDrag } from '@/hooks/useDrag';
import Tile from '@/components/game/Tile';
import { GAME_STATUS } from '@/lib/constants';
import type { Tile as TileType } from '@/types/game';

export default function PlayerRack() {
  const { gameState, playerTiles, playerId } = useGameStore();
  const [rackTiles, setRackTiles] = useState<TileType[]>([]);
  const isPlayerTurn = gameState.currentTurn === playerId;
  const isGameActive = gameState.status === GAME_STATUS.ACTIVE;
  
  // Handle drag start for tiles
  const { startDrag } = useDrag();
  
  const handleDragStart = (tile: TileType) => {
    if (!isPlayerTurn || !isGameActive) return false;
    startDrag(tile);
    return true;
  };
  
  return (
    <div className="p-4">
      <h3 className="text-xl mb-3 text-center">Your Tiles</h3>
      
      <div className="relative bg-muted p-2 rounded-lg border-2 border-black min-h-[70px] flex justify-center">
        {playerTiles.length === 0 ? (
          <div className="flex items-center justify-center h-16 text-muted-foreground">
            No tiles in your rack
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-2">
            {playerTiles.map((tile) => (
              <div 
                key={tile.id} 
                className={`${!isPlayerTurn || !isGameActive ? 'opacity-70 cursor-not-allowed' : 'cursor-grab'}`}
              >
                <Tile 
                  tile={tile} 
                  onDragStart={() => handleDragStart(tile)}
                  showValue
                  size="md"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      
      {!isPlayerTurn && isGameActive && (
        <div className="mt-2 text-center text-sm text-muted-foreground">
          Wait for your turn to play
        </div>
      )}
    </div>
  );
}