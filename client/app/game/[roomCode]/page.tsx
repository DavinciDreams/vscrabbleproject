"use client"

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { getSocket } from '@/lib/socket';
import { useGameStore } from '@/lib/gameStore';
import GameBoard from '@/components/game/GameBoard';
import PlayerRack from '@/components/game/PlayerRack';
import PlayerList from '@/components/game/PlayerList';
import GameControls from '@/components/game/GameControls';
import GameChat from '@/components/game/GameChat';
import WaitingRoom from '@/components/game/WaitingRoom';
import { GAME_STATUS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

export default function GameRoom() {
  const router = useRouter();
  const params = useParams<{ roomCode: string }>();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const playerName = searchParams.get('name') || '';
  const isHost = searchParams.get('host') === 'true';
  const maxPlayers = parseInt(searchParams.get('maxPlayers') || '4', 10);
  
  const roomCode = params.roomCode as string;
  
  const { 
    gameState, 
    playerId, 
    playerName: storedPlayerName,
    setPlayerId, 
    setPlayerName: setStoredPlayerName,
    setGameState 
  } = useGameStore();
  
  const [connected, setConnected] = useState(false);
  
  useEffect(() => {
    if (!playerName) {
      router.push('/join-room');
      return;
    }
    
    // Initialize and connect socket
    const socket = getSocket();
    
    if (!socket.connected) {
      socket.connect();
    }
    
    // Set player name in store
    setStoredPlayerName(playerName);
    
    // Join room event handler
    const handleJoinRoom = () => {
      socket.emit('joinRoom', { 
        roomCode, 
        playerName, 
        isHost, 
        maxPlayers 
      });
    };
    
    // Game state update handler
    const handleGameState = (newState: any) => {
      console.log('Game state updated:', newState);
      setGameState(newState);
    };
    
    // Player ID assignment handler
    const handlePlayerId = (id: string) => {
      console.log('Player ID assigned:', id);
      setPlayerId(id);
      setConnected(true);
    };
    
    // Error handler
    const handleError = (error: { message: string }) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      
      // Navigate back to home on critical errors
      if (error.message.includes('Room not found') || 
          error.message.includes('Room is full')) {
        router.push('/');
      }
    };
    
    // Set up event listeners
    socket.on('connect', handleJoinRoom);
    socket.on('gameState', handleGameState);
    socket.on('playerId', handlePlayerId);
    socket.on('error', handleError);
    
    // Clean up on unmount
    return () => {
      socket.off('connect', handleJoinRoom);
      socket.off('gameState', handleGameState);
      socket.off('playerId', handlePlayerId);
      socket.off('error', handleError);
      socket.disconnect();
    };
  }, [
    playerName, 
    roomCode, 
    isHost, 
    maxPlayers, 
    router, 
    setPlayerId, 
    setStoredPlayerName,
    setGameState,
    toast
  ]);
  
  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="comic-panel p-8 text-center">
          <h2 className="text-2xl mb-4">Connecting to game...</h2>
          <div className="mt-4 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Show waiting room if game hasn't started
  if (gameState.status === GAME_STATUS.WAITING) {
    return <WaitingRoom />;
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="comic-panel mb-6">
            <GameBoard />
          </div>
          
          <div className="comic-panel">
            <PlayerRack />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="comic-panel">
            <PlayerList />
          </div>
          
          <div className="comic-panel">
            <GameControls />
          </div>
          
          <div className="comic-panel">
            <GameChat />
          </div>
        </div>
      </div>
    </div>
  );
}