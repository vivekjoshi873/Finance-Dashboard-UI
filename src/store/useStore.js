import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 15 Mock Transactions covering multiple categories and 3 months
const INITIAL_TXS = [
  { id: 1, date: '2026-01-05', description: 'Monthly Salary', category: 'Salary', type: 'income', amount: 5000 },
  { id: 2, date: '2026-01-10', description: 'Rent Payment', category: 'Housing', type: 'expense', amount: 1500 },
  { id: 3, date: '2026-01-12', description: 'Grocery Store', category: 'Food', type: 'expense', amount: 120 },
  { id: 4, date: '2026-01-15', description: 'Internet Bill', category: 'Utilities', type: 'expense', amount: 80 },
  { id: 5, date: '2026-01-20', description: 'Freelance Design', category: 'Freelance', type: 'income', amount: 800 },
  { id: 6, date: '2026-02-02', description: 'Monthly Salary', category: 'Salary', type: 'income', amount: 5000 },
  { id: 7, date: '2026-02-10', description: 'Rent Payment', category: 'Housing', type: 'expense', amount: 1500 },
  { id: 8, date: '2026-02-15', description: 'Electricity Bill', category: 'Utilities', type: 'expense', amount: 110 },
  { id: 9, date: '2026-02-20', description: 'Amazon Shopping', category: 'Shopping', type: 'expense', amount: 300 },
  { id: 10, date: '2026-02-25', description: 'Netflix Subscription', category: 'Entertainment', type: 'expense', amount: 15 },
  { id: 11, date: '2026-03-01', description: 'Monthly Salary', category: 'Salary', type: 'income', amount: 5000 },
  { id: 12, date: '2026-03-05', description: 'Stock Dividend', category: 'Investment', type: 'income', amount: 200 },
  { id: 13, date: '2026-03-10', description: 'Rent Payment', category: 'Housing', type: 'expense', amount: 1500 },
  { id: 14, date: '2026-03-15', description: 'Gym Membership', category: 'Health', type: 'expense', amount: 50 },
  { id: 15, date: '2026-03-20', description: 'Uber Rides', category: 'Transport', type: 'expense', amount: 120 },
  { id: 16, date: '2026-03-25', description: 'Apple Store', category: 'Shopping', type: 'expense', amount: 1200 },
];

export const useStore = create(
  persist(
    (set) => ({
      transactions: INITIAL_TXS,
      role: 'Admin', // 'Admin' or 'Viewer'
      
      // We could keep filter state in Zustand too, 
      // but it's often better kept local to the component unless needed globally.
      // The prompt requests: "the current filter/search state for the transactions page."
      filterString: '',
      filterCategory: 'all',
      filterType: 'all',
      sortBy: 'date-desc',
      theme: 'dark',

      setRole: (role) => set({ role }),
      setTheme: (theme) => set({ theme }),
      
      addTransaction: (tx) => 
        set((state) => ({ transactions: [tx, ...state.transactions] })),
        
      updateTransaction: (updatedTx) =>
        set((state) => ({
          transactions: state.transactions.map((t) => 
            t.id === updatedTx.id ? updatedTx : t
          )
        })),
        
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id)
        })),

      // Filter actions
      setFilterString: (filterString) => set({ filterString }),
      setFilterCategory: (filterCategory) => set({ filterCategory }),
      setFilterType: (filterType) => set({ filterType }),
      setSortBy: (sortBy) => set({ sortBy }),
    }),
    {
      name: 'fintrack-storage', // name of the item in the storage (must be unique)
      partialize: (state) => ({ 
        transactions: state.transactions, 
        role: state.role,
        theme: state.theme
      }),
    }
  )
);
