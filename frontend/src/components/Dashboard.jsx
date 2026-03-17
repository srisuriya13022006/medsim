import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, CheckCircle2, Play } from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState({ casesSolved: 0, accuracy: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5000/api/stats')
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch stats", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="card text-center">
            <h1>Welcome to MediSim AI</h1>
            <p>Test your clinical diagnostic skills with AI-generated patient cases.</p>

            {loading ? (
                <div className="loader" style={{ margin: '2rem auto' }}></div>
            ) : (
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-value">{stats.casesSolved}</div>
                        <div className="stat-label">
                            <CheckCircle2 size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} />
                            Cases Solved
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{stats.accuracy}%</div>
                        <div className="stat-label">
                            <Activity size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} />
                            Avg. Accuracy
                        </div>
                    </div>
                </div>
            )}

            <button className="btn btn-primary" onClick={() => navigate('/case')} style={{ marginTop: '1rem', width: '100%' }}>
                <Play size={20} /> Start New Case
            </button>
        </div>
    );
}
