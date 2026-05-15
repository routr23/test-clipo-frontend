import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import SEO from '../components/SEO';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/admin/login', { email, password });
      if (data.user.role !== 'admin') { setError('Access denied. Admin privileges required.'); setLoading(false); return; }
      login(data.user, data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <SEO title="Admin Login | Clipo AI" description="Access the Clipo AI administrative panel." />
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        style={{ width: '100%', maxWidth: 420 }}
      >
        <div className="auth-logo">
          <div style={{ width: 52, height: 52, borderRadius: 14, background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={26} color="white" />
          </div>
          <h1 style={{ fontSize: '1.3rem', marginTop: 14 }}>Admin Login</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Secure access to Clipo AI dashboard</p>
        </div>

        <div className="auth-card">
          {error && (
            <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, color: '#f87171', fontSize: '0.875rem', marginBottom: 18, textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="email" required placeholder="Admin Email" value={email} onChange={e => setEmail(e.target.value)}
                className="form-input" style={{ paddingLeft: 38 }} />
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="password" required placeholder="Security Key" value={password} onChange={e => setPassword(e.target.value)}
                className="form-input" style={{ paddingLeft: 38 }} />
            </div>
            <button type="submit" disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem', borderRadius: 10, marginTop: 4, background: '#ef4444' }}>
              {loading ? 'Verifying...' : <>Enter Dashboard <ArrowRight size={15} /></>}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>
              ← Back to site
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
