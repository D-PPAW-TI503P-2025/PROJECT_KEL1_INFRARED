import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { handleLogin } from '../lib/app';

export default function Login() {
    useEffect(() => {
        const form = document.getElementById('loginForm') as HTMLFormElement | null;
        const submit = (e: Event) => handleLogin(e);
        if (form) form.addEventListener('submit', submit);
        return () => { if (form) form.removeEventListener('submit', submit); };
    }, []);

    return (
        <div>
            <header>
                <nav>
                    <div className="logo">IoT Monitor</div>
                    <div className="nav-links">
                        <Link to="/">Home</Link>
                        <Link to="/register">Register</Link>
                    </div>
                </nav>
            </header>

            <main>
                <div className="auth-container">
                    <h2>Login</h2>
                    <form id="loginForm">
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" id="email" required />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" id="password" required />
                        </div>
                        <button type="submit" className="btn" style={{ width: '100%' }}>Login</button>
                    </form>
                    <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                        Don't have an account? <Link to="/register">Register</Link>
                    </p>
                </div>
            </main>
        </div>
    );
}
