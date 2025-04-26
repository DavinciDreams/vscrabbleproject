"use client"

import { useGameStore } from '@/lib/gameStore';
import { MAX_PLAYERS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Copy, Share2, UserCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function WaitingRoom() {
  const { gameState, playerId } = useGameStore();
  const { toast } = useToast();
  const isHost = gameState.hostId === playerId;
  
  const copyRoomCode = () => {
    navigator.clipboard.writeText(gameState.roomCode);
    toast({
      title: "Copied!",
      description: "Room code copied to clipboard"
    });
  };
  
  const shareRoom = () => {
    const roomLink = `${window.location.origin}/game/${gameState.roomCode}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join my Word Legends game!',
        text: `Join my Word Legends game with room code ${gameState.roomCode}`,
        url: roomLink
      });
    } else {
      navigator.clipboard.writeText(roomLink);
      toast({
        title: "Copied!",
        description: "Room link copied to clipboard"
      });
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="comic-header mb-8">Waiting for Players</h1>
      
      <div className="max-w-2xl mx-auto">
        <div className="comic-panel p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl mb-2">Room Code:</h2>
            <div className="inline-flex items-center gap-2 bg-muted p-3 rounded-lg">
              <span className="text-3xl font-bold tracking-wider">
                {gameState.roomCode}
              </span>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={copyRoomCode}
                className="h-8 w-8"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="speech-bubble mb-8">
            <p className="text-lg">
              {isHost
                ? "Share this code with others to join your game. You can start once at least 2 players have joined."
                : "Waiting for the host to start the game..."}
            </p>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl mb-3">Players ({gameState.players.length}/{MAX_PLAYERS}):</h3>
            <div className="space-y-2">
              {gameState.players.map((player) => (
                <div 
                  key={player.id}
                  className={`
                    flex items-center gap-3 p-3 rounded-md border
                    ${player.id === playerId ? 'border-primary' : 'border-border'}
                  `}
                >
                  <UserCircle2 className={`h-6 w-6 ${player.id === playerId ? 'text-primary' : ''}`} />
                  <span className="font-medium">
                    {player.name}
                    {player.id === playerId && " (You)"}
                  </span>
                  {player.id === gameState.hostId && (
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full ml-auto">
                      Host
                    </span>
                  )}
                </div>
              ))}
              
              {/* Placeholder slots for remaining players */}
              {Array.from({ length: MAX_PLAYERS - gameState.players.length }).map((_, index) => (
                <div 
                  key={`empty-${index}`}
                  className="flex items-center gap-3 p-3 rounded-md border border-dashed border-muted-foreground/30 bg-muted/50"
                >
                  <UserCircle2 className="h-6 w-6 text-muted-foreground/50" />
                  <span className="text-muted-foreground">Waiting for player...</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button 
              onClick={shareRoom}
              className="comic-button bg-secondary text-secondary-foreground"
            >
              <Share2 className="mr-2 h-5 w-5" />
              Share Room Link
            </Button>
            
            {isHost && (
              <Button 
                className="comic-button"
                disabled={gameState.players.length < 2}
                onClick={() => {
                  const socket = getSocket();
                  socket.emit('startGame', { roomCode: gameState.roomCode });
                }}
              >
                Start Game
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}