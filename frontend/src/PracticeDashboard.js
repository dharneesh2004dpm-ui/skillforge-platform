import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PracticeDashboard() {
    const navigate = useNavigate();
    const [liveTests, setLiveTests] = useState([]);
    const userName = localStorage.getItem('userName') || 'Student';

    // --- THEME STATE ---
    const [themePref, setThemePref] = useState(localStorage.getItem('appTheme') || 'system');
    const [isSysDark, setIsSysDark] = useState(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

    // Listen for system theme changes
    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e) => setIsSysDark(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    const cycleTheme = () => {
        const nextTheme = themePref === 'system' ? 'light' : themePref === 'light' ? 'dark' : 'system';
        setThemePref(nextTheme);
        localStorage.setItem('appTheme', nextTheme);
    };

    // Determine final active theme
    const isDark = themePref === 'dark' || (themePref === 'system' && isSysDark);

    // --- FETCH DATA ---
    useEffect(() => {
        fetch('https://skillforge-api-i4bs.onrender.com/api/tests')
            .then(res => res.json())
            .then(data => {
                const now = new Date();
                const active = data.filter(test => {
                    if (!test.isActive) return false;
                    return now <= new Date(test.scheduledEnd); 
                });
                setLiveTests(active);
            })
            .catch(err => console.error("Error fetching live tests:", err));
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    // --- DYNAMIC STYLES ---
    const styles = {
        pageContainer: { 
            minHeight: '100vh', 
            background: isDark 
                ? `linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.95)), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop') center/cover fixed` 
                : `linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)`, 
            fontFamily: "'Inter', sans-serif", 
            color: isDark ? '#f8fafc' : '#0f172a', 
            paddingBottom: '80px',
            transition: 'background 0.3s ease, color 0.3s ease'
        },
        navbar: { padding: '20px 0', borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)' },
        navContent: { maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' },
        logo: { margin: 0, fontSize: '1.5rem', fontWeight: '800', letterSpacing: '1px', color: isDark ? '#fff' : '#0ea5e9', textShadow: isDark ? '0 4px 20px rgba(56, 189, 248, 0.4)' : 'none' },
        
        navButtons: { display: 'flex', alignItems: 'center', gap: '15px' },
        themeToggleBtn: {
            background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.1)',
            padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', color: isDark ? '#fff' : '#0f172a',
            display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 'bold', transition: 'all 0.2s'
        },
        logoutBtn: { background: 'transparent', color: isDark ? '#94a3b8' : '#64748b', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.2)', padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.3s', fontWeight: 'bold' },
        
        mainContent: { maxWidth: '1000px', margin: '40px auto', padding: '0 20px' },
        header: { marginBottom: '30px' },
        welcomeText: { fontSize: '1.8rem', margin: '0 0 8px 0', fontWeight: '700' },
        subtitle: { fontSize: '0.95rem', color: isDark ? '#94a3b8' : '#475569', margin: 0 },
        
        topGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '50px' },
        primaryCard: { background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', padding: '25px', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#fff' },
        secondaryCard: { background: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.9)', padding: '25px', borderRadius: '12px', cursor: 'pointer', border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: isDark ? 'none' : '0 10px 25px -5px rgba(0, 0, 0, 0.05)' },
        icon: { fontSize: '1.5rem', marginBottom: '15px' },
        cardTitle: { fontSize: '1.1rem', margin: '0 0 8px 0', fontWeight: '600', color: isDark ? '#fff' : '#0f172a' },
        cardText: { fontSize: '0.85rem', color: isDark ? '#cbd5e1' : '#64748b', margin: 0, opacity: 0.9 },
        
        assessmentsSection: { marginTop: '20px' },
        sectionHeading: { fontSize: '1.4rem', fontWeight: '600', margin: '0 0 25px 0', borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', paddingBottom: '10px' },
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
        emptyState: { textAlign: 'center', padding: '60px 20px', background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.5)', borderRadius: '12px', border: isDark ? '1px dashed rgba(255,255,255,0.2)' : '1px dashed rgba(0,0,0,0.2)' },
        
        liveTestCard: { background: isDark ? 'rgba(16, 185, 129, 0.05)' : '#ffffff', border: isDark ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(16, 185, 129, 0.5)', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', boxShadow: isDark ? 'none' : '0 10px 15px -3px rgba(0, 0, 0, 0.05)' },
        testTitle: { color: isDark ? '#10b981' : '#059669', margin: '0 0 15px 0', fontSize: '1.2rem' },
        liveBadge: { fontSize: '11px', padding: '4px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', color: isDark ? '#10b981' : '#059669', border: isDark ? '1px solid #10b981' : '1px solid #059669', fontWeight: 'bold' },
        upcomingBadge: { fontSize: '11px', padding: '4px 8px', borderRadius: '4px', background: 'rgba(234, 179, 8, 0.1)', color: isDark ? '#eab308' : '#b45309', border: isDark ? '1px solid #eab308' : '1px solid #b45309', fontWeight: 'bold' },
        testMeta: { display: 'flex', justifyContent: 'space-between', color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.85rem', paddingBottom: '20px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.1)', marginBottom: '20px' },
        startBtn: { background: '#10b981', color: 'white', border: 'none', padding: '12px', width: '100%', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem' },
        disabledBtn: { background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: isDark ? '#64748b' : '#94a3b8', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', padding: '12px', width: '100%', borderRadius: '6px', cursor: 'not-allowed', fontSize: '0.95rem' }
    };

    return (
        <div style={styles.pageContainer}>
            <nav style={styles.navbar}>
                <div style={styles.navContent}>
                    <h1 style={styles.logo}>SkillForge</h1>
                    
                    <div style={styles.navButtons}>
                        <button onClick={cycleTheme} style={styles.themeToggleBtn}>
                            {themePref === 'system' ? '💻 System' : themePref === 'dark' ? '🌙 Dark' : '☀️ Light'}
                        </button>
                        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                    </div>
                </div>
            </nav>

            <main style={styles.mainContent}>
                <div style={styles.header}>
                    <h2 style={styles.welcomeText}>Welcome back, {userName}</h2>
                    <p style={styles.subtitle}>Ready to elevate your trajectory today?</p>
                </div>

                <div style={styles.topGrid}>
                    <div style={styles.primaryCard} onClick={() => navigate('/aptitude')}>
                        <div style={styles.icon}>🚀</div>
                        <h3 style={{...styles.cardTitle, color: 'white'}}>Practice Engine</h3>
                        <p style={{...styles.cardText, color: 'rgba(255,255,255,0.9)'}}>Master aptitude & technical questions</p>
                    </div>

                    <div style={styles.secondaryCard} onClick={() => navigate('/results')}>
                        <div style={styles.icon}>📊</div>
                        <h3 style={styles.cardTitle}>View My Results</h3>
                        <p style={styles.cardText}>Track your performance analytics</p>
                    </div>

                    <div style={styles.secondaryCard} onClick={() => navigate('/leaderboard')}>
                        <div style={styles.icon}>🏆</div>
                        <h3 style={styles.cardTitle}>Leaderboard</h3>
                        <p style={styles.cardText}>See where you rank globally</p>
                    </div>
                </div>

                <div style={styles.assessmentsSection}>
                    <h2 style={styles.sectionHeading}>Live Assessments</h2>
                    
                    {liveTests.length === 0 ? (
                        <div style={styles.emptyState}>
                            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
                            <h3 style={{ color: isDark ? '#f8fafc' : '#0f172a', margin: '0 0 10px 0' }}>No Live Tests Available</h3>
                            <p style={{ color: isDark ? '#64748b' : '#475569', margin: 0, fontSize: '0.95rem' }}>Check back later or wait for an admin to schedule a new assessment.</p>
                        </div>
                    ) : (
                        <div style={styles.grid}>
                            {liveTests.map(test => {
                                const isLive = new Date() >= new Date(test.scheduledStart);
                                return (
                                    <div key={test._id} style={styles.liveTestCard}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <h3 style={styles.testTitle}>{test.title}</h3>
                                            <span style={isLive ? styles.liveBadge : styles.upcomingBadge}>
                                                {isLive ? 'LIVE 🟢' : 'UPCOMING 🟡'}
                                            </span>
                                        </div>
                                        
                                        <div style={styles.testMeta}>
                                            <span>📝 {test.questions.length} Qs</span>
                                            <span>⏱️ {test.durationMinutes} Mins</span>
                                            <span>🔄 Max {test.maxAttempts} Attempt(s)</span>
                                        </div>

                                        <button 
                                            onClick={() => navigate('/assessments', { state: { testToStart: test } })} 
                                            style={isLive ? styles.startBtn : styles.disabledBtn}
                                            disabled={!isLive}
                                        >
                                            {isLive ? 'Start Assessment' : `Starts at ${new Date(test.scheduledStart).toLocaleTimeString()}`}
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}