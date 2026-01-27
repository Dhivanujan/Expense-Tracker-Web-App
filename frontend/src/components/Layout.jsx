import React from 'react';
import { useAuth } from '../state/AuthContext.jsx';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <span className="text-emerald-500 font-bold text-lg">E</span>
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
              ExpenseTracker
            </span>
          </Link>
          
          <div className="flex items-center gap-4 text-sm">
            {user && (
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-slate-200 font-medium">{user.name}</span>
                <span className="text-xs text-slate-500">{user.email}</span>
              </div>
            )}
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all hover:ring-2 hover:ring-slate-700/50"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 animate-fade-in">
        {children}
      </main>
    </div>
  );
};

export default Layout;
