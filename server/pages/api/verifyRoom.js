import { gameRooms } from './socket';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { roomCode } = req.query;

    if (!roomCode) {
      return res.status(400).json({ message: 'Room code is required' });
    }

    const room = gameRooms.get(roomCode.toUpperCase());

    if (room) {
      res.status(200).json({ message: 'Room exists' });
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}