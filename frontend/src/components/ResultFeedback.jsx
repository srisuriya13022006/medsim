import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, RotateCcw, ArrowRight } from 'lucide-react';

export default function ResultFeedback() {
    const location = useLocation();
    const navigate = useNavigate();
    const result = location.state?.result;

    if (!result) {
        return (
            <div className="card text-center">
                <h2>No Result Data</h2>
                <button className="btn btn-primary" onClick={() => navigate('/')}>Return Home</button>
            </div>
        );
    }

    const { isCorrect, correctAnswer, explanation } = result;

    return (
        <div className="card text-center animate-fade-in">
            <div className={`result-icon ${isCorrect ? 'correct' : 'incorrect'}`}>
                {isCorrect ? <CheckCircle size={40} /> : <XCircle size={40} />}
            </div>

            <h2 style={{ color: isCorrect ? 'var(--success)' : 'var(--danger)', fontSize: '2rem' }}>
                {isCorrect ? "Correct Diagnosis!" : "Incorrect Diagnosis"}
            </h2>

            {!isCorrect && (
                <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>The correct diagnosis was:</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>{correctAnswer}</div>
                </div>
            )}

            <div style={{
                textAlign: 'left',
                background: 'rgba(79, 70, 229, 0.05)',
                borderLeft: '4px solid var(--primary)',
                padding: '1.5rem',
                borderRadius: '4px',
                margin: '2rem 0',
                lineHeight: 1.6
            }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Explanation</h3>
                <p style={{ margin: 0, color: 'var(--text-main)' }}>{explanation}</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                    <RotateCcw size={18} /> Retry Diagnosis
                </button>
                <button className="btn btn-primary" onClick={() => navigate('/')}>
                    Next Case <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
}
