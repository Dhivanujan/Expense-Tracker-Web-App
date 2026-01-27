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

  const monthLabel = useMemo(() => month, [month]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [expensesRes, summaryRes] = await Promise.all([
        api.get('/expenses', { params: { month } }),
        api.get('/expenses/summary', { params: { month } }),
      ]);
      setExpenses(expensesRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [month]);

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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-slate-400">Track your monthly spending and categories.</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={handleDownloadPdf}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium"
          >
            Download PDF
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-400 bg-red-950/50 border border-red-500/40 rounded px-3 py-2">
          {error}
        </div>
      )}

      <SummaryCards totalAmount={summary.totalAmount || 0} monthLabel={monthLabel} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-sm font-semibold mb-3">
            {selectedExpense ? 'Edit expense' : 'Add new expense'}
          </h2>
          <ExpenseForm
            onSubmit={handleCreateOrUpdate}
            initialData={selectedExpense}
            loading={formLoading}
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-sm font-semibold mb-3">By category</h2>
          <CategoryChart data={summary.byCategory || []} />
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold">Expenses list</h2>
          {loading && <span className="text-xs text-slate-400">Loading...</span>}
        </div>
        <ExpenseList
          expenses={expenses}
          onEdit={(exp) => setSelectedExpense(exp)}
          onDelete={handleDelete}
        />
      </div>
    </Layout>
  );
};

export default DashboardPage;
