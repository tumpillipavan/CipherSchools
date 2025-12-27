const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const axios = require('axios');

router.post('/', async (req, res) => {
    const { assignmentId, userQuery } = req.body;

    try {
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) return res.status(404).json({ message: "Assignment not found" });

        const apiKey = process.env.LLM_API_KEY;

        // Force Mock Mode if configured (avoids API calls entirely)
        if (process.env.USE_MOCK_HINTS === 'true') {
            const fallbackHint = assignment.hint || "Try checking your SQL syntax or clauses.";
            return res.json({
                hint: `[MOCK MODE] ${fallbackHint}`
            });
        }

        if (!apiKey || apiKey === 'your_key_here') {
            // Fallback Mock if no key provided
            return res.json({
                hint: `[MOCK HINT] Try checking your WHERE clause. (Configure LLM_API_KEY in server/.env for real AI)`
            });
        }

        // Generic OpenAI-compatible API call (works with OpenAI, DeepSeek, etc.)
        // Adjust URL/Model based on provider
        try {
            const llmRes = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful SQL tutor. Provide a conceptual hint for the user's query relative to the assignment. Do NOT give the full solution or write SQL code blocks. Focus on the logic (e.g., 'Try using a WHERE clause')." },
                    { role: "user", content: `Assignment: ${assignment.question}. \n\n User Query: ${userQuery}. \n\n Solution (Hidden): ${assignment.solutionQuery}` }
                ],
                max_tokens: 100
            }, {
                headers: { 'Authorization': `Bearer ${apiKey}` }
            });

            const hint = llmRes.data.choices[0].message.content;
            res.json({ hint });

        } catch (apiErr) {
            console.error("LLM API Error (Falling back to Static Hint):", apiErr.response?.data || apiErr.message);
            // If AI fails, use the static hint from the database
            const fallbackHint = assignment.hint || "Try checking your SQL syntax or clauses (AI is currently offline).";
            res.json({ hint: `(Mock Hint) ${fallbackHint}` });
        }

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
