import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GoogleAuthButton from '../components/GoogleAuthButton';
import LogoIcon from '../components/LogoIcon';
import api from '../utils/api';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!acceptedTerms) { setError('Please accept the Terms & Privacy Policy'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data.user, data.token);
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  const fieldStyle = { paddingLeft: 38 };
  const iconStyle = (left = 13) => ({ position: 'absolute', left, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' });

  return (
    <div className="auth-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
        style={{ width: '100%', maxWidth: 420 }}
      >
        <div className="auth-logo">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <LogoIcon size={36} />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.3rem', color: 'var(--text-primary)' }}>
              Cli<span style={{ color: 'var(--accent-primary)' }}>po</span>
            </span>
          </Link>
          <h1 style={{ fontSize: '1.3rem', marginTop: 16 }}>Create your account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Start learning with your personal AI tutor</p>
        </div>

        <div className="auth-card">
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 18 }}>
              <AlertCircle size={15} color="#f87171" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.875rem', color: '#f87171' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={iconStyle()} />
                <input type="text" className="form-input" style={fieldStyle} placeholder="John Doe"
                  value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required minLength={2} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={iconStyle()} />
                <input type="email" className="form-input" style={fieldStyle} placeholder="you@example.com"
                  value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(min 6 chars)</span></label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={iconStyle()} />
                <input type={showPass ? 'text' : 'password'} className="form-input" style={{ ...fieldStyle, paddingRight: 42 }}
                  placeholder="••••••••" value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required minLength={6} />
                <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 4 }}>
              <input 
                type="checkbox" 
                id="terms" 
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                style={{ marginTop: 3, cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
              />
              <label htmlFor="terms" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, cursor: 'pointer' }}>
                I agree to the <Link to="/terms" target="_blank" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Terms</Link> and <Link to="/privacy" target="_blank" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Privacy Policy</Link>
              </label>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem', borderRadius: 10, marginTop: 4 }}>
              {loading
                ? <div style={{ width: 16, height: 16, border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                : <>Create Account <ArrowRight size={15} /></>}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', margin: '18px 0', gap: 10, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-glass)' }} />
            <span>OR</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-glass)' }} />
          </div>

          <GoogleAuthButton setError={setError} />

          <p style={{ textAlign: 'center', marginTop: 10, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            By continuing with Google, you agree to our <Link to="/terms" target="_blank" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Terms</Link> and <Link to="/privacy" target="_blank" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Privacy Policy</Link>.
          </p>

          <p style={{ textAlign: 'center', marginTop: 18, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 500 }}>Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
