import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GlobalLeaderboard() {
    const navigate = useNavigate();
    const [tests, setTests] = useState([]);
    const [selectedTestId, setSelectedTestId] = useState('');
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(false);

    // --- THEME LOGIC ---
    const [themePref, setThemePref] = useState(localStorage.getItem('appTheme') || 'system');
    const [isSysDark, setIsSysDark] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => setIsSysDark(e.matches);
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const isDark = themePref === 'dark' || (themePref === 'system' && isSysDark);
    const cycleTheme = () => {
        const next = themePref === 'system' ? 'light' : themePref === 'light' ? 'dark' : 'system';
        setThemePref(next);
        localStorage.setItem('appTheme', next);
    };

    // --- FETCH LOGIC ---
    useEffect(() => {
        // FIXED SYNTAX: Removed the broken ${ } block
        fetch('https://skillforge-api-i4bs.onrender.com/api/tests')
            .then(res => res.json())
            .then(data => {
                setTests(data);
                if (data.length > 0) setSelectedTestId(data[0]._id);
            })
            .catch(err => console.error("Error fetching tests:", err));
    }, []);

    useEffect(() => {
        if (!selectedTestId) return;
        setLoading(true);
        // FIXED SYNTAX: Using backticks to inject selectedTestId correctly
        fetch(`https://skillforge-api-i4bs.onrender.com/api/results/${selectedTestId}`)
            .then(res => res.json())
            .then(data => {
                setLeaderboardData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching leaderboard:", err);
                setLoading(false);
            });
    }, [selectedTestId]);

    const getMedal = (index) => {
        if (index === 0) return '🥇';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return `#${index + 1}`;
    };

    // --- DYNAMIC STYLES ---
    const currentStyles = {
        pageContainer: { minHeight: '100vh', backgroundColor: isDark ? '#0f172a' : '#f8fafc', color: isDark ? '#f8fafc' : '#0f172a', padding: '20px', fontFamily: 'system-ui, sans-serif', transition: 'all 0.3s ease' },
        navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, paddingBottom: '15px' },
        navButtons: { display: 'flex', gap: '10px' },
        btn: { padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', border: 'none' },
        backBtn: { backgroundColor: '#3b82f6', color: 'white' },
        themeBtn: { border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`, backgroundColor: isDark ? '#1e293b' : 'white', color: isDark ? 'white' : 'black' },
        content: { maxWidth: '800px', margin: '0 auto' },
        selectorContainer: { marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' },
        label: { fontSize: '1.1rem', fontWeight: 'bold' },
        select: { padding: '10px', borderRadius: '6px', border: `1px solid ${isDark ? '#475569' : '#cbd5e1'}`, backgroundColor: isDark ? '#1e293b' : '#f1f5f9', color: isDark ? 'white' : 'black', fontSize: '1rem', width: '300px' },
        tableContainer: { backgroundColor: isDark ? '#1e293b' : 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
        table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
        th: { padding: '15px', backgroundColor: isDark ? '#334155' : '#e2e8f0', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.05em' },
        tr: { borderBottom: `1px solid ${isDark ? '#334155' : '#e2e8f0'}` },
        td: { padding: '15px', fontSize: '1rem' },
        tdRank: { padding: '15px', fontSize: '1.2rem', fontWeight: 'bold' },
        tdScore: { padding: '15px', fontSize: '1rem', fontWeight: 'bold', color: '#10b981' },
        loadingText: { textAlign: 'center', fontSize: '1.2rem', color: '#94a3b8', marginTop: '40px' },
        noDataText: { textAlign: 'center', padding: '30px', color: '#94a3b8', fontSize: '1.1rem' }
    };

    return (
        <div style={currentStyles.pageContainer}>
            <nav style={currentStyles.navbar}>
                <h2>🏆 Global Leaderboard</h2>
                <div style={currentStyles.navButtons}>
                    <button onClick={cycleTheme} style={{...currentStyles.btn, ...currentStyles.themeBtn}}>Theme: {themePref}</button>
                    <button onClick={() => navigate('/dashboard')} style={{...currentStyles.btn, ...currentStyles.backBtn}}>Back to Dashboard</button>
                </div>
            </nav>

            <div style={currentStyles.content}>
                <div style={currentStyles.selectorContainer}>
                    <label style={currentStyles.label}>Select Assessment: </label>
                    <select value={selectedTestId} onChange={(e) => setSelectedTestId(e.target.value)} style={currentStyles.select}>
                        {tests.map(test => (
                            <option key={test._id} value={test._id}>{test.title}</option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <p style={currentStyles.loadingText}>Loading ranks...</p>
                ) : (
                    <div style={currentStyles.tableContainer}>
                        {leaderboardData.length > 0 ? (
                            <table style={currentStyles.table}>
                                <thead>
                                    <tr>
                                        <th style={currentStyles.th}>Rank</th>
                                        <th style={currentStyles.th}>Student Name</th>
                                        <th style={currentStyles.th}>Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboardData.map((result, index) => (
                                        <tr key={index} style={currentStyles.tr}>
                                            <td style={currentStyles.tdRank}>{getMedal(index)}</td>
                                            <td style={currentStyles.td}>{result.userName || result.userEmail}</td>
                                            <td style={currentStyles.tdScore}>{result.score} / {result.totalQuestions}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p style={currentStyles.noDataText}>No results available for this assessment yet.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}