import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  setAuth: (user, token) => { localStorage.setItem('token', token); set({ user, token, isAuthenticated: true }); },
  logout: () => { localStorage.removeItem('token'); set({ user: null, token: null, isAuthenticated: false }); },
  setUser: (user) => set({ user }),
}))

export const useTransactionStore = create((set) => ({
  transactions: [],
  filters: { category: null, type: null, startDate: null, endDate: null },
  setTransactions: (transactions) => set({ transactions }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  addTransaction: (transaction) => set((state) => ({ transactions: [transaction, ...state.transactions] })),
}))

export const useUIStore = create((set) => ({
  isLoading: false,
  toast: null,
  setLoading: (isLoading) => set({ isLoading }),
  showToast: (message, type = 'info') => { set({ toast: { message, type } }); setTimeout(() => set({ toast: null }), 3000); },
}))