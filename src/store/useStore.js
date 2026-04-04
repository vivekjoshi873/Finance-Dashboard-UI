import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockTransactions } from "../data/mockTransactions";

const useStore = create(
  persist(
    (set, get) => ({
      transactions: mockTransactions,
      role: "viewer",
      filters: {
        search: "",
        category: "All",
        type: "All",
        sortBy: "date",
        sortOrder: "desc",
      },
      darkMode: false,

      addTransaction: (tx) =>
        set((state) => ({
          transactions: [
            { ...tx, id: `t${Date.now()}` },
            ...state.transactions,
          ],
        })),

      editTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === id ? { ...tx, ...updates } : tx
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.id !== id),
        })),

      setRole: (role) => set({ role }),

      setFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),

      resetFilters: () =>
        set({
          filters: {
            search: "",
            category: "All",
            type: "All",
            sortBy: "date",
            sortOrder: "desc",
          },
        }),

      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      resetData: () => set({ transactions: mockTransactions }),
    }),
    {
      name: "fintrack-store",
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
        darkMode: state.darkMode,
      }),
    }
  )
);

export default useStore;
