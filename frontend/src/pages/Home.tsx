import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div>
            <header>
                <nav>
                    <div className="logo">IoT Monitor</div>
                    <div className="nav-links">
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </div>
                </nav>
            </header>

            <main className="hero">
                <h1>Welcome to IoT Busy Hour Monitoring</h1>
                <p>Real-time analytics for infrared sensor data.</p>
                <Link to="/login" className="btn">Get Started</Link>
            </main>
        </div>
    );
}
