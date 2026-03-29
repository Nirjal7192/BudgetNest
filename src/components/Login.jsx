import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const getUsers = () => {
        return JSON.parse(localStorage.getItem('users') || '[]');
    };

    const handleLogin = (e) => {
        e.preventDefault();

        const users = getUsers();
        console.log("Stored users:", users); // 👈 ADD THIS

        const user = users.find((u) => u.username === username);

        if (!user) {
            setError('No account found for that username.');
            return;
        }

        if (user.password !== password) {
            setError('Incorrect password.');
            return;
        }

        localStorage.setItem('currentUser', JSON.stringify(user));
        navigate('/dashboard');
    };

    return (
        <div className="login">
            <h2>Login to Your Account</h2>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
                {error && <p style={{ color: '#ff0040', marginBottom: '16px' }}>{error}</p>}
            </form>
            <p>
                Don't have an account?{' '}
                <Link to="/signup" className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.9rem' }}>
                    Sign up
                </Link>
            </p>
        </div>
    );
};

export default Login;