const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// Game State (In Memory)
let players = {};

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Handle Player Join
    socket.on('join_game', (data) => {
        players[socket.id] = {
            id: socket.id,
            classId: data.classId,
            name: `Player ${Object.keys(players).length + 1}`,
            hp: 100,
            maxHp: 100
        };
        // Broadcast updated player list
        io.emit('player_list_update', Object.values(players));
        console.log(`Player Joined: ${players[socket.id].name}`);
    });

    // Handle Disconnect
    socket.on('disconnect', () => {
        delete players[socket.id];
        io.emit('player_list_update', Object.values(players));
        console.log(`User Disconnected: ${socket.id}`);
    });

    // Mock Global Chat/Log
    socket.on('send_action', (actionText) => {
        io.emit('game_log', `[${players[socket.id]?.name || 'Unknown'}] ${actionText}`);
    });
});

server.listen(3001, () => {
    console.log('SERVER RUNNING ON PORT 3001');
});
