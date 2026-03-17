import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionCard from './TransactionCard';
import TotalCard from './TotalCard';
import '../App.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
  const storedUser = localStorage.getItem('currentUser');
  return storedUser ? JSON.parse(storedUser) : null;
});

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('expense');
  const user = JSON.parse(localStorage.getItem('currentUser'))

const userKey = currentUser ? `transactions_${currentUser.username}` : null;
  
const [transactions, setTransactions] = useState(() => {
    if (!userKey) return [];
    const stored = localStorage.getItem(userKey);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!description || !amount || !category) return;

    const newTransaction = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      category,
      type,
      date: new Date().toISOString(),
    };

    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    if (userKey) {
      localStorage.setItem(userKey, JSON.stringify(updatedTransactions));
    }

    // Reset form
    setDescription('');
    setAmount('');
    setCategory('');
    setType('expense');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/');
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>{currentUser?.name1}'s Expense Tracker Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
      </header>

      <div className="dashboard-content">
        <TotalCard transactions={transactions} />

        <div className="add-transaction">
          <h2>Add New Transaction</h2>
          <form onSubmit={handleAddTransaction}>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="amount">Amount:</label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category:</label>
              <input
                type="text"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="type">Type:</label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Add Transaction</button>
          </form>
        </div>

        <div className="transactions-list">
          <h2>Recent Transactions</h2>
          <div className="transactions-grid">
            {transactions.slice(-10).reverse().map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;