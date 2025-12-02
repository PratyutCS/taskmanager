require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const workLogRoutes = require('./routes/workLogRoutes');
const { startAgingScheduler } = require('./services/scheduler');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Be more specific in production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Connect to database
connectDB().then(() => {
    // Start the scheduler after DB connection is established
    startAgingScheduler(io);
});

// Middleware
app.use(cors());
app.use(express.json());

// Middleware to attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});
  
// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/worklog', workLogRoutes);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
