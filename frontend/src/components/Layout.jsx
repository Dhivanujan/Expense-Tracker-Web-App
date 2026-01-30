import React from 'react';
import { useAuth } from '../state/AuthContext.jsx';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl shadow-lg shadow-slate-950/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center group-hover:from-emerald-500/30 group-hover:to-cyan-500/30 transition-all duration-300 shadow-lg shadow-emerald-500/10">
              <span className="text-emerald-400 font-bold text-xl">E</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                ExpenseTracker
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase hidden sm:block">Smart Finance</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-3 sm:gap-4">
            {user && (
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900/50 border border-slate-800/50">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 flex items-center justify-center">
                  <span className="text-emerald-400 font-semibold text-sm">{user.name?.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-200 font-medium text-sm">{user.name}</span>
                  <span className="text-xs text-slate-500">{user.email}</span>
                </div>
              </div>
            )}
            <button
              onClick={logout}
              className="group px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-red-500/10 border border-slate-700/50 hover:border-red-500/30 text-slate-300 hover:text-red-400 text-xs font-semibold transition-all duration-300 flex items-center gap-2"
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
      <footer className="border-t border-slate-800/50 py-6 mt-auto bg-slate-950/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>© 2026 ExpenseTracker. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All systems operational
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
