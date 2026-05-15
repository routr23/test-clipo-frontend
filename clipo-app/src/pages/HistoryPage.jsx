import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, BookOpen, Trash2, MessageSquare, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api';

const SUBJECT_COLORS = {
  Mathematics:'#6366f1', Physics:'#4f8ef7', Chemistry:'#14b8a6', Biology:'#22c55e',
  'Computer Science':'#f59e0b', History:'#ec4899', Literature:'#a78bfa', Economics:'#fb923c', Geography:'#38bdf8', General:'#94a3b8', Coding:'#f59e0b'
};

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 2) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  return `${days}d ago`;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } }
};
const itemVariants = {
  hidden: { opacity:0, y:20 },
  visible: { opacity:1, y:0, transition: { duration:0.4 } }
};

export default function HistoryPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [fetchingMore, setFetchingMore] = useState(false);

  useEffect(() => { 
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      loadSessions(1, search, true);
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const loadSessions = async (pageToLoad = 1, searchQuery = search, reset = false) => {
    if (reset || pageToLoad === 1) setLoading(true);
    if (pageToLoad > 1) setFetchingMore(true);
    try {
      const { data } = await api.get(`/chat/sessions?page=${pageToLoad}&limit=20&search=${encodeURIComponent(searchQuery)}`);
      const list = data.sessions || [];
      if (reset) {
        setSessions(list);
      } else {
        setSessions(prev => {
          const newMap = new Map();
          prev.forEach(s => newMap.set(s._id, s));
          list.forEach(s => newMap.set(s._id, s));
          return Array.from(newMap.values()).sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
        });
      }
      setHasMore(data.pagination ? data.pagination.hasMore : false);
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
      setFetchingMore(false);
    }
  };

  const deleteSession = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/chat/sessions/${id}`);
      setSessions(prev => prev.filter(s => s._id !== id));
    } catch (e) { console.error(e); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Navbar />

      {/* Bg gradient */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', width: 500, height: 500, top: '-5%', right: '-5%', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)' }} />
      </div>

      <main className="history-main" style={{ flex: 1, position: 'relative', zIndex: 1, width: '100%', maxWidth: 960, margin: '0 auto', padding: '120px 24px 48px' }}>
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }} style={{ marginBottom:36 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:42, height:42, borderRadius:12, background:'var(--gradient-brand)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <MessageSquare size={20} color="white" />
              </div>
              <div>
                <h1 style={{ fontFamily:'var(--font-heading)', fontWeight:800, fontSize:'2rem' }}>Learning History</h1>
                <p style={{ color:'var(--text-muted)', fontSize:'0.875rem' }}>
                  Manage your saved sessions
                </p>
              </div>
            </div>
            {/* Search Bar */}
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-input)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-xl)', padding: '6px 16px', flex: '1 1 300px', maxWidth: 400 }}>
              <Search size={16} color="var(--text-muted)" style={{ marginRight: 10 }} />
              <input 
                type="text" 
                placeholder="Search history..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', width: '100%', fontSize: '0.9rem' }}
              />
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="history-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 16 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-glass)',
                borderRadius: 16,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}>
                {/* Subject chip row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="skeleton" style={{ width: 28, height: 28, borderRadius: 8 }} />
                    <div className="skeleton" style={{ width: 72, height: 22, borderRadius: 20 }} />
                  </div>
                  <div className="skeleton" style={{ width: 24, height: 24, borderRadius: 8 }} />
                </div>
                {/* Title lines */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div className="skeleton" style={{ width: '90%', height: 14, borderRadius: 6 }} />
                  <div className="skeleton" style={{ width: '65%', height: 14, borderRadius: 6 }} />
                </div>
                {/* Footer row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                  <div className="skeleton" style={{ width: 80, height: 12, borderRadius: 6 }} />
                  <div className="skeleton" style={{ width: 60, height: 12, borderRadius: 6 }} />
                </div>
              </div>
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ textAlign:'center', padding:'80px 24px', color:'var(--text-muted)' }}>
            <div style={{ width:80, height:80, borderRadius:24, background:'rgba(99,102,241,0.1)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
              <Sparkles size={36} color="var(--accent-primary)" />
            </div>
            <h3 style={{ fontFamily:'var(--font-heading)', fontWeight:600, fontSize:'1.3rem', color:'var(--text-secondary)', marginBottom:10 }}>No chats yet</h3>
            <p style={{ marginBottom:24, maxWidth:320, margin:'0 auto 24px', lineHeight:1.6 }}>
              Start a conversation with your AI tutor and your history will appear here.
            </p>
            <button onClick={() => navigate('/chat')} className="btn btn-primary" style={{ margin:'0 auto' }}>
              Start Learning <ArrowRight size={16} />
            </button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants} initial="hidden" animate="visible"
            className="history-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 16 }}
          >
            {sessions.map(session => {
              const color = SUBJECT_COLORS[session.subject] || 'var(--accent-primary)';
              return (
                <motion.div key={session._id} variants={itemVariants}>
                  <div
                    onClick={() => navigate(`/chat?session=${session._id}`)}
                    style={{
                      background:'var(--bg-glass)', border:'1px solid var(--border-glass)',
                      borderRadius:'var(--radius-lg)', padding:20, cursor:'pointer',
                      backdropFilter:'blur(10px)', transition:'all 0.25s', position:'relative', overflow:'hidden'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.borderColor = color + '44';
                      e.currentTarget.style.boxShadow = `0 12px 32px ${color}18`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.borderColor = 'var(--border-glass)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Subject chip */}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ width:28, height:28, borderRadius:8, background:`${color}22`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                          <BookOpen size={14} color={color} />
                        </div>
                        <span style={{ fontSize:'0.75rem', fontWeight:600, color, background:`${color}18`, padding:'3px 10px', borderRadius:20 }}>
                          {session.subject}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="history-delete-btn"
                        onClick={e => deleteSession(session._id, e)}
                        aria-label="Delete chat"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 8, color: 'var(--text-muted)', transition: 'color 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <h3 style={{ fontSize:'0.9rem', fontWeight:500, color:'var(--text-primary)', lineHeight:1.4, marginBottom:10, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
                      {session.title}
                    </h3>

                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:'0.75rem', color:'var(--text-muted)' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                        <MessageSquare size={12} />
                        {session.messageCount || 0} messages
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                        <Calendar size={12} />
                        {timeAgo(session.updatedAt)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Load More Button / Skeleton rows */}
        {fetchingMore && (
          <div className="history-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 16, marginTop: 16 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-glass)',
                borderRadius: 16,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="skeleton" style={{ width: 28, height: 28, borderRadius: 8 }} />
                    <div className="skeleton" style={{ width: 72, height: 22, borderRadius: 20 }} />
                  </div>
                  <div className="skeleton" style={{ width: 24, height: 24, borderRadius: 8 }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div className="skeleton" style={{ width: '90%', height: 14, borderRadius: 6 }} />
                  <div className="skeleton" style={{ width: '65%', height: 14, borderRadius: 6 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                  <div className="skeleton" style={{ width: 80, height: 12, borderRadius: 6 }} />
                  <div className="skeleton" style={{ width: 60, height: 12, borderRadius: 6 }} />
                </div>
              </div>
            ))}
          </div>
        )}
        {hasMore && !loading && !fetchingMore && sessions.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button 
              className="btn btn-ghost" 
              onClick={() => {
                const nextPage = page + 1;
                setPage(nextPage);
                loadSessions(nextPage, search, false);
              }}
            >
              Load More
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
