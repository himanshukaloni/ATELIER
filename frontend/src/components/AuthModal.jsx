import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ open, onClose }) {
    const { user, login, register, logout } = useAuth();
    const [mode, setMode] = useState('login'); // 'login' | 'register'

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        const ok = await login(loginEmail, loginPassword);
        if (ok) {
            setLoginEmail('');
            setLoginPassword('');
            onClose();
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const ok = await register(regName, regEmail, regPassword);
        if (ok) {
            setRegName('');
            setRegEmail('');
            setRegPassword('');
            onClose();
        }
    };

    return (
        <div className={`modal ${open ? 'active' : ''}`}>
            <div className="modal-overlay" onClick={onClose}></div>
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>&times;</button>

                {user ? (
                    <div className="auth-form">
                        <h2 className="auth-title">My Account</h2>
                        <p className="auth-subtitle">Welcome, {user.name}!</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                            <Link to="/dashboard" className="auth-submit" style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }} onClick={onClose}>
                                My Orders
                            </Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="auth-submit" style={{ textAlign: 'center', textDecoration: 'none', display: 'block', background: 'var(--color-accent)' }} onClick={onClose}>
                                    Admin Dashboard
                                </Link>
                            )}
                            <button type="button" className="auth-submit" style={{ background: 'var(--color-error)' }} onClick={() => { logout(); onClose(); }}>
                                Logout
                            </button>
                        </div>
                    </div>
                ) : mode === 'login' ? (
                    <div className="auth-form">
                        <h2 className="auth-title">Welcome Back</h2>
                        <p className="auth-subtitle">Sign in to your account</p>
                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <label htmlFor="loginEmail">Email</label>
                                <input type="email" id="loginEmail" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="loginPassword">Password</label>
                                <input type="password" id="loginPassword" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
                            </div>
                            <button type="submit" className="auth-submit">Sign In</button>
                        </form>
                        <p className="auth-switch">
                            Don't have an account?{' '}
                            <a href="#" onClick={(e) => { e.preventDefault(); setMode('register'); }}>Create one</a>
                        </p>
                    </div>
                ) : (
                    <div className="auth-form">
                        <h2 className="auth-title">Create Account</h2>
                        <p className="auth-subtitle">Join our community</p>
                        <form onSubmit={handleRegister}>
                            <div className="form-group">
                                <label htmlFor="registerName">Full Name</label>
                                <input type="text" id="registerName" value={regName} onChange={e => setRegName(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="registerEmail">Email</label>
                                <input type="email" id="registerEmail" value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="registerPassword">Password</label>
                                <input type="password" id="registerPassword" value={regPassword} onChange={e => setRegPassword(e.target.value)} minLength={6} required />
                            </div>
                            <button type="submit" className="auth-submit">Create Account</button>
                        </form>
                        <p className="auth-switch">
                            Already have an account?{' '}
                            <a href="#" onClick={(e) => { e.preventDefault(); setMode('login'); }}>Sign in</a>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
