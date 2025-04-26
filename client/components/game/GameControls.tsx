"use client"

import { useState } from 'react';
import { getSocket } from '@/lib/socket';
import { useGameStore } from '@/lib/gameStore';
import { Button } from '@/components/ui/button';
import { 
  PlayCircle, CheckCircle, XCircle, RefreshCw, 
  SkipForward, Share2, ClipboardCopy 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GAME_STATUS } from '@/lib/constants';

export default function GameControls() {
  const { gameState, playerId } = useGameStore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  
  const isHost = gameState.hostId === playerId;
  const isWaitingToStart = gameState.status === GAME_STATUS.WAITING;
  const isPlayerTurn = gameState.currentTurn === playerId;
  const isGameActive = gameState.status === GAME_STATUS.ACTIVE;
  
  const socket = getSocket();
  
  // Start the game (host only)
  const handleStartGame = () => {
    if (!isHost) return;
    
    socket.emit('startGame', {
      roomCode: gameState.roomCode
    });
  };
  
  // Submit a move (play word)
  const handleSubmitMove = () => {
    if (!isPlayerTurn || !isGameActive) return;
    
    setIsSubmitting(true);
    
    socket.emit('submitMove', {
      roomCode: gameState.roomCode
    }, (response: { success: boolean, message?: string }) => {
      setIsSubmitting(false);
      
      if (!response.success) {
        toast({
          title: "Invalid move",
          description: response.message || "Your move is invalid",
          variant: "destructive"
        });
      }
    });
  };
  
  // Skip turn
  const handleSkipTurn = () => {
    if (!isPlayerTurn || !isGameActive) return;
    
    setIsSkipping(true);
    
    socket.emit('skipTurn', {
      roomCode: gameState.roomCode
    }, () => {
      setIsSkipping(false);
    });
  };
  
  // Reset tiles (put back on rack)
  const handleResetTiles = () => {
    if (!isPlayerTurn || !isGameActive) return;
    
    socket.emit('resetMove', {
      roomCode: gameState.roomCode
    });
  };
  
  // Share room link
  const handleShareRoom = () => {
    const roomLink = `${window.location.origin}/game/${gameState.roomCode}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join my Word Legends game!',
        text: `Join my Word Legends game with room code ${gameState.roomCode}`,
        url: roomLink
      }).catch(() => {
        copyToClipboard(roomLink);
      });
    } else {
      copyToClipboard(roomLink);
    }
  };
  
  // Copy room code to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Link copied!",
      description: "Game link copied to clipboard"
    });
  };
  
  if (isWaitingToStart) {
    return (
      <div className="p-4">
        <h3 className="text-xl mb-3 text-center">Game Controls</h3>
        
        <div className="space-y-3">
          {isHost ? (
            <Button
              className="w-full comic-button"
              onClick={handleStartGame}
              disabled={gameState.players.length < 2}
            >
              <PlayCircle className="mr-2 h-5 w-5" />
              Start Game
            </Button>
          ) : (
            <div className="text-center p-3 bg-muted rounded-md">
              Waiting for host to start the game...
            </div>
          )}
          
          <Button
            className="w-full comic-button bg-secondary text-secondary-foreground"
            onClick={handleShareRoom}
          >
            <Share2 className="mr-2 h-5 w-5" />
            Share Room Link
          </Button>
          
          <Button
            className="w-full"
            variant="outline"
            onClick={() => copyToClipboard(gameState.roomCode)}
          >
            <ClipboardCopy className="mr-2 h-4 w-4" />
            Copy Room Code: {gameState.roomCode}
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <h3 className="text-xl mb-3 text-center">Game Controls</h3>
      
      <div className="space-y-3">
        <Button
          className="w-full comic-button bg-accent text-accent-foreground"
          onClick={handleSubmitMove}
          disabled={!isPlayerTurn || isSubmitting || !isGameActive}
        >
          <CheckCircle className="mr-2 h-5 w-5" />
          {isSubmitting ? "Submitting..." : "Submit Word"}
        </Button>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={handleResetTiles}
            disabled={!isPlayerTurn || !isGameActive}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Tiles
          </Button>
          
          <Button
            variant="outline"
            onClick={handleSkipTurn}
            disabled={!isPlayerTurn || isSkipping || !isGameActive}
          >
            <SkipForward className="mr-2 h-4 w-4" />
            {isSkipping ? "Skipping..." : "Skip Turn"}
          </Button>
        </div>
        
        <Button
          className="w-full"
          variant="secondary"
          onClick={handleShareRoom}
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share Room
        </Button>
      </div>
    </div>
  );
}