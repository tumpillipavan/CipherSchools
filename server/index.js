const express = require('express');
const cors = require('cors');
const { connectDB, pgPool } = require('./config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.send('CipherSQLStudio API is running');
});

// Import Routes
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/query', require('./routes/query'));
app.use('/api/hints', require('./routes/hints'));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    console.log('Starting Server initialization...');

    // Start listening immediately to accept connections, even if DBs are pending
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    console.log('Connecting to MongoDB...');
    await connectDB();

    // Check PG
    console.log('Connecting to PostgreSQL...');
    try {
        const client = await pgPool.connect();
        console.log('PostgreSQL Connected');
        client.release();
    } catch (err) {
        console.warn('PostgreSQL Connection Failed (Is it running?):', err.message);
    }
};

startServer();
