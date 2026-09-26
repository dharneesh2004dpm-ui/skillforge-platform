import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminTestCreator from './AdminTestCreator'; // Your assessment engine

export default function AdminDashboard() {
    const navigate = useNavigate();
    const adminName = localStorage.getItem('userName') || 'Admin';

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

    const isDark = themePref === 'dark' || (themePref === 'system' && isSysDark);

    // --- DASHBOARD STATE ---
    const [activeTab, setActiveTab] = useState('add');
    const [topicsList, setTopicsList] = useState([]);
    const [stats, setStats] = useState({ totalTopics: 0 });

    // Add Question State
    const [topic, setTopic] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [options, setOptions] = useState([
        { letter: 'A', text: '' }, { letter: 'B', text: '' }, 
        { letter: 'C', text: '' }, { letter: 'D', text: '' }
    ]);
    const [correctAnswer, setCorrectAnswer] = useState('A');
    const [explanation, setExplanation] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Manage Questions State
    const [manageTopic, setManageTopic] = useState('');
    const [manageQuestions, setManageQuestions] = useState([]);

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = () => {
        fetch(`${https://skillforge-api-i4bs.onrender.com}/api/tests`)
            .then(res => res.json())
            .then(data => {
                setTopicsList(data);
                setStats({ totalTopics: data.length });
            })
            .catch(err => console.error(err));
    };

    // Fetch questions when Manage tab is active and a topic is selected
    useEffect(() => {
        if (activeTab === 'manage' && manageTopic) {
            fetch(`${https://skillforge-api-i4bs.onrender.com}/api/practice/${encodeURIComponent(manageTopic)}`)
                .then(res => res.json())
                .then(setManageQuestions)
                .catch(err => console.error(err));
        }
    }, [manageTopic, activeTab]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    // --- ADD QUESTION LOGIC ---
    const handleOptionChange = (index, value) => {
        const newOpts = [...options];
        newOpts[index].text = value;
        setOptions(newOpts);
    };

    const addOption = () => {
        if (options.length >= 6) return;
        const nextLetter = String.fromCharCode(65 + options.length);
        setOptions([...options, { letter: nextLetter, text: '' }]);
    };

    const removeOption = () => {
        if (options.length <= 2) return;
        const newOpts = options.slice(0, -1);
        setOptions(newOpts);
        if (!newOpts.find(o => o.letter === correctAnswer)) setCorrectAnswer('A');
    };

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        if (!topic.trim() || !questionText.trim()) return alert('Topic and Question Text are required.');
        setIsSubmitting(true);

        try {
            const res = await fetch(`${https://skillforge-api-i4bs.onrender.com}/api/practice`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, questionText, options, correctAnswer, explanation })
            });

            if (res.ok) {
                alert('Question Added Successfully!');
                setQuestionText('');
                setOptions([{ letter: 'A', text: '' }, { letter: 'B', text: '' }, { letter: 'C', text: '' }, { letter: 'D', text: '' }]);
                setCorrectAnswer('A');
                setExplanation('');
                fetchTopics();
            } else {
                alert('Failed to add question.');
            }
        } catch (err) {
            console.error(err);
            alert('Server error.');
        }
        setIsSubmitting(false);
    };

    // --- MANAGE QUESTION LOGIC ---
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this question?")) return;
        try {
            const res = await fetch(`${https://skillforge-api-i4bs.onrender.com}/api/practice/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setManageQuestions(manageQuestions.filter(q => q._id !== id));
                alert('Question deleted.');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to delete.');
        }
    };

    // --- DYNAMIC STYLES ---
    const currentStyles = {
        pageContainer: { 
            minHeight: '100vh', 
            background: isDark 
                ? `linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.95)), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop') center/cover fixed` 
                : `linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)`, 
            fontFamily: "'Inter', sans-serif", color: isDark ? '#f8fafc' : '#0f172a', paddingBottom: '50px',
            transition: 'background 0.3s ease, color 0.3s ease'
        },
        navbar: { padding: '15px 0', borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)' },
        navContent: { maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' },
        logo: { margin: 0, fontSize: '1.5rem', fontWeight: '800', letterSpacing: '1px', color: isDark ? '#fff' : '#0ea5e9' },
        navButtons: { display: 'flex', alignItems: 'center', gap: '15px' },
        themeToggleBtn: {
            background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.1)',
            padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', color: isDark ? '#fff' : '#0f172a',
            display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 'bold', transition: 'all 0.2s'
        },
        logoutBtn: { background: 'transparent', color: isDark ? '#ef4444' : '#dc2626', border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(220, 38, 38, 0.3)', padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' },
        
        mainContent: { maxWidth: '1200px', margin: '40px auto', padding: '0 20px' },
        header: { marginBottom: '30px', textAlign: 'center' },
        title: { fontSize: '2rem', margin: '0 0 10px 0', color: isDark ? '#fff' : '#0f172a' },
        subtitle: { fontSize: '1rem', color: isDark ? '#94a3b8' : '#475569', margin: 0 },
        
        panel: { background: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.9)', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '30px', boxShadow: isDark ? 'none' : '0 10px 25px -5px rgba(0, 0, 0, 0.05)' },
        
        tabContainer: { display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', paddingBottom: '15px' },
        activeTab: { flex: 1, background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', border: '1px solid #6366f1', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: 'all 0.2s' },
        inactiveTab: { flex: 1, background: 'transparent', color: isDark ? '#94a3b8' : '#64748b', border: '1px solid transparent', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', transition: 'all 0.2s' },
        
        inputGroup: { marginBottom: '20px' },
        label: { display: 'block', fontSize: '0.9rem', color: isDark ? '#cbd5e1' : '#475569', marginBottom: '8px', fontWeight: '500' },
        input: { width: '100%', padding: '12px', background: isDark ? 'rgba(15, 23, 42, 0.6)' : '#fff', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1', borderRadius: '8px', color: isDark ? 'white' : '#0f172a', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' },
        
        optionsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
        miniBtn: { background: 'rgba(255,255,255,0.1)', color: isDark ? '#fff' : '#0f172a', border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid #cbd5e1', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', transition: 'all 0.2s' },
        
        submitBtn: { background: '#10b981', color: 'white', border: 'none', padding: '15px', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold', width: '100%', marginTop: '10px' },
        
        statsCard: { background: isDark ? 'rgba(15, 23, 42, 0.5)' : '#f8fafc', padding: '20px', borderRadius: '8px', marginTop: '30px', border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #e2e8f0' },
        questionCard: { background: isDark ? 'rgba(15, 23, 42, 0.6)' : '#f8fafc', padding: '20px', borderRadius: '8px', border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #e2e8f0', marginBottom: '15px' },
        deleteBtn: { background: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '15px' }
    };

    return (
        <div style={currentStyles.pageContainer}>
            {/* Top Navbar */}
            <nav style={currentStyles.navbar}>
                <div style={currentStyles.navContent}>
                    <h1 style={currentStyles.logo}>SkillForge <span style={{fontSize:'12px', background:'#6366f1', color:'white', padding:'4px 8px', borderRadius:'4px'}}>ADMIN</span></h1>
                    <div style={currentStyles.navButtons}>
                        <button onClick={cycleTheme} style={currentStyles.themeToggleBtn}>
                            {themePref === 'system' ? '💻 System' : themePref === 'dark' ? '🌙 Dark' : '☀️ Light'}
                        </button>
                        <button onClick={handleLogout} style={currentStyles.logoutBtn}>Logout</button>
                    </div>
                </div>
            </nav>

            <main style={currentStyles.mainContent}>
                <div style={currentStyles.header}>
                    <h2 style={currentStyles.title}>Practice & Assessment Console</h2>
                    <p style={currentStyles.subtitle}>Add questions, manage database, or build custom tests.</p>
                </div>

                <div style={currentStyles.panel}>
                    {/* Tab Navigation */}
                    <div style={currentStyles.tabContainer}>
                        <button onClick={() => setActiveTab('add')} style={activeTab === 'add' ? currentStyles.activeTab : currentStyles.inactiveTab}>+ Add Question</button>
                        <button onClick={() => setActiveTab('manage')} style={activeTab === 'manage' ? currentStyles.activeTab : currentStyles.inactiveTab}>📝 Manage / Delete</button>
                        <button onClick={() => setActiveTab('engine')} style={activeTab === 'engine' ? currentStyles.activeTab : currentStyles.inactiveTab}>🚀 Assessment Engine</button>
                    </div>

                    {/* TAB 1: ADD QUESTION */}
                    {activeTab === 'add' && (
                        <form onSubmit={handleAddQuestion}>
                            <div style={currentStyles.inputGroup}>
                                <label style={currentStyles.label}>Aptitude Topic</label>
                                <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} required placeholder="e.g., Problems on Trains" style={currentStyles.input} />
                            </div>

                            <div style={currentStyles.inputGroup}>
                                <label style={currentStyles.label}>Question Text</label>
                                <textarea value={questionText} onChange={(e) => setQuestionText(e.target.value)} required placeholder="e.g., A train running at 60 km/hr..." style={{...currentStyles.input, height: '80px'}} />
                            </div>

                            <div style={currentStyles.inputGroup}>
                                <div style={currentStyles.optionsHeader}>
                                    <label style={{...currentStyles.label, marginBottom: 0}}>Answer Options</label>
                                    <div style={{display: 'flex', gap: '10px'}}>
                                        <button type="button" onClick={removeOption} style={currentStyles.miniBtn}>- Remove</button>
                                        <button type="button" onClick={addOption} style={currentStyles.miniBtn}>+ Add</button>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    {options.map((opt, i) => (
                                        <div key={i}>
                                            <label style={{...currentStyles.label, fontSize: '12px'}}>Option {opt.letter}</label>
                                            <input type="text" value={opt.text} onChange={(e) => handleOptionChange(i, e.target.value)} style={currentStyles.input} required />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={currentStyles.inputGroup}>
                                <label style={currentStyles.label}>Correct Answer</label>
                                <select value={correctAnswer} onChange={e => setCorrectAnswer(e.target.value)} style={currentStyles.input}>
                                    {options.map(o => <option key={o.letter} value={o.letter}>Option {o.letter}</option>)}
                                </select>
                            </div>

                            <div style={currentStyles.inputGroup}>
                                <label style={currentStyles.label}>Step-by-Step Explanation (Optional)</label>
                                <textarea value={explanation} onChange={e => setExplanation(e.target.value)} placeholder="Show the math... (Leave blank if none)" style={{...currentStyles.input, height: '80px'}} />
                            </div>

                            <button type="submit" style={currentStyles.submitBtn} disabled={isSubmitting}>
                                {isSubmitting ? 'Publishing...' : 'Publish to Database'}
                            </button>

                            <div style={currentStyles.statsCard}>
                                <span style={{color: isDark ? '#cbd5e1' : '#475569', fontWeight: 'bold'}}>📊 Database Stats</span>
                                <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '10px'}}>
                                    <span style={{color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.9rem'}}>Total Topics</span>
                                    <span style={{color: isDark ? '#fff' : '#0f172a', fontWeight: 'bold'}}>{stats.totalTopics}</span>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* TAB 2: MANAGE / DELETE */}
                    {activeTab === 'manage' && (
                        <div>
                            <div style={currentStyles.inputGroup}>
                                <label style={currentStyles.label}>Select Topic to Manage</label>
                                <select value={manageTopic} onChange={e => setManageTopic(e.target.value)} style={currentStyles.input}>
                                    <option value="">-- Choose a Topic --</option>
                                    {topicsList.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            <div style={{ marginTop: '20px' }}>
                                {manageQuestions.length === 0 && manageTopic ? (
                                    <p style={{ color: currentStyles.label.color }}>No questions found for this topic.</p>
                                ) : (
                                    manageQuestions.map((q, idx) => (
                                        <div key={q._id} style={currentStyles.questionCard}>
                                            <p style={{ margin: '0 0 10px 0', fontSize: '1rem', fontWeight: 'bold' }}>Q{idx + 1}. {q.questionText}</p>
                                            <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: isDark ? '#10b981' : '#059669' }}>Correct Answer: {q.correctAnswer}</p>
                                            <button onClick={() => handleDelete(q._id)} style={currentStyles.deleteBtn}>Delete Question</button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* TAB 3: ASSESSMENT ENGINE (The file we previously built!) */}
                    {activeTab === 'engine' && (
                        <div style={{ marginTop: '20px' }}>
                            {/* This seamlessly drops in the engine you already have */}
                            <AdminTestCreator />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}