import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flag, Send, AlertTriangle, CheckCircle2 } from 'lucide-react';
import api from '../utils/api';

export default function ReportModal({ isOpen, onClose, chatId }) {
  const [type, setType] = useState('abuse');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/admin/reports/submit', { 
        type, 
        content, 
        chatId 
      });
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setContent('');
      }, 2000);
    } catch (err) {
      alert('Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }} />
          
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} style={{ position: 'relative', width: '100%', maxWidth: 450, background: '#111', border: '1px solid #222', borderRadius: 24, padding: 32, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#444', cursor: 'pointer' }}><X size={20} /></button>
            
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontWeight: 800, marginBottom: 12 }}>Report Received</h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Our safety team will review this conversation shortly. Thank you for helping us keep Clipo safe.</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{ padding: 10, background: 'rgba(248,113,113,0.1)', color: '#f87171', borderRadius: 12 }}><Flag size={20} /></div>
                  <h3 style={{ fontWeight: 800, margin: 0 }}>Report Violation</h3>
                </div>

                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#444', marginBottom: 8, fontWeight: 700 }}>REASON</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                       {['abuse', 'harmful_ai', 'bug', 'other'].map(t => (
                         <button key={t} type="button" onClick={() => setType(t)} style={{ padding: '10px', borderRadius: 10, border: '1px solid', borderColor: type === t ? 'var(--accent-primary)' : '#222', background: type === t ? 'rgba(99,102,241,0.1)' : '#0a0a0a', color: type === t ? 'var(--accent-primary)' : '#666', fontSize: '0.75rem', fontWeight: 700, textTransform: 'capitalize', cursor: 'pointer' }}>
                           {t.replace('_', ' ')}
                         </button>
                       ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#444', marginBottom: 8, fontWeight: 700 }}>DETAILS</label>
                    <textarea required placeholder="Please describe the issue..." value={content} onChange={e => setContent(e.target.value)} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #222', borderRadius: 12, padding: 16, color: '#fff', fontSize: '0.9rem', minHeight: 120, outline: 'none', resize: 'none' }} />
                  </div>

                  <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: 'var(--accent-primary)', color: '#000', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', transition: 'all 0.2s' }}>
                    {loading ? 'Submitting...' : <>Submit Report <Send size={18} /></>}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
