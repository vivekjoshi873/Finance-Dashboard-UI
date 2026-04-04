# Fintrack — Personal Finance Dashboard

A modern, role-based financial tracking dashboard built with React 19 and Vite. Track your income, expenses, and savings insights with a clean, responsive UI and smooth animations.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Routing | React Router DOM v7 |
| State Management | Zustand v5 with persist middleware |
| Charts | Recharts v3 |
| Styling | Plain CSS with custom properties (no Tailwind, no MUI) |

---

## Features

- **Dashboard Overview** — Summary cards, balance trend area chart, spending breakdown donut chart, recent transactions
- **Transactions Page** — Full table with search, category/type filters, sortable columns, pagination (10/page), Add/Edit/Delete (Admin only)
- **Insights Page** — Top spending category, monthly comparison, savings rate ring, spending by day of week, category breakdown table
- **Role-Based Access Control** — Admin vs. Viewer roles. Admin can add, edit, delete, and reset data. Viewer has read-only access.
- **Dark Mode** — Smooth CSS transition between light and dark themes, persisted to localStorage
- **CSV Export** — Export filtered transactions as a `.csv` file
- **Responsive Design** — Sidebar on desktop, icon-only sidebar on tablet, bottom tab bar on mobile
- **Persistent State** — All transactions, role preference, and dark mode survive page refresh via Zustand+localStorage

---

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Switching Roles

In the top bar you'll see a **Role** dropdown. Select **Admin** or **Viewer**:

- **Admin** — unlocks Add Transaction button, Edit/Delete buttons on each row, and a Reset Data button
- **Viewer** — hides all mutation controls; a banner on the Transactions page reminds you of the read-only state

Role selection is persisted to localStorage so it survives a page refresh.

---

## State Management

Fintrack uses **Zustand** with the `persist` middleware. The store (`src/store/useStore.js`) holds:

- `transactions` — array of transaction objects (pre-loaded with 20 mock entries)
- `role` — current user role (`"admin"` or `"viewer"`)
- `filters` — current filter/sort state for the transactions table
- `darkMode` — boolean, drives the `data-theme` attribute on `<html>`

All state is serialized to `localStorage` under the key `fintrack-store`. Custom transactions added during a session are restored on next visit. The mock data is only the initial seed — once the store is hydrated from localStorage the seed is ignored.

---

## Folder Structure

```
src/
├── App.jsx              # Router + theme sync
├── App.css              # Global CSS variables, resets, layout, animations
├── main.jsx             # React root
├── store/
│   └── useStore.js      # Zustand store (all global state + actions)
├── data/
│   └── mockTransactions.js
├── pages/
│   ├── Dashboard.jsx / .css
│   ├── Transactions.jsx / .css
│   └── Insights.jsx / .css
└── components/
    ├── Sidebar.jsx / .css
    ├── TopBar.jsx / .css
    ├── SummaryCard.jsx
    ├── TransactionModal.jsx / .css
    └── EmptyState.jsx
```

---

## Live Demo

🔗 _[Deploy link placeholder — add your Vercel/Netlify URL here]_

---

## License

MIT
