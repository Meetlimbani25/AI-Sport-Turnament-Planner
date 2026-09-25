import { createContext, useContext, useState } from 'react';
import api from '../services/api';

const Ctx = createContext();
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (!stored || !token || stored === 'undefined' || stored === 'null') {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return null;
      }
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object' && parsed.id && parsed.name) {
        return parsed;
      }
      // Stored user is invalid or missing name/id, clean it up
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
  });

  const done = ({ data }) => {
    if (data?.token) localStorage.setItem('token', data.token);
    if (data?.user) localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user || null);
  };

  const login = async (b) => done(await api.post('/auth/login', b));
  const register = async (b) => done(await api.post('/auth/register', b));
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ user, login, register, logout }}>
      {children}
    </Ctx.Provider>
  );
}
