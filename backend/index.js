const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./infrastructure/database/mongoose');
const socketHandlers = require('./interfaces/websocket/machineSockets');

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
	'http://localhost:5173',
	'https://ba2024.onrender.com',
	'https://ba-2024-dep.vercel.app',
];

const io = new Server(server, {
	cors: {
		origin: allowedOrigins,
		methods: ['GET', 'POST'],
		credentials: true,
	},
});

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		},
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		credentials: true,
	})
);

app.use(express.json());

connectDB();

const routes = require('./interfaces/http/routes');
app.use('/api', routes);

socketHandlers(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

app.options('*', cors());
