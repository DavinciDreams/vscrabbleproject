import Link from 'next/link';
import { BookOpenText, Users, Trophy } from 'lucide-react';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="comic-header text-center text-6xl">WORD LEGENDS</h1>
      
      <div className="max-w-3xl mx-auto">
        <div className="comic-panel mt-8 flex flex-col items-center p-8">
          <h2 className="text-3xl mb-6 text-center">THE ULTIMATE WORD BATTLE</h2>
          
          <div className="speech-bubble mb-8">
            <p className="text-xl">Challenge your friends in this exciting multiplayer word game! Create rooms, share links, and compete to see who has the best vocabulary!</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-4 mb-8">
            <div className="flex flex-col items-center p-4 bg-muted rounded-md">
              <Users className="w-12 h-12 mb-2 text-accent" />
              <h3 className="text-xl mb-2">2-4 Players</h3>
              <p className="text-center text-sm">Invite friends to your game room</p>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-muted rounded-md">
              <BookOpenText className="w-12 h-12 mb-2 text-accent" />
              <h3 className="text-xl mb-2">Word Mastery</h3>
              <p className="text-center text-sm">Test your vocabulary skills</p>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-muted rounded-md">
              <Trophy className="w-12 h-12 mb-2 text-accent" />
              <h3 className="text-xl mb-2">Score Big</h3>
              <p className="text-center text-sm">Earn points with strategic word placement</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link href="/create-room" className="comic-button">
              Create Game
            </Link>
            <Link href="/join-room" className="comic-button bg-accent text-accent-foreground">
              Join Game
            </Link>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 Word Legends | A retro-comic multiplayer word game</p>
        </div>
      </div>
    </main>
  );
}