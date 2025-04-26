"use client"

import { useGameStore } from '@/lib/gameStore';
import { UserCircle2 } from 'lucide-react';
import { PLAYER_STATUS, GAME_STATUS } from '@/lib/constants';

export default function PlayerList() {
  const { gameState, playerId } = useGameStore();
  const { players, scores, currentTurn } = gameState;
  
  return (
    <div className="p-4">
      <h3 className="text-xl mb-3 text-center">Players</h3>
      
      <div className="space-y-2">
        {players.map((player) => {
          const isCurrentPlayer = player.id === playerId;
          const isCurrentTurn = player.id === currentTurn;
          const score = scores[player.id] || 0;
          
          return (
            <div 
              key={player.id}
              className={`
                flex items-center justify-between p-2 rounded-md border
                ${isCurrentPlayer ? 'border-primary bg-primary/10' : 'border-border'}
                ${isCurrentTurn ? 'ring-2 ring-accent' : ''}
              `}
            >
              <div className="flex items-center gap-2">
                <UserCircle2 className={`
                  h-6 w-6 
                  ${isCurrentPlayer ? 'text-primary' : 'text-muted-foreground'}
                  ${isCurrentTurn ? 'animate-pulse text-accent' : ''}
                `} />
                
                <div>
                  <span className="font-medium">
                    {player.name}
                    {isCurrentPlayer && " (You)"}
                  </span>
                  
                  {isCurrentTurn && gameState.status === GAME_STATUS.ACTIVE && (
                    <span className="ml-2 text-xs bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full">
                      Current Turn
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-muted px-2 py-1 rounded text-sm">
                  {player.tilesCount} tiles
                </div>
                
                <div className="font-bold">
                  {score} pts
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}