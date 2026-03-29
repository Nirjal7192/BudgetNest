import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
  const [category, setCategory] = useState('Food');
  const [type, setType] = useState('expense');
  
  const userKey = currentUser ? `transactions_${currentUser.username}` : null;
  
  const [transactions, setTransactions] = useState(() => {
    if (!userKey) return [];
    const stored = localStorage.getItem(userKey);
    return stored ? JSON.parse(stored) : [];
  });

  const categories = ['Food', 'Travel', 'Dineout', 'Hotel', 'Movie', 'Grocery', 'Entertainment', 'Shopping', 'Bills', 'Other'];
  
  const categoryColors = {
    'Food': '#FF6B6B',
    'Travel': '#4A90E2',
    'Dineout': '#50C878',
    'Hotel': '#FFD93D',
    'Movie': '#A78BFA',
    'Grocery': '#F472B6',
    'Entertainment': '#8B5CF6',
    'Shopping': '#EC4899',
    'Bills': '#6366F1',
    'Other': '#64748B'
  };

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

    setDescription('');
    setAmount('');
    setCategory('Food');
    setType('expense');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/');
  };

  // Calculate category-wise spending
  const getCategoryData = () => {
    const categoryMap = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
      });
    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2))
    }));
  };

  // Calculate weekly spending trend
  const getWeeklyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weekData = days.map(day => ({ day, expense: 0, income: 0 }));
    
    const now = new Date();
    const currentDay = now.getDay();
    
    transactions.forEach(t => {
      const tDate = new Date(t.date);
      const tDay = tDate.getDay();
      
      if (tDay >= 1 && tDay <= 7) {
        const index = tDay - 1;
        if (t.type === 'expense') {
          weekData[index].expense += t.amount;
        } else {
          weekData[index].income += t.amount;
        }
      }
    });

    return weekData.map(d => ({
      ...d,
      expense: parseFloat(d.expense.toFixed(2)),
      income: parseFloat(d.income.toFixed(2))
    }));
  };

  const categoryData = getCategoryData();
  const weeklyData = getWeeklyData();

  if (!currentUser) {
    return null;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>{currentUser?.name1}'s Expense Tracker</h1>
        <button onClick={handleLogout} className="btn btn-primary">Logout</button>
      </header>

      <div className="dashboard-content">
        <TotalCard transactions={transactions} />

        {/* Charts Section */}
        <div className="charts-section">
          {categoryData.length > 0 ? (
            <div className="chart-card">
              <h3>Spending by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: $${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={categoryColors[entry.name] || '#4A90E2'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="chart-card">
              <h3>Spending by Category</h3>
              <p style={{ textAlign: 'center', color: '#8b9dc3' }}>No expenses yet. Add your first expense to see charts!</p>
            </div>
          )}

          {weeklyData.some(d => d.expense > 0 || d.income > 0) ? (
            <div className="chart-card">
              <h3>Weekly Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e0" />
                  <XAxis dataKey="day" stroke="#4a5568" />
                  <YAxis stroke="#4a5568" />
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend />
                  <Line type="monotone" dataKey="expense" stroke="#f56565" strokeWidth={2} name="Expenses" />
                  <Line type="monotone" dataKey="income" stroke="#48bb78" strokeWidth={2} name="Income" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="chart-card">
              <h3>Weekly Trend</h3>
              <p style={{ textAlign: 'center', color: '#8b9dc3' }}>No data yet. Add transactions to see trends!</p>
            </div>
          )}
        </div>

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
                placeholder="e.g., Lunch at restaurant"
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
                placeholder="0.00"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category:</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
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
          {transactions.length === 0 ? (
            <p style={{ color: '#8b9dc3', textAlign: 'center', padding: '20px' }}>No transactions yet. Add your first expense!</p>
          ) : (
            <div className="transactions-grid">
              {transactions.slice(-10).reverse().map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;