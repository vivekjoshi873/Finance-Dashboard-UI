export const CATEGORIES = ['Housing', 'Food', 'Transport', 'Entertainment', 'Health', 'Salary', 'Freelance', 'Utilities', 'Shopping', 'Investment'];

export const COLORS = {
  Housing: '#10b981',
  Food: '#f59e0b',
  Transport: '#3b82f6',
  Entertainment: '#8b5cf6',
  Health: '#ec4899',
  Salary: '#10b981',
  Freelance: '#059669',
  Utilities: '#6366f1',
  Shopping: '#f43f5e',
  Investment: '#eab308',
};

export const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
