import React from 'react';
import { useAuth } from '../state/AuthContext.jsx';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-950/75 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-400/25 to-cyan-400/20 border border-teal-300/25 flex items-center justify-center">
              <span className="font-display text-xl font-bold text-teal-300">E</span>
            </div>
            <div>
              <p className="font-display text-lg font-bold gradient-text leading-tight">ExpenseTracker</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Finance Control Center</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-2.5 rounded-xl border border-slate-700/60 bg-slate-900/70 px-3 py-2">
                <div className="w-8 h-8 rounded-lg bg-teal-400/15 border border-teal-300/30 flex items-center justify-center text-teal-300 text-xs font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-slate-100">{user.name}</p>
                  <p className="text-[11px] text-slate-400">{user.email}</p>
                </div>
              </div>
            )}

            <button
              onClick={logout}
              className="btn-secondary text-xs font-semibold inline-flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {children}
      </main>

      <footer className="border-t border-slate-700/50 py-5 mt-auto bg-slate-950/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>© 2026 ExpenseTracker. All rights reserved.</span>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 px-3 py-1 bg-slate-900/60 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
            Platform healthy
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
