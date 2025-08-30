const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const os = require('os');
const osu = require('os-utils');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from public/
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Client connected');

    setInterval(() => {
        osu.cpuUsage(function(cpuPercent) {
            const stats = {
                platform: os.platform(),
                uptime: os.uptime(),
                cpuModel: os.cpus()[0].model,
                cpuCores: os.cpus().length,
                cpuSpeed: os.cpus()[0].speed,
                cpuUsage: (cpuPercent * 100).toFixed(2),
                totalMem: (os.totalmem() / 1024 / 1024).toFixed(2), // MB
                freeMem: (os.freemem() / 1024 / 1024).toFixed(2),
                usedMem: ((os.totalmem() - os.freemem()) / 1024 / 1024).toFixed(2),
                osType: os.type(),
                arch: os.arch(),
                hostname: os.hostname()
            };

            socket.emit('stats', stats);
        });
    }, 1000); // every second
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
