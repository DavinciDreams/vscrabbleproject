import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { 
  TILE_COUNT_MAP, 
  LETTER_VALUES,
  PLAYER_TILE_COUNT,
  GAME_STATUS,
  PLAYER_STATUS,
  MAX_PLAYERS,
  //DICTIONARY_API
} from '../../../lib/constants';

export const gameRooms = new Map();

const SocketHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.io server...');
    
    const io = new Server(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      transports: ['polling', 'websocket'],
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: false
      },
      maxHttpBufferSize: 1e8,
      pingTimeout: 60000
    });
    
    io.on('connection', (socket) => {
      console.debug('New client connected:', socket.id);

  socket.on('createNewRoom', () => {
    const roomCode = Math.random().toString(36).substr(2, 9);
    const hostId = socket.id;
    const hostName = 'Host'; // You might want to get the host name from the client
    const room = createNewRoom(roomCode, hostId, hostName, MAX_PLAYERS);

    gameRooms.set(roomCode, room);
    socket.join(roomCode);
    socket.emit('roomCreated', roomCode);
    io.to(roomCode).emit('gameState', room);
  });
      socket.on('joinRoom', ({ playerName, isHost, maxPlayers = MAX_PLAYERS, roomCode }) => {
        console.log(`Player ${playerName} isHost: ${isHost}`);
        let room = gameRooms.get(roomCode);
        
        if (!room && !isHost) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }
        
        const playerId = uuidv4();
        socket.emit('playerId', playerId);
        
        if (room) {
          if (room.players.length >= room.maxPlayers) {
            socket.emit('error', { message: 'Room is full' });
            return;
          }
          
          room.players.push({
            id: playerId,
            name: playerName,
            status: PLAYER_STATUS.CONNECTED,
            tilesCount: 0
          });
          
          room.scores[playerId] = 0;
          io.to(roomCode).emit('gameState', room);
        } else if (isHost) {
          room = createNewRoom(roomCode, playerId, playerName, maxPlayers);
          gameRooms.set(roomCode, room);
        }
        
        socket.join(roomCode);
        socket.data.roomCode = roomCode;
        socket.data.playerId = playerId;
        socket.data.playerName = playerName;
        
        socket.emit('gameState', room);
        addSystemMessage(room, `${playerName} joined the game`);
        io.to(roomCode).emit('gameState', room);
      });
      
      socket.on('startGame', ({ roomCode }) => {
        const room = gameRooms.get(roomCode);
        
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }
        
        if (socket.data.playerId !== room.hostId) {
          socket.emit('error', { message: 'Only the host can start the game' });
          return;
        }
        
        if (room.players.length < 1) {
          socket.emit('error', { message: 'Need at least 1 players to start' });
          return;
        }
        
        startGame(room);
        io.to(roomCode).emit('gameState', room);
        
        room.players.forEach(player => {
          io.to(roomCode).emit('playerTiles', { 
            playerId: player.id, 
            tiles: room.playerTiles[player.id] || [] 
          });
        });
      });
      
      socket.on('disconnect', () => {
        const { roomCode, playerId, playerName } = socket.data;
        
        if (roomCode && playerId) {
          const room = gameRooms.get(roomCode);
          
          if (room) {
            const playerIndex = room.players.findIndex(p => p.id === playerId);
            
            if (playerIndex >= 0) {
              if (playerId === room.hostId) {
                addSystemMessage(room, `${playerName} (host) left the game. Game ended.`);
                room.status = GAME_STATUS.FINISHED;
              } else {
                room.players[playerIndex].status = PLAYER_STATUS.DISCONNECTED;
                addSystemMessage(room, `${playerName} left the game`);
                
                if (room.currentTurn === playerId) {
                  nextTurn(room);
                }
              }
              
              io.to(roomCode).emit('gameState', room);
              
              setTimeout(() => {
                const updatedRoom = gameRooms.get(roomCode);
                if (updatedRoom && updatedRoom.players.every(p => p.status === PLAYER_STATUS.DISCONNECTED)) {
                  gameRooms.delete(roomCode);
                  console.log(`Room ${roomCode} removed due to all players disconnected`);
                }
              }, 5000);
            }
          }
        }
        
        console.log('Client disconnected:', socket.id);
      });
    });
    
    res.socket.server.io = io;
  }
  
  res.end();
};

function createNewRoom(roomCode, hostId, hostName, maxPlayers) {
  return {
    id: uuidv4(),
    roomCode,
    hostId,
    status: GAME_STATUS.WAITING,
    players: [{
      id: hostId,
      name: hostName,
      status: PLAYER_STATUS.CONNECTED,
      tilesCount: 0
    }],
    scores: { [hostId]: 0 },
    board: Array(15).fill(null).map(() => Array(15).fill(null)),
    tileBag: [],
    playerTiles: {},
    currentTurn: null,
    maxPlayers: Math.min(parseInt(maxPlayers) || MAX_PLAYERS, MAX_PLAYERS),
    messages: [{
      id: uuidv4(),
      playerId: 'system',
      playerName: 'System',
      content: `Game room created by ${hostName}`,
      timestamp: Date.now(),
      type: 'system'
    }]
  };
}

function startGame(room) {
  room.status = GAME_STATUS.ACTIVE;
  room.tileBag = createTileBag();
  
  room.players.forEach(player => {
    const tiles = drawTiles(room.tileBag, PLAYER_TILE_COUNT);
    room.playerTiles[player.id] = tiles;
    
    const playerIndex = room.players.findIndex(p => p.id === player.id);
    if (playerIndex >= 0) {
      room.players[playerIndex].tilesCount = tiles.length;
    }
  });
  
  const firstPlayerIndex = Math.floor(Math.random() * room.players.length);
  room.currentTurn = room.players[firstPlayerIndex].id;
  
  addSystemMessage(room, 'Game started!');
  addSystemMessage(room, `${room.players[firstPlayerIndex].name} goes first`);
}

function createTileBag() {
  const tiles = [];
  let id = 0;
  
  Object.entries(TILE_COUNT_MAP).forEach(([letter, count]) => {
    for (let i = 0; i < count; i++) {
      tiles.push({
        id: `tile-${id++}`,
        letter,
        value: LETTER_VALUES[letter] || 0
      });
    }
  });
  
  return shuffleArray(tiles);
}

function drawTiles(tileBag, count) {
  return tileBag.splice(0, count);
}

function nextTurn(room) {
  const currentPlayerIndex = room.players.findIndex(p => p.id === room.currentTurn);
  let nextPlayerIndex = currentPlayerIndex;
  let iterations = 0;
  
  do {
    nextPlayerIndex = (nextPlayerIndex + 1) % room.players.length;
    iterations++;
    
    if (iterations >= room.players.length) {
      break;
    }
  } while (room.players[nextPlayerIndex].status !== PLAYER_STATUS.CONNECTED);
  
  room.currentTurn = room.players[nextPlayerIndex].id;
}

function addSystemMessage(room, content) {
  room.messages.push({
    id: uuidv4(),
    playerId: 'system',
    playerName: 'System',
    content,
    timestamp: Date.now(),
    type: 'system'
  });
}

function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default SocketHandler;