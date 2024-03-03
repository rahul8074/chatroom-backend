const express = require("express");
const app = express();
const httpServer = require('http').createServer(app);

// Socket.IO
const io = require('socket.io')(httpServer, {
    cors: {
        origin: "https://ravanchatroom.netlify.app", // specific origin you want to give access to,
        methods: ["GET", "POST"], // allow only specified methods
        allowedHeaders: ["my-custom-header"], // allow only specified headers
        credentials: true // allow credentials (if needed)
    }
});

// Store connected users
const connectedUsers = {};

// Event handling for socket connection
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected');
        // Remove user from connected users list
        delete connectedUsers[socket.id];
    });

    // Handle chat message event
    socket.on('message', (msg) => {
        // Emit the message to all connected clients along with sender's socket ID
        io.emit('message', { sender: socket.id, text: msg });
    });

    // Store user information when they connect
    socket.on('user', (user) => {
        console.log('User details received:', user);
        // Store user information with their socket ID
        connectedUsers[socket.id] = user;
    });

    console.log("last line --------------");
});

// Start the server
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
