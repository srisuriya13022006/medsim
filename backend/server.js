const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Flask base URL
const FLASK_API = "http://127.0.0.1:5001"; // ⚠️ run Flask on 5001

// Mock Stats (you can later store in DB)
let casesSolved = 0;
let accuracy = 0;

// -------------------------------
// Dashboard API
// -------------------------------
app.get('/api/stats', (req, res) => {
    res.json({
        casesSolved,
        accuracy
    });
});

// -------------------------------
// Case Display API (calls Flask)
// -------------------------------
app.get('/api/generate_case', async (req, res) => {
    try {
        const response = await axios.get(`${FLASK_API}/generate_case`);

        res.json({
            id: "case-" + Date.now(),
            ...response.data
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Failed to fetch case from Flask" });
    }
});

// -------------------------------
// Check Answer API (calls Flask)
// -------------------------------
app.post('/api/check_answer', async (req, res) => {
    try {
        const { caseId, diagnosis, symptoms } = req.body;

        const response = await axios.post(`${FLASK_API}/check_answer`, {
            disease: diagnosis,
            symptoms: symptoms
        });

        const data = response.data;

        // Update stats
        if (data.result === "correct") {
            casesSolved++;
        }

        accuracy = casesSolved === 0 ? 0 : Math.round((casesSolved / (casesSolved + 1)) * 100);

        res.json({
            isCorrect: data.result === "correct",
            correctAnswer: data.correct_answer,
            modelPrediction: data.model_prediction,
            topPredictions: data.top_predictions,
            explanation: `Model suggests ${data.model_prediction} based on symptoms`
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Failed to validate answer via Flask" });
    }
});

// -------------------------------
app.listen(PORT, () => {
    console.log(`Node server running on port ${PORT}`);
});