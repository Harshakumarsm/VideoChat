const express = require('express');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');

const io = new Server({
  cors: {
    origin: "*", // Allow any origin for now, you can replace "*" with your front-end URL for production
  },
});

const app = express();
app.use(bodyParser.json());

const emailToSocketMapping = new Map();

io.on('connection', (socket) => {
  socket.on('join-room', (data) => {
    const { roomId, emailid } = data;
    console.log('User joined room', roomId, emailid);

    emailToSocketMapping.set(emailid, socket.id);
    socket.join(roomId); // Join the room
    socket.emit('joined-room', { roomId }); // Emit to the user
    socket.broadcast.to(roomId).emit('user-joined', { emailid }); // Broadcast to others in the room
  });
});

app.listen(8000, () => {
  console.log("HTTP server running on port 8000");
});

io.listen(8001, () => {
  console.log("Socket.IO server running on port 8001");
});
