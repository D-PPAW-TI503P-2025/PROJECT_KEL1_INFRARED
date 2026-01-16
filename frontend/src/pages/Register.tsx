import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { handleRegister } from '../lib/app';

export default function Register() {
    useEffect(() => {
        const form = document.getElementById('registerForm') as HTMLFormElement | null;
        const submit = (e: Event) => handleRegister(e);
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
                        <Link to="/login">Login</Link>
                    </div>
                </nav>
            </header>

            <main>
                <div className="auth-container">
                    <h2>Register</h2>
                    <form id="registerForm">
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" id="name" required />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" id="email" required />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" id="password" required />
                        </div>
                        <div className="form-group">
                            <label>Role</label>
                            <select id="role" style={{ width: '100%', padding: '.5rem', border: '1px solid #d1d5db', borderRadius: 4 }}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <button type="submit" className="btn" style={{ width: '100%' }}>Register</button>
                    </form>
                </div>
            </main>
        </div>
    );
}
