import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to BudgetNest - Your Personalized Expense Tracker</h1>
      <p>Track your expenses and manage your budget effectively.</p>
      <div className="home-buttons">
        <Link to="/login" className="btn btn-primary">Login</Link>
        <Link to="/signup" className="btn btn-secondary">Create Account</Link>
      </div>
    </div>
  );
};

export default Home;