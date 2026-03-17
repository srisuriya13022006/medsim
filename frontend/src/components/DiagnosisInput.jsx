import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Send, ArrowLeft } from 'lucide-react';

// Simple predefined suggestions for the mock UI
const SUGGESTIONS = [
    "Congestive Heart Failure",
    "Myocardial Infarction",
    "Pneumonia",
    "Pulmonary Embolism",
    "Asthma Exacerbation",
    "GERD"
];

export default function DiagnosisInput() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const caseId = location.state?.caseId || "unknown";
    const symptoms = location.state?.symptoms || [];

    const filteredSuggestions = query.trim() === ''
        ? []
        : SUGGESTIONS.filter(s => s.toLowerCase().includes(query.toLowerCase()));

    const handleSubmit = (diagnosis) => {
        if (!diagnosis) return;
        setLoading(true);

        fetch('http://localhost:5000/api/check_answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ caseId, diagnosis , symptoms}) })
            .then(res => res.json())
            .then(data => {
                setLoading(false);
                navigate('/result', { state: { result: data } });
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    return (
        <div className="card animate-fade-in">
            <button
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
                style={{ padding: '0.5rem 1rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}
            >
                <ArrowLeft size={16} /> Back to Case
            </button>

            <h2>Submit Diagnosis</h2>
            <p>Search or type your clinical diagnosis below based on the patient's presentation.</p>

            <div className="input-group">
                <label className="input-label">Primary Diagnosis</label>
                <Search className="input-icon no-label" size={20} />
                <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Heart Failure..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSubmit(query);
                    }}
                    disabled={loading}
                />

                {filteredSuggestions.length > 0 && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0, right: 0,
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderTop: 'none',
                        borderRadius: '0 0 8px 8px',
                        zIndex: 10,
                        boxShadow: 'var(--shadow-lg)'
                    }}>
                        {filteredSuggestions.map((s, idx) => (
                            <div
                                key={idx}
                                onClick={() => {
                                    setQuery(s);
                                    handleSubmit(s);
                                }}
                                style={{
                                    padding: '1rem',
                                    cursor: 'pointer',
                                    borderBottom: idx < filteredSuggestions.length - 1 ? '1px solid var(--border)' : 'none'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-hover)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                {s}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button
                    className="btn btn-primary"
                    onClick={() => handleSubmit(query)}
                    disabled={!query.trim() || loading}
                >
                    {loading ? <div className="loader" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <Send size={18} />}
                    &nbsp;Submit Answer
                </button>
            </div>
        </div>
    );
}
