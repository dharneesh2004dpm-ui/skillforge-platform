import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Master list of all Aptitude Topics
const ALL_TOPICS = [
    "Problems on Trains", "Time and Distance", "Height and Distance", 
    "Time and Work", "Simple Interest", "Compound Interest", 
    "Profit and Loss", "Partnership", "Percentage", 
    "Problems on Ages", "Calendar", "Clock", 
    "Average", "Area", "Volume and Surface Area", 
    "Permutation and Combination", "Numbers", "Problems on Numbers", 
    "Problems on H.C.F and L.C.M", "Decimal Fraction", "Simplification", 
    "Square Root and Cube Root", "Surds and Indices", "Ratio and Proportion", 
    "Chain Rule", "Pipes and Cistern", "Boats and Streams", 
    "Alligation or Mixture", "Logarithm", "Races and Games", 
    "Stocks and Shares", "Probability", "True Discount", 
    "Banker's Discount", "Odd Man Out and Series"
];

export default function PracticeSession() {
    const navigate = useNavigate();
    
    const [view, setView] = useState('topics'); 
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTopic, setActiveTopic] = useState('');
    
    // Dynamic Topic List state
    const [topicList, setTopicList] = useState(ALL_TOPICS);
    
    // State to hold live questions from MongoDB
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const [attempts, setAttempts] = useState({});

    // Fetch custom topics from DB when the page loads
    useEffect(() => {
        const fetchCustomTopics = async () => {
            try {
                // FIXED: Now points to live Render backend
                const response = await fetch('https://skillforge-api-i4bs.onrender.com/api/topics');
                if (response.ok) {
                    const dbTopics = await response.json();
                    // Merge hardcoded topics with custom DB topics and remove duplicates
                    const combinedTopics = Array.from(new Set([...ALL_TOPICS, ...dbTopics]));
                    setTopicList(combinedTopics);
                }
            } catch (error) {
                console.error("Could not load custom topics:", error);
            }
        };
        fetchCustomTopics();
    }, []);

    // Filter against the dynamically updated topicList
    const filteredTopics = topicList.filter(topic => 
        topic.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Fetch live data when a topic is clicked
    const handleTopicClick = async (topic) => {
        setActiveTopic(topic);
        setView('quiz');
        setAttempts({});
        setQuestions([]);
        setIsLoading(true);
        window.scrollTo(0, 0);

        try {
            // FIXED: Now points to live Render backend
            const response = await fetch(`https://skillforge-api-i4bs.onrender.com/api/practice/${encodeURIComponent(topic)}`);
            if (response.ok) {
                const data = await response.json();
                setQuestions(data);
            } else {
                console.error("Failed to fetch questions");
            }
        } catch (error) {
            console.error("Network error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOptionClick = (qId, optionLetter, correctLetter) => {
        setAttempts(prev => {
            const questionState = prev[qId] || { clicked: [], solved: false };
            
            if (questionState.solved) return prev;
            if (questionState.clicked.includes(optionLetter)) return prev;

            const isCorrect = optionLetter === correctLetter;
            
            return {
                ...prev,
                [qId]: {
                    clicked: [...questionState.clicked, optionLetter],
                    solved: isCorrect
                }
            };
        });
    };

    const getOptionStyle = (qId, optionLetter, correctLetter) => {
        const questionState = attempts[qId] || { clicked: [], solved: false };
        
        if (questionState.solved && optionLetter === correctLetter) {
            return { ...styles.optionBtn, ...styles.correctOption };
        }
        if (questionState.clicked.includes(optionLetter) && optionLetter !== correctLetter) {
            return { ...styles.optionBtn, ...styles.wrongOption };
        }
        return styles.optionBtn;
    };

    return (
        <div style={styles.pageContainer}>
            <nav style={styles.navbar}>
                <div style={styles.navContent}>
                    <h1 style={styles.logo}>SkillForge</h1>
                    <button onClick={() => navigate('/practice')} style={styles.logoutBtn}>Dashboard</button>
                </div>
            </nav>

            <main style={styles.mainContent}>
                
                {/* --- VIEW 1: TOPIC SELECTION --- */}
                {view === 'topics' && (
                    <>
                        <div style={styles.header}>
                            <h2 style={styles.welcomeText}>Aptitude Practice</h2>
                            <p style={styles.subtitle}>Select a topic to begin your training</p>
                        </div>
                        
                        <div style={styles.searchContainer}>
                            <span style={styles.searchIcon}>🔍</span>
                            <input 
                                type="text" 
                                placeholder="Filter topics..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={styles.searchInput}
                            />
                        </div>

                        <div style={styles.topicsGrid}>
                            {filteredTopics.map((topic, index) => (
                                <div key={index} onClick={() => handleTopicClick(topic)} style={styles.topicCard}>
                                    <span style={styles.folderIcon}>📁</span>
                                    <span style={styles.topicName}>{topic}</span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* --- VIEW 2: INTERACTIVE QUIZ --- */}
                {view === 'quiz' && (
                    <div style={styles.quizContainer}>
                        <div style={styles.quizHeader}>
                            <button onClick={() => setView('topics')} style={styles.backBtn}>← Back to Topics</button>
                            <h2 style={styles.quizTitle}>{activeTopic}</h2>
                        </div>

                        {isLoading ? (
                            <div style={styles.emptyStateCard}>
                                <h4 style={styles.emptyStateText}>Loading Questions...</h4>
                                <p style={styles.emptyStateSubtext}>Fetching live data from the database.</p>
                            </div>
                        ) : questions.length === 0 ? (
                            <div style={styles.emptyStateCard}>
                                <h4 style={styles.emptyStateText}>No Questions Yet</h4>
                                <p style={styles.emptyStateSubtext}>Admins haven't added any questions for {activeTopic} to the database yet.</p>
                            </div>
                        ) : (
                            // Render Live Questions from MongoDB
                            questions.map((q, index) => {
                                const questionState = attempts[q._id] || { clicked: [], solved: false };
                                
                                return (
                                    <div key={q._id} style={styles.questionCard}>
                                        <h3 style={styles.questionText}>
                                            <span style={styles.qNum}>{index + 1}.</span> {q.questionText}
                                        </h3>
                                        
                                        <div style={styles.optionsList}>
                                            {/* Map through the dynamic options array from the database */}
                                            {q.options.map((opt) => (
                                                <button 
                                                    key={opt.letter}
                                                    onClick={() => handleOptionClick(q._id, opt.letter, q.correctAnswer)}
                                                    style={getOptionStyle(q._id, opt.letter, q.correctAnswer)}
                                                    disabled={questionState.solved}
                                                >
                                                    <span style={styles.optionLetter}>{opt.letter}</span>
                                                    {opt.text}
                                                    
                                                    {questionState.solved && opt.letter === q.correctAnswer && <span style={styles.statusIcon}>✅</span>}
                                                    {questionState.clicked.includes(opt.letter) && opt.letter !== q.correctAnswer && <span style={styles.statusIcon}>❌</span>}
                                                </button>
                                            ))}
                                        </div>

                                        {questionState.solved && q.explanation && (
                                            <div style={styles.explanationBox}>
                                                <h4 style={styles.explanationTitle}>Explanation:</h4>
                                                <p style={styles.explanationText}>
                                                    {q.explanation.split('\n').map((line, i) => (
                                                        <React.Fragment key={i}>
                                                            {line} <br/>
                                                        </React.Fragment>
                                                    ))}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

// --- ATTRACTIVE GLASSMORPHISM STYLES ---
const styles = {
    pageContainer: { minHeight: '100vh', background: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.95)), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop') center/cover fixed`, fontFamily: "'Inter', sans-serif", color: '#f8fafc' },
    navbar: { padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' },
    navContent: { maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' },
    logo: { margin: 0, fontSize: '1.8rem', fontWeight: '800', letterSpacing: '1px', color: '#fff' },
    logoutBtn: { background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.3s' },
    mainContent: { maxWidth: '1200px', margin: '40px auto', padding: '0 20px' },
    header: { marginBottom: '30px' },
    welcomeText: { fontSize: '2.5rem', margin: '0 0 10px 0', fontWeight: '700', textShadow: '0 2px 10px rgba(0,0,0,0.5)' },
    subtitle: { fontSize: '1.1rem', color: '#94a3b8', margin: 0 },
    searchContainer: { display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '15px 20px', marginBottom: '40px', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' },
    searchIcon: { fontSize: '1.2rem', marginRight: '15px', opacity: 0.7 },
    searchInput: { background: 'transparent', border: 'none', color: 'white', fontSize: '1.1rem', width: '100%', outline: 'none' },
    topicsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
    topicCard: { display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '20px', cursor: 'pointer', backdropFilter: 'blur(12px)', transition: 'transform 0.2s, background 0.2s' },
    folderIcon: { fontSize: '1.8rem', marginRight: '15px' },
    topicName: { fontSize: '1.1rem', fontWeight: '500', color: '#cbd5e1' },
    quizContainer: { maxWidth: '900px', margin: '0 auto' },
    quizHeader: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px',
        position: 'sticky', 
        top: '0', 
        zIndex: 100, 
        padding: '20px', 
        background: 'rgba(15, 23, 42, 0.95)', 
        backdropFilter: 'blur(12px)', 
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '0 0 16px 16px',
        marginBottom: '40px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
    },
    backBtn: { background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' },
    quizTitle: { fontSize: '2rem', margin: 0, fontWeight: '700' },
    questionCard: { background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '16px', padding: '30px', backdropFilter: 'blur(10px)', marginBottom: '30px' },
    questionText: { fontSize: '1.25rem', margin: '0 0 25px 0', lineHeight: '1.6', color: '#f8fafc', fontWeight: '500' },
    qNum: { color: '#6366f1', fontWeight: '700' },
    optionsList: { display: 'flex', flexDirection: 'column', gap: '12px' },
    optionBtn: { display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', padding: '16px 20px', borderRadius: '12px', cursor: 'pointer', fontSize: '1.05rem', textAlign: 'left', transition: 'all 0.2s' },
    optionLetter: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', marginRight: '15px', fontWeight: 'bold' },
    statusIcon: { marginLeft: 'auto', fontSize: '1.2rem' },
    correctOption: { background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#fff' },
    wrongOption: { background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#fca5a5', opacity: 0.8 },
    explanationBox: { marginTop: '25px', padding: '20px', background: 'rgba(16, 185, 129, 0.05)', borderLeft: '4px solid #10b981', borderRadius: '0 12px 12px 0' },
    explanationTitle: { margin: '0 0 10px 0', color: '#10b981', fontSize: '1.1rem' },
    explanationText: { margin: 0, color: '#e2e8f0', lineHeight: '1.8', fontSize: '1.05rem' },
    emptyStateCard: { background: 'rgba(255, 255, 255, 0.03)', border: '2px dashed rgba(255, 255, 255, 0.2)', borderRadius: '16px', padding: '50px 20px', textAlign: 'center', color: '#94a3b8' },
    emptyStateText: { fontSize: '1.4rem', margin: '0 0 10px 0', color: '#cbd5e1' },
    emptyStateSubtext: { fontSize: '1rem', margin: 0 }
};