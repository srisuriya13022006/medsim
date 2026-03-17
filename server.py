from flask import Flask, request, jsonify
import pandas as pd
import joblib
import random


app = Flask(__name__)

# -------------------------------
# Load model & columns
# -------------------------------
model = joblib.load("disease_model.pkl")
columns = joblib.load("model_columns.pkl")

df = pd.read_csv("Final_Augmented_dataset_Diseases_and_Symptoms.csv")

# Filter top diseases (same as training)
top_diseases = df['diseases'].value_counts().nlargest(30).index
df = df[df['diseases'].isin(top_diseases)]


def generate_explanation(symptoms, correct, predicted):
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = f"""
    You are a medical tutor helping students learn diagnosis.

    Symptoms:
    {', '.join(symptoms)}

    Correct Diagnosis: {correct}
    Model Prediction: {predicted}

    Explain:
    1. Why the correct diagnosis fits these symptoms
    2. Why similar diseases might be confusing
    3. Key learning takeaway

    Keep it simple and student-friendly.
    """

    response = model.generate_content(prompt)
    return response.text
# -------------------------------
# Helper: Generate Case
# -------------------------------
def generate_case():
    row = df.sample(1).iloc[0]

    symptoms = []
    for col in columns:
        if row[col] == 1:
            symptoms.append(col)

    case = {
        "age": random.randint(18, 70),
        "gender": random.choice(["Male", "Female"]),
        "symptoms": random.sample(symptoms, min(4, len(symptoms))),
        "disease": row["diseases"]
    }

    return case

# -------------------------------
# Helper: Prepare Input
# -------------------------------
def prepare_input(user_symptoms):
    input_data = [0] * len(columns)

    for symptom in user_symptoms:
        if symptom in columns:
            idx = columns.index(symptom)
            input_data[idx] = 1

    return [input_data]

# -------------------------------
# API: Generate Case
# -------------------------------
@app.route("/generate_case", methods=["GET"])
def get_case():
    case = generate_case()

    # Store correct answer temporarily
    app.current_case = case

    return jsonify({
        "age": case["age"],
        "gender": case["gender"],
        "symptoms": case["symptoms"]
    })

# -------------------------------
# API: Check Answer
# -------------------------------
@app.route("/check_answer", methods=["POST"])
def check_answer():
    data = request.json

    user_disease = data.get("disease")
    user_symptoms = data.get("symptoms")

    # Prepare input
    input_data = prepare_input(user_symptoms)

    # Model prediction
    probs = model.predict_proba(input_data)[0]
    predicted = model.predict(input_data)[0]

    # Top 3 predictions (PRO FEATURE 🔥)
    top3_idx = probs.argsort()[-3:][::-1]
    top3 = [model.classes_[i] for i in top3_idx]

    correct = app.current_case["disease"]

    result = "correct" if user_disease.lower() == correct.lower() else "wrong"

    return jsonify({
        "result": result,
        "your_answer": user_disease,
        "correct_answer": correct,
        "model_prediction": predicted,
        "top_predictions": top3
    })

# -------------------------------
# Run App
# -------------------------------
if __name__ == "__main__":
    app.run(port=5001, debug=True)