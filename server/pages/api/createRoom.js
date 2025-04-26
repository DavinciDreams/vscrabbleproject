import { v4 as uuidv4 } from 'uuid';
import { MAX_PLAYERS, GAME_STATUS, PLAYER_STATUS } from '../../../lib/constants';

const gameRooms = new Map();

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

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { playerName, maxPlayers } = req.body;

    const roomCode = Math.random().toString(36).substr(2, 9).toUpperCase();
    const hostId = uuidv4(); // Generate a unique host ID
    const room = createNewRoom(roomCode, hostId, playerName, maxPlayers);

    gameRooms.set(roomCode, room);

    res.status(200).json({ roomCode });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}