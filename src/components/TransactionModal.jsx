import { useState, useEffect } from "react";
import useStore from "../store/useStore";
import "./TransactionModal.css";

const CATEGORIES = [
  "Food", "Transport", "Salary", "Entertainment", "Utilities",
  "Freelance", "Shopping", "Health", "Rent", "Education",
];

export default function TransactionModal({ onClose, editingTx }) {
  const { addTransaction, editTransaction } = useStore();

  const [form, setForm] = useState({
    description: "",
    amount: "",
    type: "expense",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTx) {
      setForm({
        description: editingTx.description,
        amount: String(editingTx.amount),
        type: editingTx.type,
        category: editingTx.category,
        date: editingTx.date,
      });
    }
  }, [editingTx]);

  const validate = () => {
    const errs = {};
    if (!form.description.trim()) errs.description = "Description is required";
    if (!form.amount || Number(form.amount) <= 0) errs.amount = "Amount must be > 0";
    if (!form.date) errs.date = "Date is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const tx = {
      description: form.description.trim(),
      amount: parseFloat(form.amount),
      type: form.type,
      category: form.category,
      date: form.date,
    };

    if (editingTx) {
      editTransaction(editingTx.id, tx);
    } else {
      addTransaction(tx);
    }
    onClose();
  };

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {editingTx ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="tx-desc">Description</label>
            <input
              id="tx-desc"
              className={`form-input ${errors.description ? "error" : ""}`}
              type="text"
              placeholder="e.g. Grocery shopping"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tx-amount">Amount ($)</label>
              <input
                id="tx-amount"
                className={`form-input ${errors.amount ? "error" : ""}`}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
              />
              {errors.amount && <span className="form-error">{errors.amount}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="tx-type">Type</label>
              <select
                id="tx-type"
                className="form-input"
                value={form.type}
                onChange={(e) => handleChange("type", e.target.value)}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tx-category">Category</label>
              <select
                id="tx-category"
                className="form-input"
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tx-date">Date</label>
              <input
                id="tx-date"
                className={`form-input ${errors.date ? "error" : ""}`}
                type="date"
                value={form.date}
                onChange={(e) => handleChange("date", e.target.value)}
              />
              {errors.date && <span className="form-error">{errors.date}</span>}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingTx ? "Save Changes" : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
