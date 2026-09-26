import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudentResults() {
    const navigate = useNavigate();
    const userEmail = localStorage.getItem('userEmail') || '';
const userName = localStorage.getItem('userName') || 'Student';
    
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedResult, setSelectedResult] = useState(null); // State for the Detailed Review Modal

    useEffect(() => {
        fetch(`${https://skillforge-api-i4bs.onrender.com}/api/my-results/${encodeURIComponent(userEmail)}`)
            .then(res => res.json())
            .then(data => {
                setResults(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [userEmail]);

    return (
        <div style={styles.pageContainer}>
            <nav style={styles.navbar}>
                <div style={styles.navContent}>
                    <h1 style={styles.logo}>SkillForge <span style={styles.badge}>ANALYTICS</span></h1>
                    <button onClick={() => navigate('/practice')} style={styles.outlineBtn}>Back to Dashboard</button>
                </div>
            </nav>

            <main style={styles.mainContent}>
                <div style={styles.header}>
                    <h2 style={styles.welcomeText}>Performance History</h2>
                    <p style={styles.subtitle}>Review your past assessment scores and detailed answers, {userName}.</p>
                </div>

                {loading ? (
                    <p style={{ textAlign: 'center', color: '#94a3b8' }}>Loading your analytics...</p>
                ) : results.length === 0 ? (
                    <div style={styles.emptyState}>
                        <h3 style={{ color: '#f8fafc' }}>No Assessments Taken Yet</h3>
                        <p style={{ color: '#64748b' }}>Complete a Live Assessment to see your results here.</p>
                    </div>
                ) : (
                    <div style={styles.resultsGrid}>
                        {results.map((res, idx) => (
                            <div key={idx} style={styles.resultCard}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', marginBottom: '15px' }}>
                                    <h3 style={styles.testTitle}>{res.testId ? res.testId.title : 'Deleted Test'}</h3>
                                    <span style={styles.dateBadge}>{new Date(res.submittedAt).toLocaleDateString()}</span>
                                </div>
                                
                                <div style={styles.scoreCircle}>
                                    <span style={styles.scoreText}>{res.score}</span>
                                    <span style={styles.totalText}>/ {res.totalMarks}</span>
                                </div>
                                
                                <p style={styles.metaText}>Submitted at: {new Date(res.submittedAt).toLocaleTimeString()}</p>
                                <p style={styles.metaText}>Attempt #{res.attemptNumber}</p>

                                {/* Trigger for the Detailed Review Modal */}
                                <button 
                                    onClick={() => setSelectedResult(res)} 
                                    style={styles.reviewBtn}
                                >
                                    🔍 Review Full Answers
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* ========================================== */}
            {/* DETAILED STUDENT REVIEW MODAL */}
            {/* ========================================== */}
            {selectedResult && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <div>
                                <h2 style={{ margin: 0, color: '#fff' }}>{selectedResult.testId ? selectedResult.testId.title : 'Assessment'} - Review</h2>
                                <p style={{ margin: '5px 0 0 0', color: '#94a3b8', fontSize: '14px' }}>
                                    Attempt #{selectedResult.attemptNumber} | Final Score: <strong style={{color:'#10b981'}}>{selectedResult.score} / {selectedResult.totalMarks}</strong>
                                </p>
                            </div>
                            <button onClick={() => setSelectedResult(null)} style={styles.closeBtn}>✖ Close</button>
                        </div>
                        
                        <div style={styles.modalBody}>
                            {!selectedResult.testId || !selectedResult.testId.questions ? (
                                <p style={{ color: '#ef4444', textAlign: 'center' }}>The original questions for this test have been deleted by the admin.</p>
                            ) : (
                                selectedResult.userAnswers.map((ans, idx) => {
                                    const originalQ = selectedResult.testId.questions.find(q => q._id === ans.questionId);
                                    if (!originalQ) return null;

                                    return (
                                        <div key={idx} style={styles.reviewDetailCard}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                                <p style={{ fontSize: '15px', color: '#f8fafc', margin: 0, lineHeight: '1.5', flex: 1, paddingRight: '20px' }}>
                                                    <strong>Q{idx + 1}.</strong> {originalQ.questionText}
                                                </p>
                                                <span style={{ fontSize: '12px', fontWeight: 'bold', padding: '5px 10px', borderRadius: '6px', background: ans.isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: ans.isCorrect ? '#10b981' : '#ef4444', whiteSpace: 'nowrap' }}>
                                                    {ans.isCorrect ? 'Correct ✅' : 'Incorrect ❌'} ({ans.marksAwarded}/{originalQ.marks})
                                                </span>
                                            </div>
                                            
                                            <div style={styles.optionsGrid}>
                                                {originalQ.options.map(opt => {
                                                    const isSelected = ans.selectedLetter === opt.letter;
                                                    const isActualCorrect = originalQ.correctAnswer === opt.letter;
                                                    
                                                    // Dynamic Color Logic
                                                    let bg = 'rgba(255,255,255,0.02)';
                                                    let border = 'rgba(255,255,255,0.05)';
                                                    let icon = '';

                                                    if (isSelected && isActualCorrect) { bg = 'rgba(16, 185, 129, 0.1)'; border = '#10b981'; icon = '✅'; }
                                                    else if (isSelected && !isActualCorrect) { bg = 'rgba(239, 68, 68, 0.1)'; border = '#ef4444'; icon = '❌ (Your Answer)'; }
                                                    else if (!isSelected && isActualCorrect) { bg = 'rgba(16, 185, 129, 0.05)'; border = '#10b981'; icon = '✔️ (Correct Answer)'; }

                                                    return (
                                                        <div key={opt.letter} style={{ display: 'flex', alignItems: 'center', padding: '12px 15px', borderRadius: '8px', border: `1px solid ${border}`, background: bg }}>
                                                            <span style={{ background: isSelected ? border : 'rgba(255,255,255,0.1)', color: 'white', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 'bold', marginRight: '15px', fontSize: '0.9rem' }}>
                                                                {opt.letter}
                                                            </span>
                                                            <span style={{ fontSize: '0.95rem', color: '#e2e8f0', flex: 1 }}>{opt.text}</span>
                                                            {icon && <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: border }}>{icon}</span>}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {originalQ.explanation && (
                                                <div style={{ marginTop: '15px', padding: '12px', background: 'rgba(56, 189, 248, 0.1)', borderLeft: '3px solid #38bdf8', borderRadius: '4px' }}>
                                                    <p style={{ margin: 0, color: '#e0f2fe', fontSize: '13px' }}><strong>Explanation:</strong> {originalQ.explanation}</p>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    pageContainer: { minHeight: '100vh', background: `linear-gradient(rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.98))`, fontFamily: "'Inter', sans-serif", color: '#f8fafc' },
    navbar: { padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' },
    navContent: { maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' },
    logo: { margin: 0, fontSize: '1.5rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' },
    badge: { fontSize: '0.8rem', background: '#8b5cf6', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold' },
    outlineBtn: { background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer' },
    mainContent: { maxWidth: '1000px', margin: '40px auto', padding: '0 20px' },
    header: { marginBottom: '40px', textAlign: 'center' },
    welcomeText: { fontSize: '2.2rem', margin: '0 0 10px 0', fontWeight: '700' },
    subtitle: { fontSize: '1.1rem', color: '#94a3b8', margin: 0 },
    emptyState: { textAlign: 'center', padding: '60px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.2)' },
    resultsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
    
    // Result Cards
    resultCard: { background: 'rgba(30, 41, 59, 0.5)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' },
    testTitle: { color: '#38bdf8', margin: 0, fontSize: '1.2rem', textAlign: 'left', flex: 1 },
    dateBadge: { background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#cbd5e1', whiteSpace: 'nowrap', marginLeft: '10px' },
    scoreCircle: { width: '120px', height: '120px', borderRadius: '50%', border: '4px solid #10b981', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: '20px 0', background: 'rgba(16, 185, 129, 0.1)' },
    scoreText: { fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981', lineHeight: '1' },
    totalText: { fontSize: '1rem', color: '#94a3b8', marginTop: '5px' },
    metaText: { margin: '5px 0 0 0', color: '#64748b', fontSize: '0.9rem', width: '100%', textAlign: 'center' },
    reviewBtn: { marginTop: '20px', width: '100%', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid #38bdf8', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' },
    
    // Modal Styles
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' },
    modalContent: { background: '#0f172a', border: '1px solid #334155', borderRadius: '16px', width: '100%', maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' },
    modalHeader: { padding: '20px 25px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '16px 16px 0 0' },
    closeBtn: { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    modalBody: { padding: '25px', overflowY: 'auto' },
    reviewDetailCard: { background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', marginBottom: '20px' },
    optionsGrid: { display: 'flex', flexDirection: 'column', gap: '8px' }
};