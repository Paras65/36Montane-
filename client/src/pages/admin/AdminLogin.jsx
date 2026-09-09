import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AdminLogin = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed. Please check credentials.');
      }

      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIdentifier('admin');
    setPassword('admin123');
    setIsLoading(true);
    setError('');

    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'admin123' }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1D15] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Decorative Ambient Rings */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#C84B31]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#1B4332]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#11261D]/90 backdrop-blur border border-[#D4A373]/30 rounded-3xl shadow-2xl p-8 sm:p-10 z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FAF6F0] p-2 border border-[#D4A373] shadow-md mb-4">
            <img src="/icons/icon.svg" alt="36 Montane" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold font-serif text-[#FAF6F0] tracking-tight">36 Montane Admin</h1>
          <p className="text-xs text-[#D8CFBC] mt-1">Dandakaranya Expedition Management Portal</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#D8CFBC] mb-1.5">
              Username or Email
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. admin or admin@36montane.com"
              required
              className="w-full px-4 py-3 bg-[#0B1D15] border border-[#1B4332] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#C84B31] focus:ring-1 focus:ring-[#C84B31] text-sm transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#D8CFBC] mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 bg-[#0B1D15] border border-[#1B4332] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#C84B31] focus:ring-1 focus:ring-[#C84B31] text-sm transition"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-[#C84B31] hover:bg-[#9E321C] text-white font-bold rounded-xl shadow-lg transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2 text-sm mt-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Sign In to Trail Dashboard'
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#1B4332]">
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-[#1B4332]/60 hover:bg-[#1B4332] text-[#E9C46A] text-xs font-bold rounded-xl border border-[#D4A373]/30 transition flex items-center justify-center gap-2"
          >
            <span>⚡</span>
            <span>1-Click Demo Login (admin / admin123)</span>
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-xs text-[#D8CFBC] hover:text-[#E9C46A] transition inline-flex items-center gap-1.5"
          >
            <span>←</span>
            <span>Back to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

