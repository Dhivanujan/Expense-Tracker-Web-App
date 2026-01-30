import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout.jsx';
import ExpenseForm from '../components/ExpenseForm.jsx';
import ExpenseList from '../components/ExpenseList.jsx';
import SummaryCards from '../components/SummaryCards.jsx';
import CategoryChart from '../components/CategoryChart.jsx';
import { useApiClient } from '../api/client.js';

const getCurrentMonthParam = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${year}-${month}`;
};

const DashboardPage = () => {
  const api = useApiClient();
  const [month, setMonth] = useState(getCurrentMonthParam());
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ totalAmount: 0, byCategory: [] });
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [error, setError] = useState(null);

  // New state for filtering and pagination
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const monthLabel = useMemo(() => month, [month]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search change
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Reset page when category or month changes
  useEffect(() => {
    setPage(1);
  }, [categoryFilter, month]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const expensesParams = {
        month,
        page,
        limit: 5, // Smaller limit to demonstrate pagination
        search: debouncedSearch,
        category: categoryFilter,
      };

      const [expensesRes, summaryRes] = await Promise.all([
        api.get('/expenses', { params: expensesParams }),
        api.get('/expenses/summary', { params: { month } }),
      ]);

      setExpenses(expensesRes.data.expenses);
      setTotalPages(expensesRes.data.pages);
      setSummary(summaryRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [month, page, debouncedSearch, categoryFilter]);

  const handleCreateOrUpdate = async (payload) => {
    setFormLoading(true);
    setError(null);
    try {
      if (selectedExpense) {
        await api.put(`/expenses/${selectedExpense._id}`, payload);
        setSelectedExpense(null);
      } else {
        await api.post('/expenses', payload);
      }
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save expense');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    setError(null);
    try {
      await api.delete(`/expenses/${id}`);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete expense');
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const res = await api.get('/reports/monthly', {
        params: { month },
        responseType: 'blob',
      });

      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `expense-report-${month}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to download PDF');
    }
  };

  return (
    <Layout>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div className="animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-bold gradient-text">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            Track your monthly spending and explore categories
          </p>
        </div>
        <div className="flex items-center gap-3 glass-card p-2 self-stretch sm:self-auto animate-slide-in-right">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="bg-transparent border-none text-sm text-slate-200 focus:ring-0 cursor-pointer [color-scheme:dark]"
            />
          </div>
          <div className="w-px h-8 bg-slate-700/50"></div>
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 hover:from-emerald-500/20 hover:to-cyan-500/20 text-emerald-400 text-xs font-semibold transition-all border border-emerald-500/20 hover:border-emerald-500/40 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-y-0.5 transition-transform"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 flex items-center gap-3 text-sm text-red-200 bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-4 shadow-lg shadow-red-900/10 animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <span>{error}</span>
        </div>
      )}

      {/* Summary Cards */}
      <SummaryCards totalAmount={summary.totalAmount || 0} monthLabel={monthLabel} />

      {/* Form and Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 mb-8">
        {/* Expense Form Card */}
        <div className="lg:col-span-2 glass-card p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-3 relative z-10">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">{selectedExpense ? <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></> : <><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></>}</svg>
            </div>
            <span className="gradient-text">{selectedExpense ? 'Edit Expense' : 'New Expense'}</span>
          </h2>
          <ExpenseForm
            onSubmit={handleCreateOrUpdate}
            initialData={selectedExpense}
            loading={formLoading}
          />
        </div>

        {/* Chart Card */}
        <div className="glass-card p-6 flex flex-col min-h-[350px] relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full -ml-16 -mb-16 group-hover:scale-150 transition-transform duration-700"></div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-3 relative z-10">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
            </div>
            <span className="gradient-text">Spending by Category</span>
          </h2>
          <div className="flex-1 flex items-center justify-center relative z-10">
            <CategoryChart data={summary.byCategory || []} />
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="glass-card p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
              </div>
              <span className="gradient-text">Transactions</span>
            </h2>
            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Loading...
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative group">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input
                type="text"
                placeholder="Search expenses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-11 w-full sm:w-auto"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field cursor-pointer"
            >
              <option value="All">All Categories</option>
              {['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Other'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        
        <ExpenseList
          expenses={expenses}
          onEdit={(exp) => setSelectedExpense(exp)}
          onDelete={handleDelete}
        />

        {/* Pagination Controls */}
        <div className="mt-6 pt-5 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="text-slate-400 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
            Page <span className="font-semibold text-white">{page}</span> of <span className="font-semibold text-white">{totalPages || 1}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-secondary px-4 py-2 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="btn-secondary px-4 py-2 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
