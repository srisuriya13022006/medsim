import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Activity, AlertCircle, ArrowRight } from 'lucide-react';

export default function CaseDisplay() {
    const [patientCase, setPatientCase] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5000/api/generate_case')
            .then(res => res.json())
            .then(data => {
                setPatientCase(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch case", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="card text-center">
                <h2>Loading Patient Case...</h2>
                <div className="loader" style={{ margin: '2rem auto' }}></div>
            </div>
        );
    }

    if (!patientCase) {
        return (
            <div className="card text-center">
                <AlertCircle size={48} color="var(--danger)" style={{ margin: '0 auto 1rem' }} />
                <h2>Error loading case</h2>
                <button className="btn btn-primary" onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="card animate-fade-in">
            <h2>Patient Presentation</h2>

            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card" style={{ padding: '1rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <User size={32} color="var(--primary)" />
                    <div>
                        <div className="stat-label">Demographics</div>
                        <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                            {patientCase.age} yo {patientCase.gender}
                        </div>
                    </div>
                </div>
                <div className="stat-card" style={{ padding: '1rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Activity size={32} color="var(--warning)" />
                    <div>
                        <div className="stat-label">Status</div>
                        <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>Needs Diagnosis</div>
                    </div>
                </div>
            </div>

            <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Reported Symptoms:</h3>
            <ul className="symptoms-list">
                {patientCase.symptoms.map((symptom, idx) => (
                    <li key={idx} className="symptom-tag">{symptom}</li>
                ))}
            </ul>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/diagnosis', { state: { caseId: patientCase.id } })}
                >
                    Proceed to Diagnosis <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
}
