const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Serve static files from public folder
app.use(express.static('public'));

// Store active users count
let activeUsers = 0;

// Handle WebSocket connections
io.on('connection', (socket) => {
  activeUsers++;
  console.log(`User connected. Active users: ${activeUsers}`);
  
  // Broadcast user count to all clients
  io.emit('userCount', activeUsers);

  // Listen for drawing data from client
  socket.on('drawing', (data) => {
    // Broadcast drawing to all other clients
    socket.broadcast.emit('drawing', data);
  });

  // Listen for clear canvas event
  socket.on('clearCanvas', () => {
    socket.broadcast.emit('clearCanvas');
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    activeUsers--;
    console.log(`User disconnected. Active users: ${activeUsers}`);
    io.emit('userCount', activeUsers);
  });
});

// Start server on port 3000
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
