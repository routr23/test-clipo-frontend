import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GoogleAuthButton from '../components/GoogleAuthButton';
import LogoIcon from '../components/LogoIcon';
import api from '../utils/api';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      console.debug('[LoginPage] sending login request', { baseURL: api.defaults.baseURL, email: form.email });
      const { data } = await api.post('/auth/login', form);
      console.debug('[LoginPage] login succeeded', data);
      login(data.user, data.token);
      navigate('/chat');
    } catch (err) {
      console.error('[LoginPage] login error', err);
      setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{ width: '100%', maxWidth: 420 }}
      >
        <div className="auth-logo">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <LogoIcon size={36} />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.3rem', color: 'var(--text-primary)' }}>
              Cli<span style={{ color: 'var(--accent-primary)' }}>po</span>
            </span>
          </Link>
          <h1 style={{ fontSize: '1.3rem', marginTop: 16 }}>Welcome back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Sign in to continue learning</p>
        </div>

        <div className="auth-card">
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 10, padding: '10px 14px', marginBottom: 20
            }}>
              <AlertCircle size={15} color="#f87171" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.875rem', color: '#f87171' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email" className="form-input" style={{ paddingLeft: 38 }}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPass ? 'text' : 'password'} className="form-input" style={{ paddingLeft: 38, paddingRight: 42 }}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  required
                />
                <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem', borderRadius: 10 }}>
              {loading
                ? <div style={{ width: 16, height: 16, border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                : <>Sign In <ArrowRight size={15} /></>}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: 10, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-glass)' }} />
            <span>OR</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-glass)' }} />
          </div>

          <GoogleAuthButton setError={setError} />

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            No account?{' '}
            <Link to="/register" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 500 }}>Create one</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
