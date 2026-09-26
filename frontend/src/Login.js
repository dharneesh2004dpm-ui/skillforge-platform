import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    
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

    // --- AUTH STATE ---
    const [isLoginView, setIsLoginView] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrorMsg('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setErrorMsg(''); setSuccessMsg('');

        const endpoint = isLoginView ? '/api/auth/login' : '/api/auth/register';
        
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const data = await res.json();

            if (res.ok) {
                if (isLoginView) {
                    localStorage.setItem('role', data.role);
                    localStorage.setItem('userName', data.name);
                    localStorage.setItem('userEmail', data.email);
                    
                    if (data.role === 'admin') navigate('/admin');
                    else navigate('/practice');
                } else {
                    setSuccessMsg('Registration successful! Please log in.');
                    setIsLoginView(true);
                    setFormData({ ...formData, password: '' }); 
                    setShowPassword(false);
                }
            } else {
                setErrorMsg(data.error || 'Authentication failed. Please try again.');
            }
        } catch (err) {
            setErrorMsg('Network error. Please ensure the server is running.');
        }
        setLoading(false);
    };

    // --- DYNAMIC STYLES BASED ON THEME ---
    const currentStyles = {
        pageContainer: { 
            minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', 
            background: isDark 
                ? `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.95)), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop') center/cover fixed`
                : `linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)`, 
            fontFamily: "'Inter', sans-serif", 
            color: isDark ? '#f8fafc' : '#0f172a', 
            padding: '20px',
            transition: 'background 0.3s ease, color 0.3s ease'
        },
        themeToggleBtn: {
            position: 'absolute', top: '20px', right: '20px', background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            border: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.1)',
            padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', color: isDark ? '#fff' : '#000',
            display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 'bold', backdropFilter: 'blur(10px)', transition: 'all 0.2s'
        },
        brandHeader: { textAlign: 'center', marginBottom: '40px' },
        logo: { margin: 0, fontSize: '3rem', fontWeight: '800', letterSpacing: '2px', color: isDark ? '#fff' : '#0ea5e9', textShadow: isDark ? '0 4px 20px rgba(56, 189, 248, 0.4)' : 'none' },
        tagline: { margin: '10px 0 0 0', fontSize: '1.1rem', color: isDark ? '#94a3b8' : '#475569' },
        
        authCard: { 
            background: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.9)', 
            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)', 
            borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '420px', 
            backdropFilter: 'blur(15px)', boxShadow: isDark ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 20px 40px -10px rgba(0,0,0,0.1)'
        },
        cardTitle: { margin: '0 0 10px 0', fontSize: '1.8rem', color: isDark ? '#f8fafc' : '#0f172a', textAlign: 'center' },
        cardSubtitle: { margin: '0 0 30px 0', fontSize: '0.95rem', color: isDark ? '#cbd5e1' : '#64748b', textAlign: 'center' },
        
        form: { display: 'flex', flexDirection: 'column', gap: '20px' },
        inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
        label: { fontSize: '0.9rem', color: isDark ? '#94a3b8' : '#475569', fontWeight: '600' },
        
        input: { 
            background: isDark ? 'rgba(15, 23, 42, 0.6)' : '#ffffff', 
            border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1', 
            padding: '14px', borderRadius: '8px', 
            color: isDark ? 'white' : '#0f172a', 
            fontSize: '1rem', outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s', width: '100%'
        },
        
        passwordContainer: { position: 'relative', display: 'flex', alignItems: 'center', width: '100%' },
        passwordInput: { 
            background: isDark ? 'rgba(15, 23, 42, 0.6)' : '#ffffff', 
            border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1', 
            padding: '14px', paddingRight: '50px', borderRadius: '8px', 
            color: isDark ? 'white' : '#0f172a', 
            fontSize: '1rem', outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s', width: '100%'
        },
        eyeBtn: { 
            position: 'absolute', right: '12px', background: 'transparent', border: 'none', 
            color: isDark ? '#94a3b8' : '#64748b', fontSize: '1.2rem', cursor: 'pointer', padding: '0', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', outline: 'none'
        },
        
        forgotLink: { fontSize: '0.85rem', color: '#0284c7', cursor: 'pointer', textDecoration: 'none', fontWeight: '500' },
        
        submitBtn: { 
            marginTop: '10px', background: 'linear-gradient(135deg, #0284c7, #2563eb)', color: 'white', border: 'none', 
            padding: '15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', 
            boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)', transition: 'transform 0.1s'
        },
        
        toggleText: { marginTop: '25px', textAlign: 'center', fontSize: '0.95rem', color: isDark ? '#94a3b8' : '#64748b' },
        toggleLink: { color: '#0284c7', fontWeight: 'bold', cursor: 'pointer' },
        
        errorBox: { background: 'rgba(239, 68, 68, 0.1)', color: isDark ? '#fca5a5' : '#dc2626', border: '1px solid #ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' },
        successBox: { background: 'rgba(16, 185, 129, 0.1)', color: isDark ? '#6ee7b7' : '#059669', border: '1px solid #10b981', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }
    };

    return (
        <div style={currentStyles.pageContainer}>
            {/* Theme Toggle Button */}
            <button onClick={cycleTheme} style={currentStyles.themeToggleBtn}>
                {themePref === 'system' ? '💻 System' : themePref === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </button>

            {/* Top Branding */}
            <div style={currentStyles.brandHeader}>
                <h1 style={currentStyles.logo}>SkillForge</h1>
                <p style={currentStyles.tagline}>The Ultimate Assessment Platform</p>
            </div>

            {/* Authentication Card */}
            <div style={currentStyles.authCard}>
                <h2 style={currentStyles.cardTitle}>{isLoginView ? 'Welcome Back' : 'Create an Account'}</h2>
                <p style={currentStyles.cardSubtitle}>
                    {isLoginView ? 'Sign in to access your dashboard.' : 'Register to start taking assessments.'}
                </p>

                {errorMsg && <div style={currentStyles.errorBox}>{errorMsg}</div>}
                {successMsg && <div style={currentStyles.successBox}>{successMsg}</div>}

                <form onSubmit={handleSubmit} style={currentStyles.form}>
                    {!isLoginView && (
                        <div style={currentStyles.inputGroup}>
                            <label style={currentStyles.label}>Full Name</label>
                            <input 
                                type="text" name="name" value={formData.name} onChange={handleChange} 
                                required placeholder="e.g. John Doe" style={currentStyles.input} 
                            />
                        </div>
                    )}

                    <div style={currentStyles.inputGroup}>
                        <label style={currentStyles.label}>Email Address</label>
                        <input 
                            type="email" name="email" value={formData.email} onChange={handleChange} 
                            required placeholder="you@example.com" style={currentStyles.input} 
                        />
                    </div>

                    <div style={currentStyles.inputGroup}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <label style={currentStyles.label}>Password</label>
                            {isLoginView && <span style={currentStyles.forgotLink}>Forgot password?</span>}
                        </div>
                        
                        <div style={currentStyles.passwordContainer}>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="password" value={formData.password} onChange={handleChange} 
                                required placeholder="••••••••" style={currentStyles.passwordInput} 
                            />
                            <button 
                                type="button" onClick={() => setShowPassword(!showPassword)}
                                style={currentStyles.eyeBtn} title={showPassword ? "Hide Password" : "Show Password"}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    <button type="submit" style={currentStyles.submitBtn} disabled={loading}>
                        {loading ? 'Processing...' : (isLoginView ? 'Sign In Securely' : 'Register Account')}
                    </button>
                </form>

                {/* Toggle View Link */}
                <div style={currentStyles.toggleText}>
                    {isLoginView ? "Don't have an account? " : "Already have an account? "}
                    <span 
                        onClick={() => { 
                            setIsLoginView(!isLoginView); setErrorMsg(''); setSuccessMsg(''); setShowPassword(false);
                        }} 
                        style={currentStyles.toggleLink}
                    >
                        {isLoginView ? 'Register here' : 'Sign in here'}
                    </span>
                </div>
            </div>
        </div>
    );
}