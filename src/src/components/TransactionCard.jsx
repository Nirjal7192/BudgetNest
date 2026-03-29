import React from 'react';
import '../App.css';

const TransactionCard = ({ transaction }) => {
  return (
    <div className="transaction-card">
      <div className="transaction-header">
        <h3>{transaction.description}</h3>
        <span className={`amount ${transaction.type === 'income' ? 'income' : 'expense'}`}>
          {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
        </span>
      </div>
      <div className="transaction-details">
        <p><strong>Category:</strong> {transaction.category}</p>
        <p><strong>Date:</strong> {new Date(transaction.date).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default TransactionCard;