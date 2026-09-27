import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // NEW STATE
    const [error, setError] = useState('');
    const navigate = useNavigate();

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

    // --- AUTH LOGIC ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const endpoint = isLogin 
                ? 'https://skillforge-api-i4bs.onrender.com/api/auth/login'
                : 'https://skillforge-api-i4bs.onrender.com/api/auth/register';
                
            const bodyData = isLogin 
                ? { email, password }
                : { name, email, password };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userName', data.name || name);
                localStorage.setItem('role', data.role || 'student');
                
                if (data.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard'); // Requires <Route path="/dashboard"> in App.js
                }
            } else {
                setError(data.message || 'Authentication failed');
            }
        } catch (err) {
            setError('Network error. Please ensure the backend server is running and CORS is allowed.');
        }
    };

    // --- DYNAMIC STYLES ---
    const currentStyles = {
        container: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? '#0f172a' : '#f8fafc', color: isDark ? 'white' : '#0f172a', fontFamily: 'system-ui', transition: 'all 0.3s ease' },
        themeBtn: { position: 'absolute', top: '20px', right: '20px', padding: '8px 16px', borderRadius: '20px', border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`, backgroundColor: isDark ? '#1e293b' : 'white', color: isDark ? 'white' : 'black', cursor: 'pointer', fontWeight: 'bold' },
        brandContainer: { textAlign: 'center', marginBottom: '30px' },
        title: { fontSize: '2.5rem', margin: '0', fontWeight: 'bold' },
        subtitle: { color: isDark ? '#94a3b8' : '#475569', margin: '5px 0 0 0' },
        card: { backgroundColor: isDark ? '#1e293b' : 'white', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: isDark ? '0 4px 6px -1px rgba(0,0,0,0.5)' : '0 4px 6px -1px rgba(0,0,0,0.1)', transition: 'all 0.3s ease' },
        cardTitle: { margin: '0 0 10px 0', fontSize: '1.5rem', textAlign: 'center' },
        cardSubtitle: { margin: '0 0 20px 0', color: isDark ? '#94a3b8' : '#64748b', textAlign: 'center', fontSize: '0.9rem' },
        errorBox: { backgroundColor: '#451a20', color: '#fca5a5', padding: '10px', borderRadius: '6px', border: '1px solid #7f1d1d', marginBottom: '20px', textAlign: 'center', fontSize: '0.85rem' },
        form: { display: 'flex', flexDirection: 'column', gap: '15px' },
        inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
        label: { fontSize: '0.85rem', color: isDark ? '#cbd5e1' : '#475569', fontWeight: '600' },
        
        // Input Wrapper for Eye Icon
        passwordWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
        input: { width: '100%', padding: '10px', borderRadius: '6px', border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`, backgroundColor: isDark ? '#0f172a' : '#f1f5f9', color: isDark ? 'white' : 'black', fontSize: '1rem', boxSizing: 'border-box' },
        passwordInput: { paddingRight: '40px' }, // Extra space so text doesn't hide behind icon
        eyeBtn: { position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0', display: 'flex', alignItems: 'center', color: isDark ? '#94a3b8' : '#64748b' },
        
        button: { padding: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
        toggleText: { textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: isDark ? '#cbd5e1' : '#475569' },
        toggleLink: { color: '#3b82f6', cursor: 'pointer', fontWeight: 'bold' }
    };

    return (
        <div style={currentStyles.container}>
            <button onClick={cycleTheme} style={currentStyles.themeBtn}>
                Theme: {themePref.charAt(0).toUpperCase() + themePref.slice(1)}
            </button>

            <div style={currentStyles.brandContainer}>
                <h1 style={currentStyles.title}>SkillForge</h1>
                <p style={currentStyles.subtitle}>The Ultimate Assessment Platform</p>
            </div>

            <div style={currentStyles.card}>
                <h2 style={currentStyles.cardTitle}>{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
                <p style={currentStyles.cardSubtitle}>{isLogin ? 'Sign in to access your dashboard.' : 'Register to start taking assessments.'}</p>
                
                {error && <div style={currentStyles.errorBox}>{error}</div>}
                
                <form onSubmit={handleSubmit} style={currentStyles.form}>
                    {!isLogin && (
                        <div style={currentStyles.inputGroup}>
                            <label style={currentStyles.label}>Full Name</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} style={currentStyles.input} required />
                        </div>
                    )}
                    <div style={currentStyles.inputGroup}>
                        <label style={currentStyles.label}>Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={currentStyles.input} required />
                    </div>
                    
                    {/* NEW PASSWORD FIELD WITH TOGGLE */}
                    <div style={currentStyles.inputGroup}>
                        <label style={currentStyles.label}>Password</label>
                        <div style={currentStyles.passwordWrapper}>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                style={{...currentStyles.input, ...currentStyles.passwordInput}} 
                                required 
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                style={currentStyles.eyeBtn}
                                title={showPassword ? "Hide Password" : "Show Password"}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>
                    {/* END NEW PASSWORD FIELD */}

                    <button type="submit" style={currentStyles.button}>
                        {isLogin ? 'Sign In Securely' : 'Register Account'}
                    </button>
                </form>
                
                <p style={currentStyles.toggleText}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span onClick={() => setIsLogin(!isLogin)} style={currentStyles.toggleLink}>
                        {isLogin ? 'Register here' : 'Sign in here'}
                    </span>
                </p>
            </div>
        </div>
    );
}