import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GlobalLeaderboard() {
    const navigate = useNavigate();
    const [tests, setTests] = useState([]);
    const [selectedTestId, setSelectedTestId] = useState('');
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch available tests for the dropdown
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/tests`)
            .then(res => res.json())
            .then(data => {
                setTests(data);
                if (data.length > 0) setSelectedTestId(data[0]._id); 
            })
            .catch(err => console.error(err));
    }, []);

    // Fetch leaderboard data when a test is selected
    useEffect(() => {
        if (!selectedTestId) return;
        setLoading(true);
        fetch(`${process.env.REACT_APP_API_URL}/api/results/${selectedTestId}`)
            .then(res => res.json())
            .then(data => {
                setLeaderboardData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [selectedTestId]);

    const getMedal = (index) => {
        if (index === 0) return '🥇';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return `#${index + 1}`;
    };

    return (
        <div style={styles.pageContainer}>
            <nav style={styles.navbar}>
                <div style={styles.navContent}>
                    <h1 style={styles.logo}>SkillForge <span style={styles.badge}>GLOBAL</span></h1>
                    <button onClick={() => navigate('/practice')} style={styles.outlineBtn}>Back to Dashboard</button>
                </div>
            </nav>

            <main style={styles.mainContent}>
                <div style={styles.header}>
                    <h2 style={styles.welcomeText}>Global Leaderboard</h2>
                    <p style={styles.subtitle}>See where you stand among top performers.</p>
                </div>

                <div style={styles.selectorCard}>
                    <label style={{ color: '#cbd5e1', marginRight: '15px', fontSize: '1.1rem' }}>Select Assessment:</label>
                    <select 
                        value={selectedTestId} 
                        onChange={e => setSelectedTestId(e.target.value)} 
                        style={styles.selectInput}
                    >
                        {tests.map(test => (
                            <option key={test._id} value={test._id}>{test.title}</option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <p style={{ textAlign: 'center', color: '#94a3b8' }}>Crunching the rankings...</p>
                ) : leaderboardData.length === 0 ? (
                    <div style={styles.emptyState}>
                        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>No results published for this assessment yet.</p>
                    </div>
                ) : (
                    <div style={styles.boardContainer}>
                        {leaderboardData.map((res, idx) => (
                            <div key={res._id} style={{
                                ...styles.rankCard,
                                background: idx === 0 ? 'rgba(234, 179, 8, 0.1)' : idx === 1 ? 'rgba(148, 163, 184, 0.1)' : idx === 2 ? 'rgba(180, 83, 9, 0.1)' : 'rgba(30, 41, 59, 0.4)',
                                border: idx === 0 ? '1px solid #eab308' : '1px solid rgba(255,255,255,0.05)'
                            }}>
                                <div style={styles.rankBadge}>{getMedal(idx)}</div>
                                <div style={{ flex: 1, marginLeft: '20px' }}>
                                    <h3 style={{ margin: '0 0 5px 0', color: idx === 0 ? '#fde047' : '#fff', fontSize: '1.2rem' }}>{res.userName}</h3>
                                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>Submitted: {new Date(res.submittedAt).toLocaleDateString()}</p>
                                </div>
                                <div style={styles.scoreBox}>
                                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>{res.score}</span>
                                    <span style={{ color: '#64748b' }}> / {res.totalMarks}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

const styles = {
    pageContainer: { minHeight: '100vh', background: `linear-gradient(rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.98))`, fontFamily: "'Inter', sans-serif", color: '#f8fafc' },
    navbar: { padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' },
    navContent: { maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' },
    logo: { margin: 0, fontSize: '1.5rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' },
    badge: { fontSize: '0.8rem', background: '#eab308', color: '#000', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold' },
    outlineBtn: { background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer' },
    mainContent: { maxWidth: '800px', margin: '40px auto', padding: '0 20px' },
    header: { marginBottom: '40px', textAlign: 'center' },
    welcomeText: { fontSize: '2.2rem', margin: '0 0 10px 0', fontWeight: '700' },
    subtitle: { fontSize: '1.1rem', color: '#94a3b8', margin: 0 },
    selectorCard: { background: 'rgba(30, 41, 59, 0.5)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px' },
    selectInput: { background: '#0f172a', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 15px', borderRadius: '8px', fontSize: '1rem', width: '300px', outline: 'none' },
    emptyState: { textAlign: 'center', padding: '50px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.2)' },
    boardContainer: { display: 'flex', flexDirection: 'column', gap: '15px' },
    rankCard: { display: 'flex', alignItems: 'center', padding: '20px', borderRadius: '12px', transition: 'transform 0.2s' },
    rankBadge: { fontSize: '2rem', width: '50px', textAlign: 'center', fontWeight: 'bold', color: '#94a3b8' },
    scoreBox: { background: 'rgba(0,0,0,0.3)', padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }
};