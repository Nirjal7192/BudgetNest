import React, { useState, useMemo } from 'react';
import '../App.css';

const TotalCard = ({ transactions }) => {
  const [filter, setFilter] = useState('all');

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let startDate;

    switch (filter) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        return transactions;
    }

    return transactions.filter(transaction => new Date(transaction.date) >= startDate);
  }, [transactions, filter]);

  const total = useMemo(() => {
    return filteredTransactions.reduce((sum, transaction) => {
      return transaction.type === 'income' ? sum + transaction.amount : sum - transaction.amount;
    }, 0);
  }, [filteredTransactions]);

  return (
    <div className="total-card">
      <h2>Total Balance</h2>
      <div className="total-amount">
        <span className={`amount ${total >= 0 ? 'positive' : 'negative'}`}>
          ${total.toFixed(2)}
        </span>
      </div>
      <div className="filter-buttons">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All Time
        </button>
        <button
          className={filter === 'week' ? 'active' : ''}
          onClick={() => setFilter('week')}
        >
          Last Week
        </button>
        <button
          className={filter === 'month' ? 'active' : ''}
          onClick={() => setFilter('month')}
        >
          Last Month
        </button>
        <button
          className={filter === 'year' ? 'active' : ''}
          onClick={() => setFilter('year')}
        >
          This Year
        </button>
      </div>
    </div>
  );
};

export default TotalCard;