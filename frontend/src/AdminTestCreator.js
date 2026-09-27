import React, { useState, useEffect } from 'react';

export default function AdminTestCreator() {
    // --- TEST SETTINGS STATE ---
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [durationMinutes, setDurationMinutes] = useState(20);
    const [maxAttempts, setMaxAttempts] = useState(1);
    const [scheduledStart, setScheduledStart] = useState('');
    const [scheduledEnd, setScheduledEnd] = useState('');
    
    // --- QUESTION BANK STATE ---
    const [qMode, setQMode] = useState('bank'); // 'bank', 'custom', 'clone'
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState('');
    const [availableQuestions, setAvailableQuestions] = useState([]);
    
    // --- CUSTOM QUESTION STATE ---
    const [customQ, setCustomQ] = useState({
        questionText: '',
        options: [ { letter: 'A', text: '' }, { letter: 'B', text: '' }, { letter: 'C', text: '' }, { letter: 'D', text: '' } ],
        correctAnswer: 'A', explanation: '', marks: 1
    });

    // --- CLONE TEST STATE ---
    const [selectedOldTestId, setSelectedOldTestId] = useState('');

    const [testQuestions, setTestQuestions] = useState([]);
    const [existingTests, setExistingTests] = useState([]);
    
    // --- LIVE EDIT STATE ---
    const [editingTestId, setEditingTestId] = useState(null);
    const [editData, setEditData] = useState({ durationMinutes: 20, maxAttempts: 1 });

    // --- LEADERBOARD & MODAL STATE ---
    const [viewingLeaderboard, setViewingLeaderboard] = useState(null); 
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [detailedStudentResult, setDetailedStudentResult] = useState(null);

    useEffect(() => {
        fetchTopics();
        fetchTests();
    }, []);

    useEffect(() => {
        if (selectedTopic) {
            fetch(`https://skillforge-api-i4bs.onrender.com/api/practice/${encodeURIComponent(selectedTopic)}`)
                .then(res => res.json())
                .then(setAvailableQuestions)
                .catch(err => console.error(err));
        }
    }, [selectedTopic]);

    const fetchTopics = () => fetch(`https://skillforge-api-i4bs.onrender.com/api/topics`).then(res => res.json()).then(setTopics);
    const fetchTests = () => fetch(`https://skillforge-api-i4bs.onrender.com/api/tests`).then(res => res.json()).then(setExistingTests);

    // --- 1. ADD FROM BANK LOGIC ---
    const handleAddFromBank = (q) => {
        if (testQuestions.find(tq => tq.originalQuestionId === q._id)) return;
        setTestQuestions([...testQuestions, { originalQuestionId: q._id, topic: q.topic, questionText: q.questionText, options: q.options, correctAnswer: q.correctAnswer, explanation: q.explanation, marks: 1 }]);
    };

    // --- 2. ADD CUSTOM LOGIC ---
    const handleCustomOptionChange = (index, value) => {
        const updated = [...customQ.options]; updated[index].text = value; setCustomQ({ ...customQ, options: updated });
    };

    const addCustomOption = () => {
        if (customQ.options.length >= 6) return;
        setCustomQ({ ...customQ, options: [...customQ.options, { letter: String.fromCharCode(65 + customQ.options.length), text: '' }] });
    };

    const removeCustomOption = () => {
        if (customQ.options.length <= 2) return;
        const updated = customQ.options.slice(0, -1);
        let newCorrect = customQ.correctAnswer;
        if (!updated.find(opt => opt.letter === customQ.correctAnswer)) newCorrect = 'A';
        setCustomQ({ ...customQ, options: updated, correctAnswer: newCorrect });
    };

    const handleAddCustomToTest = () => {
        if (!customQ.questionText) return alert("Question text is required.");
        setTestQuestions([...testQuestions, { originalQuestionId: 'custom_' + Date.now(), topic: 'Custom Test Question', questionText: customQ.questionText, options: customQ.options, correctAnswer: customQ.correctAnswer, explanation: customQ.explanation, marks: Number(customQ.marks) }]);
        setCustomQ({ questionText: '', options: [ { letter: 'A', text: '' }, { letter: 'B', text: '' }, { letter: 'C', text: '' }, { letter: 'D', text: '' } ], correctAnswer: 'A', explanation: '', marks: 1 });
    };

    // --- 3. CLONE OLD TEST LOGIC ---
    const handleCloneOldTest = () => {
        if (!selectedOldTestId) return alert("Please select a past test from the dropdown first.");
        
        const testToClone = existingTests.find(t => t._id === selectedOldTestId);
        if (!testToClone) return;

        let newQuestions = [...testQuestions];
        let addedCount = 0;

        testToClone.questions.forEach(q => {
            // Check if the question is already in the list to prevent duplicates
            if (!newQuestions.find(tq => tq.originalQuestionId === q.originalQuestionId)) {
                newQuestions.push({
                    originalQuestionId: q.originalQuestionId || q._id,
                    topic: q.topic || 'Cloned Question',
                    questionText: q.questionText,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    explanation: q.explanation,
                    marks: q.marks || 1
                });
                addedCount++;
            }
        });

        setTestQuestions(newQuestions);
        alert(`Successfully imported ${addedCount} new questions from "${testToClone.title}"!`);
    };

    // --- TEST MANAGEMENT LOGIC ---
    const handleRemoveQuestion = (index) => { const updated = [...testQuestions]; updated.splice(index, 1); setTestQuestions(updated); };
    const handleMarkChange = (index, newMark) => { const updated = [...testQuestions]; updated[index].marks = Number(newMark); setTestQuestions(updated); };

    const handleSaveTest = async (e) => {
        e.preventDefault();
        if (!title.trim()) return alert("Please enter a Test Title.");
        if (testQuestions.length === 0) return alert("Please add at least one question.");

        let finalStart = scheduledStart ? new Date(scheduledStart) : new Date();
        let finalEnd = scheduledEnd ? new Date(scheduledEnd) : new Date(finalStart.getTime() + (8 * 60 * 60 * 1000));

        const newTest = { title, description, durationMinutes, maxAttempts, scheduledStart: finalStart, scheduledEnd: finalEnd, questions: testQuestions };

        try {
            const res = await fetch(`https://skillforge-api-i4bs.onrender.com/api/tests`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newTest) });
            if (res.ok) {
                alert("Test created successfully!");
                setTitle(''); setDescription(''); setScheduledStart(''); setScheduledEnd(''); setTestQuestions([]); fetchTests(); 
            }
        } catch (err) { alert("Failed to create test."); }
    };

    // --- LIVE EDIT LOGIC ---
    const handleUpdateLiveTest = async (id) => {
        try {
            const res = await fetch(`https://skillforge-api-i4bs.onrender.com/api/tests/${id}`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ durationMinutes: Number(editData.durationMinutes), maxAttempts: Number(editData.maxAttempts) })
            });
            if (res.ok) {
                alert("Live Test Updated Successfully!");
                setEditingTestId(null);
                fetchTests(); 
            }
        } catch (err) { alert("Failed to update test."); }
    };

    // --- LEADERBOARD LOGIC ---
    const fetchLeaderboard = async (test) => {
        setViewingLeaderboard(test);
        try {
            const res = await fetch(`https://skillforge-api-i4bs.onrender.com/api/results/${test._id}`);
            const data = await res.json();
            setLeaderboardData(data);
        } catch (err) { console.error("Failed to fetch leaderboard", err); }
    };

    const getTestStatus = (test) => {
        if (!test.isActive) return { label: 'DISABLED ⚪', color: '#64748b' };
        const now = new Date(); const start = new Date(test.scheduledStart); const end = new Date(test.scheduledEnd);
        if (now >= start && now <= end) return { label: 'LIVE 🟢', color: '#10b981' };
        if (now < start) return { label: 'UPCOMING 🟡', color: '#eab308' };
        return { label: 'ENDED 🔴', color: '#ef4444' };
    };

    return (
        <div style={styles.container}>
            <h2 style={{ color: '#38bdf8', marginBottom: '20px' }}>Assessment Engine</h2>
            
            <form style={styles.formGrid}>
                {/* 1. TEST SETTINGS */}
                <div style={styles.panel}>
                    <h3 style={styles.panelTitle}>1. Test Settings</h3>
                    <input type="text" placeholder="Test Title (e.g., Weekly Mock Test 1)" value={title} onChange={e => setTitle(e.target.value)} required style={styles.input} />
                    <textarea placeholder="Instructions / Description (Optional)" value={description} onChange={e => setDescription(e.target.value)} style={{...styles.input, height: '80px'}} />
                    
                    <div style={styles.row}>
                        <div style={styles.halfInput}>
                            <label style={styles.label}>Duration (mins)</label>
                            <input type="number" min="1" value={durationMinutes} onChange={e => setDurationMinutes(e.target.value)} required style={styles.input} />
                        </div>
                        <div style={styles.halfInput}>
                            <label style={styles.label}>Max Attempts</label>
                            <input type="number" min="1" value={maxAttempts} onChange={e => setMaxAttempts(e.target.value)} required style={styles.input} />
                        </div>
                    </div>
                    <div style={styles.row}>
                        <div style={styles.halfInput}>
                            <label style={styles.label}>Start Time <span style={{fontSize:'10px', color:'#ef4444'}}>(Optional)</span></label>
                            <input type="datetime-local" value={scheduledStart} onChange={e => setScheduledStart(e.target.value)} style={styles.input} />
                        </div>
                        <div style={styles.halfInput}>
                            <label style={styles.label}>End Time <span style={{fontSize:'10px', color:'#ef4444'}}>(Optional)</span></label>
                            <input type="datetime-local" value={scheduledEnd} onChange={e => setScheduledEnd(e.target.value)} style={styles.input} />
                        </div>
                    </div>
                    <p style={{fontSize: '11px', color: '#64748b', marginTop: '-10px'}}>* If left blank, test starts immediately and expires in exactly 8 hours.</p>
                </div>

                {/* 2. ADD QUESTIONS */}
                <div style={styles.panel}>
                    <h3 style={styles.panelTitle}>2. Add Questions</h3>
                    <div style={styles.tabContainer}>
                        <button type="button" onClick={() => setQMode('bank')} style={qMode === 'bank' ? styles.activeTab : styles.inactiveTab}>From Database</button>
                        <button type="button" onClick={() => setQMode('custom')} style={qMode === 'custom' ? styles.activeTab : styles.inactiveTab}>Create Custom</button>
                        <button type="button" onClick={() => setQMode('clone')} style={qMode === 'clone' ? styles.activeTab : styles.inactiveTab}>Clone Old Test</button>
                    </div>

                    {/* Mode: Bank */}
                    {qMode === 'bank' && (
                        <>
                            <select value={selectedTopic} onChange={e => setSelectedTopic(e.target.value)} style={styles.input}>
                                <option value="">-- Select Topic to Pull Questions --</option>
                                {topics.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <div style={styles.scrollBox}>
                                {availableQuestions.map(q => (
                                    <div key={q._id} style={styles.questionCard}>
                                        <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>{q.questionText}</p>
                                        <button type="button" onClick={() => handleAddFromBank(q)} style={styles.addButton}>+ Add</button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Mode: Custom */}
                    {qMode === 'custom' && (
                        <div style={styles.scrollBoxCustom}>
                            <textarea placeholder="Enter question text..." value={customQ.questionText} onChange={e => setCustomQ({...customQ, questionText: e.target.value})} style={{...styles.input, height: '60px'}} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <label style={styles.label}>Options:</label>
                                <div>
                                    <button type="button" onClick={removeCustomOption} style={styles.miniBtn}>-</button>
                                    <button type="button" onClick={addCustomOption} style={styles.miniBtn}>+</button>
                                </div>
                            </div>
                            {customQ.options.map((opt, i) => (
                                <div key={opt.letter} style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
                                    <span style={{color: '#94a3b8', marginTop: '10px'}}>{opt.letter}.</span>
                                    <input type="text" value={opt.text} onChange={(e) => handleCustomOptionChange(i, e.target.value)} style={{...styles.input, marginBottom: 0}} />
                                </div>
                            ))}
                            <div style={styles.row}>
                                <div style={styles.halfInput}>
                                    <label style={styles.label}>Correct Ans</label>
                                    <select value={customQ.correctAnswer} onChange={e => setCustomQ({...customQ, correctAnswer: e.target.value})} style={styles.input}>
                                        {customQ.options.map(opt => <option key={opt.letter} value={opt.letter}>{opt.letter}</option>)}
                                    </select>
                                </div>
                                <div style={styles.halfInput}>
                                    <label style={styles.label}>Marks</label>
                                    <input type="number" min="1" value={customQ.marks} onChange={e => setCustomQ({...customQ, marks: e.target.value})} style={styles.input} />
                                </div>
                            </div>
                            <button type="button" onClick={handleAddCustomToTest} style={styles.submitButton}>+ Add Custom Question</button>
                        </div>
                    )}

                    {/* Mode: Clone Old Test */}
                    {qMode === 'clone' && (
                        <div style={styles.scrollBoxCustom}>
                            <label style={styles.label}>Select a Previous Assessment:</label>
                            <select value={selectedOldTestId} onChange={e => setSelectedOldTestId(e.target.value)} style={styles.input}>
                                <option value="">-- Select Test to Clone --</option>
                                {existingTests.map(t => (
                                    <option key={t._id} value={t._id}>
                                        {t.title} ({t.questions.length} Questions)
                                    </option>
                                ))}
                            </select>
                            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>
                                This will extract all questions from the selected past assessment and drop them into your new Assembled Test below.
                            </p>
                            <button type="button" onClick={handleCloneOldTest} style={{...styles.submitButton, background: '#8b5cf6'}}>
                                📥 Import All Questions
                            </button>
                        </div>
                    )}
                </div>
            </form>

            {/* 3. ASSEMBLED TEST (INCREASED BOX SIZE) */}
            <div style={styles.assembledPanel}>
                <h3 style={styles.panelTitle}>3. Assembled Test ({testQuestions.length} Questions)</h3>
                <div style={styles.assembledScrollContainer}>
                    {testQuestions.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
                            <p>No questions added yet. Use the panel above to build your test.</p>
                        </div>
                    ) : (
                        testQuestions.map((q, index) => (
                            <div key={index} style={styles.assembledCard}>
                                <div style={{ flex: 1, paddingRight: '20px' }}>
                                    <p style={{ margin: '0 0 5px 0', fontSize: '15px', lineHeight: '1.5' }}><strong>{index + 1}.</strong> {q.questionText}</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <label style={{ fontSize: '14px', color: '#94a3b8' }}>Marks:</label>
                                    <input type="number" min="1" value={q.marks} onChange={(e) => handleMarkChange(index, e.target.value)} style={styles.markInput} />
                                    <button onClick={() => handleRemoveQuestion(index)} style={styles.removeButton}>Remove</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <button type="button" onClick={handleSaveTest} style={styles.publishButton}>🚀 Publish Test to Users</button>
            </div>

            {/* 4. DASHBOARD & LEADERBOARD */}
            <div style={{...styles.panel, marginTop: '30px', background: 'rgba(15, 23, 42, 0.9)'}}>
                <h3 style={styles.panelTitle}>📊 Manage Existing Tests & Leaderboards</h3>
                <div style={styles.testDashboardGrid}>
                    {existingTests.map(test => {
                        const status = getTestStatus(test);
                        return (
                            <div key={test._id} style={styles.testStatusCard}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 5px 0', fontSize: '16px', color: '#fff' }}>{test.title}</h4>
                                        <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#94a3b8' }}>{test.questions.length} Qs | {test.durationMinutes} Mins | Att: {test.maxAttempts}</p>
                                    </div>
                                    <span style={{ fontWeight: 'bold', fontSize: '12px', color: status.color, background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>{status.label}</span>
                                </div>
                                
                                {/* LIVE EDIT TOGGLE */}
                                {editingTestId === test._id ? (
                                    <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ fontSize: '11px', color: '#94a3b8' }}>Time (Mins)</label>
                                                <input type="number" value={editData.durationMinutes} onChange={(e) => setEditData({...editData, durationMinutes: e.target.value})} style={styles.input} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ fontSize: '11px', color: '#94a3b8' }}>Attempts</label>
                                                <input type="number" value={editData.maxAttempts} onChange={(e) => setEditData({...editData, maxAttempts: e.target.value})} style={styles.input} />
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => handleUpdateLiveTest(test._id)} style={{ flex: 1, background: '#10b981', color: 'white', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                                            <button onClick={() => setEditingTestId(null)} style={{ flex: 1, background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                        <button onClick={() => fetchLeaderboard(test)} style={styles.leaderboardBtn}>🏆 Leaderboard</button>
                                        <button onClick={() => { setEditingTestId(test._id); setEditData({ durationMinutes: test.durationMinutes, maxAttempts: test.maxAttempts }); }} style={{ ...styles.leaderboardBtn, background: 'transparent', color: '#38bdf8', border: '1px solid #38bdf8' }}>⚙️ Edit Limits</button>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* ADMIN LEADERBOARD TABLE */}
                {viewingLeaderboard && (
                    <div style={styles.leaderboardSection}>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid rgba(255,255,255,0.1)', paddingBottom:'10px', marginBottom:'15px'}}>
                            <h3 style={{margin:0, color:'#f8fafc'}}>Leaderboard: {viewingLeaderboard.title}</h3>
                            <button onClick={() => fetchLeaderboard(viewingLeaderboard)} style={styles.miniBtn}>🔄 Refresh Data</button>
                        </div>
                        
                        {leaderboardData.length === 0 ? (
                            <p style={{color:'#94a3b8'}}>No students have completed this test yet.</p>
                        ) : (
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Rank</th>
                                        <th style={styles.th}>Name</th>
                                        <th style={styles.th}>Email</th>
                                        <th style={styles.th}>Score</th>
                                        <th style={styles.th}>Submitted At</th>
                                        <th style={styles.th}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboardData.map((res, idx) => (
                                        <tr key={res._id} style={styles.tr}>
                                            <td style={styles.td}>#{idx + 1}</td>
                                            <td style={styles.td}><strong>{res.userName}</strong></td>
                                            <td style={styles.td}>{res.userEmail || 'N/A'}</td>
                                            <td style={styles.td}><span style={{color:'#10b981', fontWeight:'bold'}}>{res.score}</span> / {res.totalMarks}</td>
                                            <td style={styles.td}>{new Date(res.submittedAt).toLocaleString()}</td>
                                            <td style={styles.td}>
                                                <button onClick={() => setDetailedStudentResult(res)} style={styles.viewAnsBtn}>View Full Answers</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>

            {/* --- DETAILED STUDENT RESULT MODAL --- */}
            {detailedStudentResult && viewingLeaderboard && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <div>
                                <h2 style={{ margin: 0, color: '#fff' }}>{detailedStudentResult.userName}'s Submission</h2>
                                <p style={{ margin: '5px 0 0 0', color: '#94a3b8', fontSize: '14px' }}>{detailedStudentResult.userEmail} | Score: <strong style={{color:'#10b981'}}>{detailedStudentResult.score} / {detailedStudentResult.totalMarks}</strong></p>
                            </div>
                            <button onClick={() => setDetailedStudentResult(null)} style={styles.closeBtn}>✖ Close</button>
                        </div>
                        
                        <div style={styles.modalBody}>
                            {detailedStudentResult.userAnswers.map((ans, idx) => {
                                const originalQ = viewingLeaderboard.questions.find(q => q._id === ans.questionId);
                                if (!originalQ) return null;

                                return (
                                    <div key={idx} style={styles.resultReviewCard}>
                                        <p style={{ fontSize: '15px', color: '#f8fafc', margin: '0 0 15px 0', lineHeight: '1.5' }}>
                                            <strong>Q{idx + 1}.</strong> {originalQ.questionText}
                                        </p>
                                        
                                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
                                                <div style={{ flex: 1 }}>
                                                    <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Student Selected:</span>
                                                    <div style={{ 
                                                        padding: '10px', borderRadius: '6px', fontWeight: 'bold',
                                                        background: ans.isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                        color: ans.isCorrect ? '#10b981' : '#ef4444',
                                                        border: `1px solid ${ans.isCorrect ? '#10b981' : '#ef4444'}`
                                                    }}>
                                                        Option {ans.selectedLetter || 'None'} {ans.isCorrect ? '✅' : '❌'}
                                                    </div>
                                                </div>
                                                
                                                {!ans.isCorrect && (
                                                    <div style={{ flex: 1 }}>
                                                        <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Correct Answer:</span>
                                                        <div style={{ padding: '10px', borderRadius: '6px', fontWeight: 'bold', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid #10b981' }}>
                                                            Option {originalQ.correctAnswer}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', textAlign: 'right' }}>Marks Awarded: <strong>{ans.marksAwarded}</strong> / {originalQ.marks}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: { color: 'white', width: '100%' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    panel: { background: 'rgba(30, 41, 59, 0.4)', padding: '25px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' },
    panelTitle: { margin: '0 0 20px 0', fontSize: '18px', color: '#cbd5e1', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' },
    
    // Increased Box Size for Assembled Test
    assembledPanel: { background: 'rgba(30, 41, 59, 0.4)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', marginTop: '30px', minHeight: '400px', display: 'flex', flexDirection: 'column' },
    assembledScrollContainer: { flex: 1, maxHeight: '600px', overflowY: 'auto', paddingRight: '10px', marginBottom: '20px' },
    assembledCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.8)', padding: '20px', borderRadius: '12px', marginBottom: '15px', border: '1px solid rgba(255,255,255,0.05)' },
    
    input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(15, 23, 42, 0.6)', color: 'white', boxSizing: 'border-box' },
    row: { display: 'flex', gap: '15px' }, halfInput: { flex: 1 },
    label: { display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '5px' },
    scrollBox: { maxHeight: '300px', overflowY: 'auto', paddingRight: '5px' }, 
    scrollBoxCustom: { maxHeight: '400px', overflowY: 'auto', paddingRight: '5px' },
    questionCard: { background: 'rgba(15, 23, 42, 0.8)', padding: '15px', borderRadius: '8px', marginBottom: '10px', border: '1px solid rgba(255,255,255,0.05)' },
    addButton: { background: '#0284c7', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' },
    markInput: { width: '60px', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: 'white', textAlign: 'center', fontWeight: 'bold' },
    removeButton: { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' },
    publishButton: { background: '#10b981', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '12px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', width: '100%', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' },
    submitButton: { background: '#3b82f6', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', width: '100%', fontWeight: 'bold' },
    
    tabContainer: { display: 'flex', gap: '10px', marginBottom: '20px' },
    activeTab: { flex: 1, background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', border: '1px solid #6366f1', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
    inactiveTab: { flex: 1, background: 'transparent', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
    miniBtn: { background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
    
    testDashboardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' },
    testStatusCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', borderRadius: '12px' },
    leaderboardBtn: { background: '#f59e0b', color: '#000', border: 'none', padding: '10px', width: '100%', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', marginTop: '15px' },
    leaderboardSection: { marginTop: '30px', background: 'rgba(15, 23, 42, 0.95)', padding: '25px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' }, th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid rgba(255,255,255,0.1)', color: '#94a3b8' }, tr: { borderBottom: '1px solid rgba(255,255,255,0.05)' }, td: { padding: '15px 12px', color: '#e2e8f0' },
    viewAnsBtn: { background: 'transparent', color: '#38bdf8', border: '1px solid #38bdf8', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' },
    
    // Modal Styles
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' },
    modalContent: { background: '#0f172a', border: '1px solid #334155', borderRadius: '16px', width: '100%', maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' },
    modalHeader: { padding: '25px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '16px 16px 0 0' },
    closeBtn: { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    modalBody: { padding: '25px', overflowY: 'auto' },
    resultReviewCard: { background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', marginBottom: '20px' }
};