const express = require('express');
const router = express.Router();
const { pgPool } = require('../config/db');
const Assignment = require('../models/Assignment');

router.post('/', async (req, res) => {
    const { sql, assignmentId } = req.body;

    if (!sql) return res.status(400).json({ message: "SQL query is required" });

    // Remove comments (single line -- and multi-line /* */)
    const sqlClean = sql.replace(/--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').trim();
    const sqlTrimmed = sqlClean.toUpperCase();

    // 1. Strict Whitelist: Must start with SELECT
    if (!sqlTrimmed.startsWith('SELECT') && !sqlTrimmed.startsWith('WITH')) {
        return res.status(400).json({ message: "Security Alert: Only SELECT queries are allowed." });
    }

    // 2. Blacklist: Extra safety against chaining or sub-queries doing harm
    const forbidden = ['DROP', 'TRUNCATE', 'ALTER', 'GRANT', 'REVOKE', 'INSERT', 'UPDATE', 'DELETE', 'PG_SLEEP'];
    if (forbidden.some(word => sqlTrimmed.includes(word))) {
        return res.status(400).json({ message: `Security Alert: Command contains forbidden keywords.` });
    }

    let client;
    try {
        client = await pgPool.connect();
    } catch (connErr) {
        console.warn("Postgres unreachable, attempting fallback to Mock Data...");

        // FAILSAFE: If Postgres is down, return the preview rows from MongoDB
        if (assignmentId) {
            try {
                const assignment = await Assignment.findById(assignmentId);
                if (assignment && assignment.tables && assignment.tables.length > 0) {
                    const mockData = assignment.tables[0].previewRows || [];
                    const safeMockData = mockData.map(row => {
                        const obj = {};
                        if (row instanceof Map) row.forEach((v, k) => obj[k] = v);
                        else Object.assign(obj, row);
                        delete obj._id;
                        return obj;
                    });

                    return res.json({
                        rows: safeMockData,
                        formatted: true,
                        isMock: true,
                        message: "⚠️ Sandbox Offline: Showing Sample Data as Result"
                    });
                }
            } catch (mongoErr) {
                console.error("Mock fallback failed:", mongoErr);
            }
        }

        return res.status(503).json({
            message: "Sandbox Database (PostgreSQL) is unreachable. Is the service running on port 5432?"
        });
    }

    try {
        // Start Transaction
        await client.query('BEGIN');

        // Execute user query
        const result = await client.query(sql);

        // Always rollback
        await client.query('ROLLBACK');

        res.json({ rows: result.rows, isMock: false });
    } catch (err) {
        try { await client.query('ROLLBACK'); } catch (e) { }
        res.status(400).json({ message: err.message });
    } finally {
        if (client) client.release();
    }
});

module.exports = router;
