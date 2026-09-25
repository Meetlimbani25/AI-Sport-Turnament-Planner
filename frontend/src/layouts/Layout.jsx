import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Trophy, Users, UserRound, CalendarDays, Sparkles, BookOpen, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cx } from '../components/ui';

const nav = [
  ['/', 'Dashboard', LayoutDashboard],
  ['/tournaments', 'Tournaments', Trophy],
  ['/teams', 'Teams', Users],
  ['/players', 'Players', UserRound],
  ['/fixtures', 'Fixtures', CalendarDays],
  ['/ai', 'AI Studio', Sparkles],
  ['/knowledge', 'Knowledge Base', BookOpen]
];

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const title = nav.find(n => n[0] === pathname)?.[1] || '';
  const initial = (user?.name?.[0] || user?.email?.[0] || 'U').toUpperCase();
  const displayName = user?.name || user?.email || 'User';

  return (
    <div className="min-h-screen bg-slate-50">
      {open && <div className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={cx('fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:translate-x-0', open ? 'translate-x-0' : '-translate-x-full')}>
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="rounded-lg bg-indigo-600 p-2 text-white">
            <Trophy size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight text-slate-800">AI Sports Tournament</p>
            <p className="text-xs text-slate-500">Plan Smarter. Play Better.</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {nav.map(([to, l, Icon]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cx(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
                  isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                )
              }
            >
              <Icon size={18} />
              {l}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-8">
          <button aria-label="Menu" className="lg:hidden text-slate-700" onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>
          <h1 className="flex-1 text-lg font-semibold text-slate-800">{title}</h1>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white shadow-sm">
            {initial}
          </div>
          <span className="hidden text-sm font-medium text-slate-700 sm:block">{displayName}</span>
          <button
            aria-label="Log out"
            onClick={logout}
            title="Log out"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <LogOut size={18} />
          </button>
        </header>
        <main className="mx-auto max-w-7xl p-4 sm:p-8">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
