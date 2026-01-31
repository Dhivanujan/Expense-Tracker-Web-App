import React from 'react';
import { useAuth } from '../state/AuthContext.jsx';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/70 backdrop-blur-2xl shadow-xl shadow-slate-950/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center group-hover:from-emerald-500/30 group-hover:to-cyan-500/30 transition-all duration-300 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/20 group-hover:ring-emerald-500/40">
              <span className="text-emerald-400 font-bold text-xl group-hover:scale-110 transition-transform">E</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-slate-200 transition-all">
                ExpenseTracker
              </span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase hidden sm:block">Smart Finance</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-3 sm:gap-4">
            {user && (
              <div className="hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 backdrop-blur-sm">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 flex items-center justify-center ring-2 ring-emerald-500/20">
                  <span className="text-emerald-400 font-bold text-sm">{user.name?.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-200 font-semibold text-sm">{user.name}</span>
                  <span className="text-[11px] text-slate-500">{user.email}</span>
                </div>
              </div>
            )}
            <button
              onClick={logout}
              className="group px-4 py-2.5 rounded-xl bg-slate-800/60 hover:bg-red-500/10 border border-slate-700/50 hover:border-red-500/30 text-slate-300 hover:text-red-400 text-xs font-semibold transition-all duration-300 flex items-center gap-2 active:scale-[0.98]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {children}
      </main>
      <footer className="border-t border-slate-800/50 py-6 mt-auto bg-slate-950/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span className="font-medium">© 2026 ExpenseTracker. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-slate-800/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-400">All systems operational</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
