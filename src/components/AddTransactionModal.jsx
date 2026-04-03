import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { CATEGORIES } from '../utils/constants';

export const AddTransactionModal = ({ onClose }) => {
  const { addTransaction } = useStore();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTx = {
      id: Date.now(),
      description: formData.description,
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      date: formData.date
    };
    addTransaction(newTx);
    onClose();
  };

  return (
    <div className="overlay">
      <div className="modal-box">
        <div className="modal-head">
          <h2 className="modal-title">Add Transaction</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label>Description</label>
              <input 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                required 
                placeholder="e.g. Grocery Store" 
              />
            </div>
            <div className="form-grid form-grid-2">
              <div className="field">
                <label>Amount</label>
                <input 
                  name="amount" 
                  type="number" 
                  step="0.01" 
                  value={formData.amount} 
                  onChange={handleChange} 
                  required 
                  placeholder="50.00" 
                />
              </div>
              <div className="field">
                <label>Type</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
            </div>
            <div className="form-grid form-grid-2">
              <div className="field">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Date</label>
                <input 
                  name="date" 
                  type="date" 
                  value={formData.date} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>
          </div>
          <div className="form-footer">
            <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
            <button type="submit" className="btn btn-gold">Save Transaction</button>
          </div>
        </form>
      </div>
    </div>
  );
};
