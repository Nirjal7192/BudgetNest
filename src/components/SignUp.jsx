import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

const SignUp = () => {
    const [name1, setname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const getUsers = () => {
        return JSON.parse(localStorage.getItem('users') || '[]');
    };

    const handleSignUp = (e) => {
        e.preventDefault();

        if (!name1 || !username || !email || !password || !confirmPassword) {
            setError('Please fill out all fields.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        const users = getUsers();
        const userExists = users.some((u) => u.username === username);

        if (userExists) {
            setError('Username already exists. Try another.');
            return;
        }

        const newUser = {
            name1,
            username,
            email,
            password,
        };

        const updatedUsers = [...users, newUser];
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        navigate('/dashboard');
    };

    return (
        <div className="login">
            <h2>Create Your Account</h2>
            <form onSubmit={handleSignUp}>
                <div className="form-group">
                    <label htmlFor="name1">Name:</label>
                    <input
                        type="text"
                        id="name1"
                        value={name1}
                        onChange={(e) => {
                            setname(e.target.value);
                            setError('');
                        }}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setError('');
                        }}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError('');
                        }}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError('');
                        }}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setError('');
                        }}
                        required
                    />
                </div>
                {error && <p style={{ color: '#ff0040', marginBottom: '16px' }}>{error}</p>}
                <button type="submit" className="btn btn-primary">Create account</button>
            </form>
            <p>
                Already have an account?{' '}
                <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.9rem' }}>
                    Login
                </Link>
            </p>
        </div>
    );
};

export default SignUp;
