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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Track your monthly spending and explore categories.</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800/60 backdrop-blur-sm self-stretch sm:self-auto">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="bg-transparent border-none text-sm text-slate-200 focus:ring-0 cursor-pointer px-2 py-1 [color-scheme:dark]"
          />
          <div className="w-px h-6 bg-slate-800 mx-1"></div>
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold transition-all border border-emerald-500/20 hover:border-emerald-500/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Export PDF
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 text-sm text-red-200 bg-red-900/20 border border-red-500/20 rounded-xl px-4 py-3 shadow-lg shadow-red-900/5">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          {error}
        </div>
      )}

      <SummaryCards totalAmount={summary.totalAmount || 0} monthLabel={monthLabel} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </span>
            {selectedExpense ? 'Edit Expense' : 'New Expense'}
          </h2>
          <ExpenseForm
            onSubmit={handleCreateOrUpdate}
            initialData={selectedExpense}
            loading={formLoading}
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
           <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -ml-10 -mb-10"></div>
          <h2 className="text-lg font-semibold mb-4 w-full flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
            </span>
            Spending by Category
          </h2>
          <div className="w-full flex-1 flex items-center justify-center relative z-10">
            <CategoryChart data={summary.byCategory || []} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/10 text-purple-500 text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
              </span>
              Transactions
            </h2>
            {loading && (
             <div className="flex items-center gap-2 text-xs text-slate-400">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               Docs...
             </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
             <input
              type="text"
              placeholder="Search expenses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-950/50 border border-slate-700/60 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all hover:bg-slate-900"
            />
            <select
               value={categoryFilter}
               onChange={(e) => setCategoryFilter(e.target.value)}
               className="px-3 py-2 rounded-lg bg-slate-950/50 border border-slate-700/60 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all hover:bg-slate-900"
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
        <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
          <div>
            Page {page} of {totalPages || 1}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
               className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
