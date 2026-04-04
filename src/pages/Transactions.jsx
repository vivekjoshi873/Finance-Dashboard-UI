import { useState, useMemo } from "react";
import useStore from "../store/useStore";
import TransactionModal from "../components/TransactionModal";
import EmptyState from "../components/EmptyState";
import "./Transactions.css";

const CATEGORIES = [
  "All", "Food", "Transport", "Salary", "Entertainment", "Utilities",
  "Freelance", "Shopping", "Health", "Rent", "Education",
];

function fmt(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", minimumFractionDigits: 2,
  }).format(n);
}

export default function Transactions() {
  const {
    transactions, role, filters, setFilter, resetFilters,
    deleteTransaction, resetData,
  } = useStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  // Apply filters + sort
  const filtered = useMemo(() => {
    let list = [...transactions];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((t) => t.description.toLowerCase().includes(q));
    }
    if (filters.category !== "All") {
      list = list.filter((t) => t.category === filters.category);
    }
    if (filters.type !== "All") {
      list = list.filter((t) => t.type === filters.type.toLowerCase());
    }

    list.sort((a, b) => {
      let cmp = 0;
      if (filters.sortBy === "date") cmp = a.date.localeCompare(b.date);
      else if (filters.sortBy === "amount") cmp = a.amount - b.amount;
      return filters.sortOrder === "desc" ? -cmp : cmp;
    });

    return list;
  }, [transactions, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Reset page when filters change
  useMemo(() => setPage(1), [filters]);

  const handleSort = (col) => {
    if (filters.sortBy === col) {
      setFilter("sortOrder", filters.sortOrder === "asc" ? "desc" : "asc");
    } else {
      setFilter("sortBy", col);
      setFilter("sortOrder", "desc");
    }
  };

  const sortArrow = (col) => {
    if (filters.sortBy !== col) return "";
    return filters.sortOrder === "asc" ? " ↑" : " ↓";
  };

  const handleEdit = (tx) => {
    setEditingTx(tx);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTx(null);
  };

  // CSV Export
  const exportCSV = () => {
    const header = "Date,Description,Category,Type,Amount";
    const rows = filtered.map(
      (t) => `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const today = new Date().toISOString().split("T")[0];
    a.download = `fintrack-transactions-${today}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-enter">
      <div className="transactions-header">
        <h2 className="page-title">Transactions</h2>
        <div className="transactions-actions">
          <button className="btn btn-secondary" onClick={exportCSV}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export CSV
          </button>
          {role === "admin" && (
            <>
              <button
                id="add-transaction-btn"
                className="btn btn-primary"
                onClick={() => setModalOpen(true)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Transaction
              </button>
              <button className="btn btn-danger" onClick={resetData}>
                Reset Data
              </button>
            </>
          )}
        </div>
      </div>

      {role === "viewer" && (
        <div className="viewer-banner">
          You are in Viewer mode. Switch to Admin to manage transactions.
        </div>
      )}

      {/* Filters */}
      <div className="filters-bar card">
        <input
          id="search-input"
          className="form-input filter-search"
          type="text"
          placeholder="Search transactions..."
          value={filters.search}
          onChange={(e) => setFilter("search", e.target.value)}
        />
        <select
          id="category-filter"
          className="form-input filter-select"
          value={filters.category}
          onChange={(e) => setFilter("category", e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          id="type-filter"
          className="form-input filter-select"
          value={filters.type}
          onChange={(e) => setFilter("type", e.target.value)}
        >
          <option value="All">All Types</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
      </div>

      {/* Table / Empty state */}
      {filtered.length === 0 ? (
        <div className="card" style={{ marginTop: 16 }}>
          <EmptyState
            message={
              transactions.length === 0
                ? "No transactions yet. Add your first transaction."
                : "No transactions found"
            }
            description="Try adjusting your search or filter criteria."
            action={
              transactions.length === 0 && role === "admin" ? (
                <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
                  Add Transaction
                </button>
              ) : (
                <button className="btn btn-secondary" onClick={resetFilters}>
                  Clear Filters
                </button>
              )
            }
          />
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="card tx-table-card">
            <table className="tx-table">
              <thead>
                <tr>
                  <th className="sortable" onClick={() => handleSort("date")}>
                    Date{sortArrow("date")}
                  </th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th className="sortable" onClick={() => handleSort("amount")}>
                    Amount{sortArrow("amount")}
                  </th>
                  {role === "admin" && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {paginated.map((tx, i) => (
                  <tr key={tx.id} className="tx-row" style={{ animationDelay: `${i * 40}ms` }}>
                    <td className="tx-date">
                      {new Date(tx.date).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </td>
                    <td className="tx-desc">{tx.description}</td>
                    <td><span className={`cat-badge cat-${tx.category}`}>{tx.category}</span></td>
                    <td>
                      <span className={`badge ${tx.type === "income" ? "badge-income" : "badge-expense"}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className={tx.type === "income" ? "amount-income" : "amount-expense"}>
                      {tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}
                    </td>
                    {role === "admin" && (
                      <td className="tx-actions">
                        <button className="btn-icon" onClick={() => handleEdit(tx)} aria-label="Edit">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button className="btn-icon" onClick={() => deleteTransaction(tx.id)} aria-label="Delete">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--expense)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="tx-mobile-list">
            {paginated.map((tx, i) => (
              <div key={tx.id} className="tx-mobile-card card" style={{ animationDelay: `${i * 40}ms` }}>
                <div className="tx-mobile-top">
                  <span className="tx-desc">{tx.description}</span>
                  <span className={tx.type === "income" ? "amount-income" : "amount-expense"}>
                    {tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}
                  </span>
                </div>
                <div className="tx-mobile-bottom">
                  <span className="tx-date">
                    {new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <span className={`cat-badge cat-${tx.category}`}>{tx.category}</span>
                  <span className={`badge ${tx.type === "income" ? "badge-income" : "badge-expense"}`}>
                    {tx.type}
                  </span>
                </div>
                {role === "admin" && (
                  <div className="tx-mobile-actions">
                    <button className="btn btn-secondary" onClick={() => handleEdit(tx)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => deleteTransaction(tx.id)}>Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button
              className="btn btn-ghost"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-ghost"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {modalOpen && (
        <TransactionModal onClose={handleCloseModal} editingTx={editingTx} />
      )}
    </div>
  );
}
