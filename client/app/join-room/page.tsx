"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function JoinRoomPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinRoom = async () => {
    if (!playerName.trim()) {
      toast({
        title: "Name required!",
        description: "Please enter your name to join a room",
        variant: "destructive",
      });
      return;
    }

    if (!roomCode.trim()) {
      toast({
        title: "Room code required!",
        description: "Please enter a room code to join",
        variant: "destructive",
      });
      return;
    }

    setIsJoining(true);

    try {
      const response = await fetch(`/api/verifyRoom?roomCode=${roomCode.toUpperCase()}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      router.push(`/game/${roomCode.toUpperCase()}?name=${encodeURIComponent(playerName)}`);
    } catch (error) {
      toast({
        title: "Error joining room",
        description: "Invalid room code or room is full",
        variant: "destructive",
      });
      setIsJoining(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="comic-header mb-10">JOIN A GAME</h1>

      <div className="max-w-md mx-auto">
        <Card className="comic-panel">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Enter Game Details</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="playerName">Your Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="playerName"
                  placeholder="Enter your name"
                  className="pl-10"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomCode">Room Code</Label>
              <Input
                id="roomCode"
                placeholder="Enter room code (6 characters)"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="text-center text-lg font-bold tracking-wider"
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button
              onClick={handleJoinRoom}
              disabled={isJoining || !playerName.trim() || !roomCode.trim()}
              className="w-full comic-button"
            >
              {isJoining ? "Joining..." : "Join Game"}
              {!isJoining && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
