import React, { useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import { CATEGORIES, COLORS, formatCurrency } from '../utils/constants';
import { AddTransactionModal } from '../components/AddTransactionModal';

export const Transactions = () => {
  const { 
    transactions, role, deleteTransaction,
    filterString, setFilterString,
    filterCategory, setFilterCategory,
    filterType, setFilterType,
    sortBy, setSortBy
  } = useStore();
  
  const [showModal, setShowModal] = useState(false);

  const filteredTxs = useMemo(() => {
    return transactions
      .filter(t => (
        (t.description.toLowerCase().includes(filterString.toLowerCase()) || 
         t.category.toLowerCase().includes(filterString.toLowerCase())) &&
        (filterType === 'all' || t.type === filterType) &&
        (filterCategory === 'all' || t.category === filterCategory)
      ))
      .sort((a, b) => {
        if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
        if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'amount-asc') return a.amount - b.amount;
        if (sortBy === 'amount-desc') return b.amount - a.amount;
        return 0;
      });
  }, [transactions, filterString, filterCategory, filterType, sortBy]);

  const handleExportCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...filteredTxs.map(t => [
        t.date,
        `"${t.description.replace(/"/g, '""')}"`,
        t.category,
        t.type,
        t.amount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'transactions_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="animate-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span className="page-eyebrow">Records</span>
          <h1 className="page-title">Transaction <em>History</em></h1>
          <p className="page-subtitle">View and manage all your income and expenses.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-ghost" onClick={handleExportCSV}>
            <span className="icon">📄</span> Export CSV
          </button>
          {role === 'Admin' && (
            <button className="btn btn-gold" onClick={() => setShowModal(true)}>
              + Add Transaction
            </button>
          )}
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-wrap">
          <input 
            type="text" 
            placeholder="Search description..." 
            value={filterString}
            onChange={(e) => setFilterString(e.target.value)}
          />
        </div>
        <div className="filter-divider"></div>
        <select className="filter-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select className="filter-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="filter-spacer"></div>
        <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </select>
      </div>

      <div className="surface-flush">
        {filteredTxs.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                {role === 'Admin' && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTxs.map(t => (
                <tr key={t.id}>
                  <td className="tx-date">{t.date}</td>
                  <td className="tx-desc">{t.description}</td>
                  <td>
                    <span style={{ color: COLORS[t.category] }} className="cat-tag">
                      {t.category}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${t.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className={`tx-amount ${t.type === 'income' ? 'pos' : 'neg'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                  {role === 'Admin' && (
                    <td style={{ textAlign: 'right' }}>
                      <div className="row-actions" style={{ justifyContent: 'flex-end' }}>
                        <button onClick={() => deleteTransaction(t.id)} className="icon-btn icon-btn-del" title="Delete">
                          ×
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty">
            <div className="empty-icon">📭</div>
            <p>No transactions found matching your filters.</p>
          </div>
        )}
      </div>

      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </div>
  );
};
