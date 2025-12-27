const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.PG_USER || 'postgres',
    host: process.env.PG_HOST || 'localhost',
    database: process.env.PG_DATABASE || 'cipher_sandbox',
    password: process.env.PG_PASSWORD || 'password',
    port: process.env.PG_PORT || 5432,
});

const seedSql = `
-- Drop existing tables if any
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS users;

-- Create Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Orders Table
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    amount DECIMAL(10, 2) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Sample Users
INSERT INTO users (username, email, role, is_active, created_at) VALUES 
('alice_wonder', 'alice@example.com', 'admin', true, NOW() - INTERVAL '10 days'),
('bob_builder', 'bob@example.com', 'user', true, NOW() - INTERVAL '5 days'),
('charlie_chaplin', 'charlie@example.com', 'user', false, NOW() - INTERVAL '2 days'),
('dave_developer', 'dave@code.com', 'admin', true, NOW() - INTERVAL '1 day'),
('eve_hacker', 'eve@secure.com', 'user', true, NOW());

-- Insert Sample Orders
INSERT INTO orders (user_id, amount) VALUES 
(1, 100.50),
(1, 25.00),
(2, 50.00),
(4, 200.00),
(5, 15.99);
`;

const seedPostgres = async () => {
    try {
        console.log('Connecting to PostgreSQL...');
        const client = await pool.connect();
        console.log('Connected. Seeding data...');

        await client.query(seedSql);

        console.log('PostgreSQL seeded successfully with Users and Orders.');
        client.release();
        process.exit();
    } catch (err) {
        console.error('PostgreSQL Seed Error:', err);
        process.exit(1);
    }
};

seedPostgres();
