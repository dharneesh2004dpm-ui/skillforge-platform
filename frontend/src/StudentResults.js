import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudentResults() {
    const userEmail = localStorage.getItem('userEmail');
    const navigate = useNavigate();

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedResult, setSelectedResult] = useState(null); 

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
        if (!userEmail) return;
        // FIXED SYNTAX: Properly formatted API URL
        fetch(`https://skillforge-api-i4bs.onrender.com/api/my-results/${encodeURIComponent(userEmail)}`)
            .then(res => res.json())
            .then(data => {
                setResults(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching results:", err);
                setLoading(false);
            });
    }, [userEmail]);

    // --- DYNAMIC STYLES ---
    const currentStyles = {
        pageContainer: { minHeight: '100vh', backgroundColor: isDark ? '#0f172a' : '#f8fafc', color: isDark ? '#f8fafc' : '#0f172a', padding: '20px', fontFamily: 'system-ui, sans-serif', transition: 'all 0.3s ease' },
        navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, paddingBottom: '15px' },
        navButtons: { display: 'flex', gap: '10px' },
        btn: { padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', border: 'none' },
        backBtn: { backgroundColor: '#3b82f6', color: 'white' },
        themeBtn: { border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`, backgroundColor: isDark ? '#1e293b' : 'white', color: isDark ? 'white' : 'black' },
        content: { maxWidth: '1000px', margin: '0 auto' },
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
        card: { backgroundColor: isDark ? '#1e293b' : 'white', padding: '20px', borderRadius: '10px', boxShadow: isDark ? '0 4px 6px -1px rgba(0,0,0,0.5)' : '0 4px 6px -1px rgba(0,0,0,0.1)' },
        testTitle: { marginTop: '0', fontSize: '1.25rem' },
        scoreText: { fontSize: '1.1rem', fontWeight: 'bold', margin: '10px 0' },
        dateText: { color: '#94a3b8', fontSize: '0.9rem', marginBottom: '15px' },
        reviewBtn: { width: '100%', padding: '10px', backgroundColor: isDark ? '#475569' : '#e2e8f0', color: isDark ? 'white' : 'black', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
        loadingText: { textAlign: 'center', fontSize: '1.2rem', color: '#94a3b8' },
        noDataText: { textAlign: 'center', fontSize: '1.1rem', color: '#94a3b8', padding: '40px' },
        
        // Modal Styles
        modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' },
        modalContent: { backgroundColor: isDark ? '#1e293b' : 'white', padding: '20px', borderRadius: '10px', width: '100%', maxWidth: '700px', maxHeight: '85vh', overflowY: 'auto' },
        modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, paddingBottom: '10px', marginBottom: '15px' },
        closeBtn: { background: 'none', border: 'none', color: '#ef4444', fontSize: '1.5rem', cursor: 'pointer' },
        modalBody: { display: 'flex', flexDirection: 'column', gap: '15px' },
        answerRow: { backgroundColor: isDark ? '#0f172a' : '#f1f5f9', padding: '15px', borderRadius: '8px', border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}` }
    };

    return (
        <div style={currentStyles.pageContainer}>
            <nav style={currentStyles.navbar}>
                <h2>📊 My Performance Results</h2>
                <div style={currentStyles.navButtons}>
                    <button onClick={cycleTheme} style={{...currentStyles.btn, ...currentStyles.themeBtn}}>Theme: {themePref}</button>
                    <button onClick={() => navigate('/dashboard')} style={{...currentStyles.btn, ...currentStyles.backBtn}}>Back to Dashboard</button>
                </div>
            </nav>

            <div style={currentStyles.content}>
                {loading ? (
                    <p style={currentStyles.loadingText}>Loading your past results...</p>
                ) : results.length === 0 ? (
                    <p style={currentStyles.noDataText}>You haven't completed any assessments yet.</p>
                ) : (
                    <div style={currentStyles.grid}>
                        {results.map((result, index) => (
                            <div key={index} style={currentStyles.card}>
                                <h3 style={currentStyles.testTitle}>{result.testTitle || 'Aptitude Assessment'}</h3>
                                <p style={currentStyles.scoreText}>Score: <span style={{color: '#10b981'}}>{result.score} / {result.totalQuestions}</span></p>
                                <p style={currentStyles.dateText}>Completed: {new Date(result.submittedAt).toLocaleDateString()}</p>
                                <button onClick={() => setSelectedResult(result)} style={currentStyles.reviewBtn}>View Detailed Review</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detailed Review Modal */}
            {selectedResult && (
                <div style={currentStyles.modalOverlay}>
                    <div style={currentStyles.modalContent}>
                        <div style={currentStyles.modalHeader}>
                            <h3>Detailed Review: {selectedResult.testTitle}</h3>
                            <button onClick={() => setSelectedResult(null)} style={currentStyles.closeBtn}>✕</button>
                        </div>
                        <div style={currentStyles.modalBody}>
                            {selectedResult.answers && selectedResult.answers.map((ans, i) => (
                                <div key={i} style={currentStyles.answerRow}>
                                    <p style={{margin: '0 0 10px 0'}}><strong>Q: {ans.question}</strong></p>
                                    <p style={{margin: '5px 0', color: ans.isCorrect ? '#10b981' : '#ef4444'}}>
                                        Your Answer: {ans.selectedOption} {ans.isCorrect ? '✅' : '❌'}
                                    </p>
                                    {!ans.isCorrect && (
                                        <p style={{margin: '5px 0', color: '#10b981'}}>
                                            Correct Answer: {ans.correctOption}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}