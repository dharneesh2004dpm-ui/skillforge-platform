import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function UserTestEngine() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // --- USER IDENTIFICATION ---
    const userName = localStorage.getItem('userName') || 'Student';
const userEmail = localStorage.getItem('userEmail') || '';

    // Get the test passed directly from the dashboard
    const test = location.state?.testToStart; 

    // --- STATE ---
    const [activeTest, setActiveTest] = useState(null);
    const [answers, setAnswers] = useState({}); 
    const [timeLeft, setTimeLeft] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [testResult, setTestResult] = useState(null);
    const [authStatus, setAuthStatus] = useState('Verifying attempts...');

    // --- SECURITY & ATTEMPT VALIDATION ---
    useEffect(() => {
        // 1. Kick out if accessed directly via URL without clicking a test
        if (!test) {
            navigate('/practice');
            return;
        }

        // 2. Ironclad Attempt Tracking: Check DB for previous submissions by this email
        fetch(`http://localhost:5000/api/results/${test._id}`)
            .then(res => res.json())
            .then(data => {
                const myPastSubmissions = data.filter(r => r.userEmail === userEmail).length;
                
                if (myPastSubmissions >= test.maxAttempts) {
                    alert(`ACCESS DENIED: You have already used all ${test.maxAttempts} attempt(s) for this assessment.`);
                    navigate('/practice');
                } else {
                    // 3. Passed security check -> Instantly start the test!
                    setActiveTest(test);
                    setTimeLeft(test.durationMinutes * 60);
                }
            })
            .catch(err => {
                console.error("Verification failed:", err);
                setAuthStatus('Network error verifying attempts. Please return to dashboard.');
            });
    }, [test, userEmail, navigate]);

    // --- TIMER LOGIC ---
    useEffect(() => {
        if (activeTest && timeLeft !== null && timeLeft > 0 && !isSubmitting) {
            const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timerId);
        } else if (timeLeft === 0 && !isSubmitting) {
            handleAutoSubmit();
        }
    }, [timeLeft, activeTest, isSubmitting]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleOptionSelect = (questionId, letter) => setAnswers({ ...answers, [questionId]: letter });

    // --- SUBMISSION LOGIC ---
    const handleManualSubmit = () => {
        if (!window.confirm("Are you sure you want to submit your test? You cannot change your answers after this.")) return;
        submitTest();
    };

    const handleAutoSubmit = () => {
        alert("Time is up! Your test is being automatically submitted.");
        submitTest();
    };

    const submitTest = async () => {
        setIsSubmitting(true);
        const formattedAnswers = Object.keys(answers).map(qId => ({ questionId: qId, selectedLetter: answers[qId] }));
        
        const payload = { userName, userEmail, testId: activeTest._id, answers: formattedAnswers };

        try {
            const res = await fetch('http://localhost:5000/api/submit-test', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
            });
            const data = await res.json();
            
            if (res.ok) {
                setTestResult(data.result);
                setActiveTest(null); 
                setTimeLeft(null);
            } else {
                alert(data.error || "Submission failed.");
            }
        } catch (err) {
            console.error(err);
            alert("Network error during submission.");
        }
        setIsSubmitting(false);
    };

    // ==========================================
    // RENDER 1: VIEW RESULTS SCREEN
    // ==========================================
    if (testResult) {
        return (
            <div style={styles.pageContainer}>
                <div style={styles.resultCard}>
                    <h1 style={{ color: '#10b981', fontSize: '3rem', margin: '0 0 10px 0' }}>Test Complete!</h1>
                    <h2 style={{ color: '#f8fafc', margin: '0 0 20px 0' }}>Your Score: {testResult.score} / {testResult.totalMarks}</h2>
                    <p style={{ color: '#94a3b8' }}>Your submission has been securely recorded to the leaderboard.</p>
                    <button onClick={() => navigate('/practice')} style={styles.primaryBtn}>Return to Dashboard</button>
                </div>
            </div>
        );
    }

    // ==========================================
    // RENDER 2: ACTIVE TEST ENGINE (NO REDUNDANT LIST)
    // ==========================================
    if (activeTest) {
        return (
            <div style={styles.pageContainer}>
                <div style={styles.stickyHeader}>
                    <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{activeTest.title}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ ...styles.timerBadge, color: timeLeft <= 60 ? '#ef4444' : '#10b981', borderColor: timeLeft <= 60 ? '#ef4444' : 'rgba(255,255,255,0.1)' }}>
                            ⏳ {formatTime(timeLeft)}
                        </div>
                        <button onClick={handleManualSubmit} style={styles.submitBtn} disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Test'}
                        </button>
                    </div>
                </div>

                <div style={styles.mainContent}>
                    {activeTest.questions.map((q, idx) => (
                        <div key={q._id} style={styles.questionCard}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <p style={styles.questionText}><strong>{idx + 1}.</strong> {q.questionText}</p>
                                <span style={styles.markBadge}>{q.marks} Mark{q.marks > 1 ? 's' : ''}</span>
                            </div>
                            
                            <div style={styles.optionsGrid}>
                                {q.options.map(opt => (
                                    <label key={opt.letter} style={{ 
                                        ...styles.optionLabel, 
                                        borderColor: answers[q._id] === opt.letter ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                                        background: answers[q._id] === opt.letter ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.02)'
                                    }}>
                                        <input type="radio" name={`q_${q._id}`} value={opt.letter} checked={answers[q._id] === opt.letter} onChange={() => handleOptionSelect(q._id, opt.letter)} style={{ display: 'none' }} />
                                        <span style={{...styles.optionLetter, background: answers[q._id] === opt.letter ? '#3b82f6' : 'rgba(255,255,255,0.1)'}}>{opt.letter}</span>
                                        <span style={styles.optionText}>{opt.text}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <button onClick={handleManualSubmit} style={styles.hugeSubmitBtn} disabled={isSubmitting}>
                            {isSubmitting ? 'Processing Submission...' : 'Final Submit'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ==========================================
    // RENDER 3: SECURITY LOADING SCREEN
    // ==========================================
    return (
        <div style={styles.pageContainer}>
            <div style={{ textAlign: 'center', marginTop: '20vh' }}>
                <h2 style={{ color: '#94a3b8' }}>{authStatus}</h2>
            </div>
        </div>
    );
}

const styles = {
    pageContainer: { minHeight: '100vh', background: `linear-gradient(rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.98))`, fontFamily: "'Inter', sans-serif", color: '#f8fafc', paddingBottom: '50px' },
    
    // Active Test Styles
    stickyHeader: { position: 'sticky', top: 0, zIndex: 100, background: 'rgba(15, 23, 42, 0.98)', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 30px rgba(0,0,0,0.8)' },
    timerBadge: { fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'monospace', background: 'rgba(0,0,0,0.5)', padding: '8px 20px', borderRadius: '8px', border: '1px solid' },
    submitBtn: { background: '#ef4444', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: 'background 0.2s' },
    hugeSubmitBtn: { background: '#10b981', color: 'white', border: 'none', padding: '15px 50px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.3rem', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' },
    
    mainContent: { maxWidth: '900px', margin: '40px auto', padding: '0 20px' },
    questionCard: { background: 'rgba(30, 41, 59, 0.5)', padding: '35px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '30px' },
    questionText: { fontSize: '1.2rem', lineHeight: '1.6', margin: 0, flex: 1, paddingRight: '20px' },
    markBadge: { background: 'rgba(245, 158, 11, 0.15)', color: '#fcd34d', border: '1px solid #f59e0b', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', whiteSpace: 'nowrap' },
    
    optionsGrid: { display: 'flex', flexDirection: 'column', gap: '15px' },
    optionLabel: { display: 'flex', alignItems: 'center', padding: '15px 20px', borderRadius: '10px', border: '2px solid', cursor: 'pointer', transition: 'all 0.2s' },
    optionLetter: { color: 'white', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 'bold', marginRight: '20px', fontSize: '1.1rem' },
    optionText: { fontSize: '1.1rem', color: '#e2e8f0' },
    
    resultCard: { maxWidth: '600px', margin: '150px auto', background: 'rgba(30, 41, 59, 0.8)', padding: '50px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' },
    primaryBtn: { background: '#3b82f6', color: 'white', border: 'none', padding: '15px 40px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '25px' }
};