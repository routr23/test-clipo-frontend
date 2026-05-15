import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, MessageSquare, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

/* ── Stats Banner ─────────────────────────────────────── */
function FeedbackStatsBanner() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/feedback/stats').then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  if (!stats || stats.totalFeedback === 0) return null;

  const avg = stats.averageRating;
  const total = stats.totalFeedback;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      style={{
        display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', justifyContent: 'center',
        background: 'var(--bg-glass)', border: '1px solid var(--border-glass)',
        borderRadius: 'var(--radius-xl)', padding: '14px 28px',
        backdropFilter: 'blur(10px)', maxWidth: 520, width: '100%',
        boxShadow: '0 4px 24px rgba(245,158,11,0.08)'
      }}
    >
      {/* Star row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {[1, 2, 3, 4, 5].map(s => {
          const filled = s <= Math.floor(avg);
          const partial = !filled && s === Math.ceil(avg) && avg % 1 >= 0.5;
          return (
            <Star
              key={s}
              size={20}
              fill={filled || partial ? '#f59e0b' : 'none'}
              color={filled || partial ? '#f59e0b' : 'var(--border-accent)'}
              style={{ flexShrink: 0, opacity: partial ? 0.6 : 1 }}
            />
          );
        })}
      </div>

      {/* Avg number */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b', lineHeight: 1 }}>{avg.toFixed(1)}</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ 5</span>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 28, background: 'var(--border-glass)', flexShrink: 0 }} />

      {/* Total reviews */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MessageSquare size={15} color="#f59e0b" />
        </div>
        <div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{total.toLocaleString()}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>Total Reviews</div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main Page ────────────────────────────────────────── */
export default function FeedbackPage() {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return setError('Please select a rating');
    setError('');
    setLoading(true);

    try {
      await api.post('/feedback', { rating, comment });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="glass-card" style={{ maxWidth: 500, width: '100%', textAlign: 'center', padding: '60px 40px' }}
          >
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircle2 size={40} />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 16 }}>Thank You!</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.6 }}>
              Your feedback helps us make Clipo AI the best learning companion for everyone. We appreciate your support!
            </p>
            <button onClick={() => window.location.href = '/chat'} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Back to Learning
            </button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <SEO title="Feedback | Clipo AI" />
      <Navbar />

      <main className="feedback-main" style={{ flex: 1, padding: '120px 24px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Stats Banner */}
        <FeedbackStatsBanner />

        <div className="feedback-grid" style={{ maxWidth: 800, width: '100%', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 60, alignItems: 'center', marginTop: 48 }}>
          
          <motion.div className="feedback-intro" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', marginBottom: 20 }}>
              <Sparkles size={14} style={{ marginRight: 6 }} /> Influence our Roadmap
            </div>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: 24, lineHeight: 1.1 }}>
              Share your <span style={{ background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Thoughts</span>
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              How is your experience with Clipo AI? We value every piece of feedback as we strive to build the ultimate educational AI.
            </p>
          </motion.div>

          <motion.div 
            className="glass-card feedback-form-card"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            style={{ padding: 40, border: '1px solid var(--border-glass)' }}
          >
            {!user && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>Please sign in to leave feedback</p>
                <button onClick={() => window.location.href = '/login'} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Sign In</button>
              </div>
            )}

            {user && (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 32 }}>
                  <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 12 }}>Rate your experience</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s} type="button"
                        onClick={() => setRating(s)}
                        onMouseEnter={() => setHover(s)}
                        onMouseLeave={() => setHover(0)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'transform 0.2s' }}
                        className={rating >= s || hover >= s ? 'star-active' : ''}
                      >
                        <Star 
                          size={32} 
                          fill={rating >= s || hover >= s ? 'var(--accent-primary)' : 'none'} 
                          color={rating >= s || hover >= s ? 'var(--accent-primary)' : 'var(--border-accent)'} 
                          style={{ transition: 'all 0.2s' }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 32 }}>
                  <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 12 }}>What can we improve?</label>
                  <div style={{ position: 'relative' }}>
                    <MessageSquare size={18} style={{ position: 'absolute', left: 16, top: 16, color: 'var(--text-muted)' }} />
                    <textarea 
                      required rows={5} placeholder="Tell us how we're doing..." 
                      value={comment} onChange={e => setComment(e.target.value)}
                      style={{ width: '100%', padding: '16px 16px 16px 48px', background: 'var(--bg-input)', border: '1px solid var(--border-glass)', borderRadius: 16, color: 'var(--text-primary)', outline: 'none', transition: 'all 0.2s', fontSize: '0.95rem', resize: 'none' }}
                    />
                  </div>
                </div>

                {error && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 24 }}>
                    <AlertCircle size={16} color="#f87171" />
                    <span style={{ fontSize: '0.85rem', color: '#f87171' }}>{error}</span>
                  </div>
                )}

                <button 
                  type="submit" disabled={loading}
                  style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: 'var(--gradient-brand)', color: 'white', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.2s', boxShadow: '0 10px 20px rgba(99,102,241,0.2)' }}
                >
                  {loading ? 'Sending...' : <>Submit Feedback <Send size={18} /></>}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
      <style dangerouslySetInnerHTML={{ __html: `
        .star-active { transform: scale(1.1); }
      `}} />
    </div>
  );
}
