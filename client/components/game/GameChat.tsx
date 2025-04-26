"use client"

import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '@/lib/gameStore';
import { getSocket } from '@/lib/socket';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';

export default function GameChat() {
  const { gameState, playerId, playerName } = useGameStore();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socket = getSocket();
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gameState.messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    socket.emit('sendMessage', {
      roomCode: gameState.roomCode,
      content: message
    });
    
    setMessage('');
  };
  
  return (
    <div className="p-4 h-[350px] flex flex-col">
      <h3 className="text-xl mb-3 text-center">Chat</h3>
      
      <ScrollArea className="flex-1 mb-3 p-3 bg-muted rounded-md">
        {gameState.messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No messages yet
          </div>
        ) : (
          <div className="space-y-3">
            {gameState.messages.map((msg) => {
              const isCurrentPlayer = msg.playerId === playerId;
              const messageClasses = `
                p-2.5 rounded-lg max-w-[80%] break-words
                ${msg.type === 'system' ? 'bg-muted-foreground/20 text-center w-full italic text-sm' : ''}
                ${msg.type === 'error' ? 'bg-destructive/20 text-center w-full italic text-sm' : ''}
                ${msg.type === 'chat' && isCurrentPlayer ? 'ml-auto bg-accent text-accent-foreground' : ''}
                ${msg.type === 'chat' && !isCurrentPlayer ? 'bg-secondary text-secondary-foreground' : ''}
              `;
              
              return (
                <div key={msg.id} className="flex flex-col">
                  {msg.type === 'chat' && !isCurrentPlayer && (
                    <span className="text-xs ml-1 mb-1 text-muted-foreground">
                      {msg.playerName}
                    </span>
                  )}
                  
                  <div className={messageClasses}>
                    {msg.content}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>
      
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <Input
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!message.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}