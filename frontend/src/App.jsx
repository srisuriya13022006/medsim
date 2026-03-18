import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import Dashboard from './components/Dashboard';
import CaseDisplay from './components/CaseDisplay';
import DiagnosisInput from './components/DiagnosisInput';
import ResultFeedback from './components/ResultFeedback';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <Link to="/" className="header-logo">
            <Stethoscope size={28} color="var(--primary)" />
            MediSim <span>AI</span>
          </Link>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/case" element={<CaseDisplay />} />
            <Route path="/diagnosis" element={<DiagnosisInput />} />
            <Route path="/result" element={<ResultFeedback />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
