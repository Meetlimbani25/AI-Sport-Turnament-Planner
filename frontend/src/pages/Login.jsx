import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Trophy, Sparkles, CalendarDays, BookOpen, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../services/api';
import { Button, inp } from '../components/ui';

export default function Login() {
  const { user, login, register } = useAuth();
  console.log('[DEBUG] Login component rendering, user is:', user);
  const [reg, setReg] = useState(false);
  const [f, setF] = useState({ name: '', email: 'demo@planner.com', password: 'demo1234' });
  const [err, setErr] = useState();
  const [busy, setBusy] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr();
    try {
      await (reg ? register(f) : login(f));
    } catch (x) {
      setErr(errMsg(x));
    }
    setBusy(false);
  };

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const fillDemo = () => {
    setReg(false);
    setF({ name: '', email: 'demo@planner.com', password: 'demo1234' });
    setErr();
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand Side Panel */}
      <div className="hidden flex-col justify-between bg-gradient-to-br from-indigo-600 to-indigo-800 p-12 text-white lg:flex">
        <div className="flex items-center gap-3 text-lg font-bold tracking-tight">
          <div className="rounded-lg bg-white/10 p-2 backdrop-blur-sm">
            <Trophy className="text-white" size={24} />
          </div>
          AI Sports Tournament Planner
        </div>

        <div>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Plan Smarter.<br />Play Better.
          </h1>
          <p className="mt-4 max-w-md text-base text-indigo-100">
            Automate fixtures, generate balanced schedules, ground assignments, and manage tournaments effortlessly.
          </p>
          <ul className="mt-8 space-y-4 text-indigo-50">
            {[
              [Sparkles, 'AI-generated tournament plans & brackets'],
              [CalendarDays, 'Conflict-free fixtures and venue scheduling'],
              [BookOpen, 'RAG-powered custom rulebook knowledge base']
            ].map(([Icon, text]) => (
              <li key={text} className="flex items-center gap-3 text-sm font-medium">
                <div className="rounded-md bg-white/10 p-1.5">
                  <Icon size={18} />
                </div>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-200">Default Demo Credentials</p>
          <p className="mt-1 text-sm font-medium text-white">Email: <span className="font-mono text-indigo-200">demo@planner.com</span></p>
          <p className="text-sm font-medium text-white">Password: <span className="font-mono text-indigo-200">demo1234</span></p>
        </div>
      </div>

      {/* Auth Form Container */}
      <div className="flex items-center justify-center p-6 bg-slate-50 sm:p-12">
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 lg:hidden mb-4">
              <Trophy size={22} />
              <span className="font-bold text-slate-800">AI Sports Tournament</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {reg ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-sm text-slate-500">
              {reg ? 'Start planning your tournaments in minutes.' : 'Sign in to access your tournaments and fixtures.'}
            </p>
          </div>

          {err && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {err}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {reg && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  className={inp}
                  placeholder="e.g. Alex Morgan"
                  required
                  value={f.name}
                  onChange={set('name')}
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
              <input
                className={inp}
                type="email"
                placeholder="name@company.com"
                required
                value={f.email}
                onChange={set('email')}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
              <input
                className={inp}
                type="password"
                placeholder="••••••••"
                required
                value={f.password}
                onChange={set('password')}
              />
            </div>

            <Button className="w-full py-2.5 text-base font-semibold" disabled={busy}>
              {busy ? 'Please wait...' : reg ? 'Create Account' : 'Sign In'}
            </Button>

            {!reg && (
              <button
                type="button"
                onClick={fillDemo}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50/50 py-2 text-xs font-medium text-indigo-700 hover:bg-indigo-100/70 transition"
              >
                <KeyRound size={14} />
                Auto-fill Demo Credentials
              </button>
            )}
          </form>

          <div className="pt-2 text-center text-sm text-slate-500 border-t border-slate-100">
            {reg ? 'Already have an account?' : 'Need an account?'}{' '}
            <button
              type="button"
              className="font-semibold text-indigo-600 hover:text-indigo-700 transition"
              onClick={() => {
                setReg(!reg);
                setErr();
              }}
            >
              {reg ? 'Sign in' : 'Create an account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
