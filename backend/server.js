const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock Data
let casesSolved = 15;
let accuracy = 85;

// Dashboard API
app.get('/api/stats', (req, res) => {
    res.json({
        casesSolved,
        accuracy
    });
});

// Case Display API
app.get('/api/generate_case', (req, res) => {
    // Generate a mock patient case
    res.json({
        id: "case-101",
        age: 45,
        gender: "Female",
        symptoms: [
            "Shortness of breath",
            "Chest pain",
            "Fatigue",
            "Swelling in legs"
        ]
    });
});

// Diagnosis Input / Result & Feedback API
app.post('/api/check_answer', (req, res) => {
    const { caseId, diagnosis } = req.body;
    
    // Simple mock logic: if it contains "heart" or "failure", it's correct
    const expectedAnswer = "Congestive Heart Failure";
    const userDiag = diagnosis ? diagnosis.toLowerCase() : "";
    
    const isCorrect = userDiag.includes("heart") || userDiag.includes("failure");
    
    if (isCorrect) {
        casesSolved++;
        accuracy = Math.min(100, accuracy + 1); // rough mock update
    } else {
        accuracy = Math.max(0, accuracy - 1);
    }

    res.json({
        isCorrect,
        correctAnswer: expectedAnswer,
        explanation: "The patient presents with classic signs of Congestive Heart Failure, including shortness of breath, chest pain, and peripheral edema (swelling in legs)."
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
