const mongoose = require('mongoose');
const Assignment = require('./models/Assignment');
require('dotenv').config();

const sampleAssignments = [
    {
        title: "1. Select All Users",
        difficulty: "Easy",
        description: "Retrieve all columns from the users table to view the raw data.",
        question: "Write a query to select all records from the 'users' table.",
        tables: [
            {
                tableName: 'users',
                columns: [
                    { name: 'id', dataType: 'INT' },
                    { name: 'username', dataType: 'VARCHAR' },
                    { name: 'email', dataType: 'VARCHAR' },
                    { name: 'created_at', dataType: 'TIMESTAMP' }
                ],
                previewRows: [
                    { id: "1", username: "alice_wonder", email: "alice@example.com", created_at: "2023-01-01" },
                    { id: "2", username: "bob_builder", email: "bob@example.com", created_at: "2023-01-05" }
                ]
            }
        ],
        solutionQuery: "SELECT * FROM users;",
        hint: "Try using the '*' character to select all columns, and don't forget the table name 'users'."
    },
    {
        title: "2. Findings Admin Users",
        difficulty: "Easy",
        description: "Filter the users table to find only administrators.",
        question: "Select the 'username' and 'email' of all users where 'role' is 'admin'.",
        tables: [
            {
                tableName: 'users',
                columns: [
                    { name: 'id', dataType: 'INT' },
                    { name: 'username', dataType: 'VARCHAR' },
                    { name: 'email', dataType: 'VARCHAR' },
                    { name: 'role', dataType: 'VARCHAR' }
                ],
                previewRows: [
                    { id: "1", username: "alice_wonder", email: "alice@example.com", role: "admin" },
                    { id: "2", username: "bob_builder", email: "bob@example.com", role: "user" },
                    { id: "3", username: "dave_dev", email: "dave@code.com", role: "admin" }
                ]
            }
        ],
        solutionQuery: "SELECT username, email FROM users WHERE role = 'admin';",
        hint: "Use the WHERE clause to filter results. You need to check if the 'role' column equals 'admin'."
    },
    {
        title: "3. Recent Signups",
        difficulty: "Medium",
        description: "Find the 5 most recent users who joined the platform.",
        question: "Select all columns from 'users' ordered by 'created_at' descending, limited to 5 results.",
        tables: [
            {
                tableName: 'users',
                columns: [
                    { name: 'id', dataType: 'INT' },
                    { name: 'username', dataType: 'VARCHAR' },
                    { name: 'created_at', dataType: 'TIMESTAMP' }
                ],
                previewRows: [
                    { id: "5", username: "eve_hacker", created_at: "2023-01-20" },
                    { id: "4", username: "dave_dev", created_at: "2023-01-19" },
                    { id: "3", username: "charlie_c", created_at: "2023-01-18" }
                ]
            }
        ],
        solutionQuery: "SELECT * FROM users ORDER BY created_at DESC LIMIT 5;",
        hint: "Combine 'ORDER BY' with 'DESC' for descending order, and use 'LIMIT' to restrict the number of rows."
    },
    {
        title: "4. Count Users by Role",
        difficulty: "Medium",
        description: "Generate a report showing how many users exist for each role.",
        question: "Write a query to count the number of users for each 'role'. Return 'role' and the count as 'user_count'.",
        tables: [
            {
                tableName: 'users',
                columns: [
                    { name: 'id', dataType: 'INT' },
                    { name: 'role', dataType: 'VARCHAR' }
                ],
                previewRows: [
                    { id: "1", role: "admin" },
                    { id: "2", role: "user" },
                    { id: "3", role: "user" }
                ]
            }
        ],
        solutionQuery: "SELECT role, COUNT(*) as user_count FROM users GROUP BY role;",
        hint: "You'll need the 'GROUP BY' clause for this. Use 'COUNT(*)' to get the total number of users for each role."
    },
    {
        title: "5. User Orders",
        difficulty: "Hard",
        description: "Retrieve order details along with the username of the buyer.",
        question: "Select 'users.username' and 'orders.order_id', 'orders.amount' by joining 'users' and 'orders' tables on 'user_id'.",
        tables: [
            {
                tableName: 'users',
                columns: [
                    { name: 'id', dataType: 'INT' },
                    { name: 'username', dataType: 'VARCHAR' }
                ],
                previewRows: [
                    { id: "1", username: "alice_wonder" },
                    { id: "2", username: "bob_builder" }
                ]
            },
            {
                tableName: 'orders',
                columns: [
                    { name: 'order_id', dataType: 'INT' },
                    { name: 'user_id', dataType: 'INT' },
                    { name: 'amount', dataType: 'DECIMAL' }
                ],
                previewRows: [
                    { order_id: "101", user_id: "1", amount: "100.50" },
                    { order_id: "102", user_id: "1", amount: "25.00" },
                    { order_id: "103", user_id: "2", amount: "50.00" }
                ]
            }
        ],
        solutionQuery: "SELECT users.username, orders.order_id, orders.amount FROM users JOIN orders ON users.id = orders.user_id;",
        hint: "This requires a 'JOIN'. Link the two tables on the common 'id' and 'user_id' columns."
    },
    {
        title: "6. Subqueries & Nested Queries",
        difficulty: "Hard",
        description: "Solve complex problems using nested SELECT statements.",
        question: "Find the usernames of users who have placed at least one order with an amount greater than 100.",
        tables: [
            {
                tableName: 'users',
                columns: [
                    { name: 'id', dataType: 'INT' },
                    { name: 'username', dataType: 'VARCHAR' }
                ],
                previewRows: [
                    { id: "1", username: "alice_wonder" },
                    { id: "4", username: "dave_dev" }
                ]
            },
            {
                tableName: 'orders',
                columns: [
                    { name: 'order_id', dataType: 'INT' },
                    { name: 'amount', dataType: 'DECIMAL' }
                ],
                previewRows: [
                    { order_id: "101", amount: "100.50" },
                    { order_id: "104", amount: "200.00" }
                ]
            }
        ],
        solutionQuery: "SELECT username FROM users WHERE id IN (SELECT user_id FROM orders WHERE amount > 100);",
        hint: "Try using a subquery with the 'IN' operator to identify which user IDs correspond to orders over 100."
    }
];

const seed = async () => {
    try {
        console.log('Using Mongo URI:', process.env.MONGO_URI);

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);

        await Assignment.deleteMany({});
        console.log('Cleared existing assignments');

        await Assignment.insertMany(sampleAssignments);
        console.log('Seeded 5 sample assignments with PREVIEW DATA successfully');

        process.exit();
    } catch (err) {
        console.error('Seed Error:', err);
        process.exit(1);
    }
};

seed();
