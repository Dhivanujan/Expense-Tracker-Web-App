import React from 'react';
import { useAuth } from '../state/AuthContext.jsx';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="font-semibold tracking-tight">Expense Tracker</span>
          <div className="flex items-center gap-3 text-sm">
            {user && <span className="text-slate-300">Hi, {user.name}</span>}
            <button
              onClick={logout}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">{children}</main>
    </div>
  );
};

export default Layout;
