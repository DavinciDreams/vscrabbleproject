require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
   console.debug('New client connected:', socket.id);
     console.log('A user connected');
});
server.listen(3000, () => {
  console.log('Server listening on port 3000');
});

  socket.on('createNewRoom', () => {
    const roomCode = Math.random().toString(36).substr(2, 9);
    rooms.set(roomCode, {
      name: `Room ${roomCode}`,
      playerId: socket.id,
      game: new ScrabbleGame(),
      started: false
    });
    socket.join(roomCode);
    socket.emit('roomCreated', roomId);
    io.to(roomId).emit('playerUpdate', { 
      players: rooms.get(roomCode).players, 
      roomName: rooms.get(roomCode).name 
    });
  });
