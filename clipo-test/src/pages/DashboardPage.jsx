import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Mail, Calendar, MessageSquare, Clock,
  ChevronRight, Sparkles, History, LogOut, LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';
import Footer from '../components/Footer';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalSessions: 0, totalMessages: 0 });
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [sessionsRes, statsRes] = await Promise.all([
          api.get('/chat/sessions?limit=5'),
          api.get('/chat/sessions/stats')
        ]);

        setRecentSessions(sessionsRes.data.sessions || []);

        setStats({
          totalSessions: statsRes.data.totalSessions,
          totalMessages: statsRes.data.totalMessages
        });
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const joinedDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    day: 'numeric'
  }) : 'March 2024';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', position: 'relative', overflowX: 'hidden' }}>
      <SEO title="User Dashboard | Clipo AI" description="Manage your Clipo AI account and view your chat history." />

      {/* Background Pattern */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'url(/clipo-bg.png)',
        backgroundSize: '400px',
        opacity: 0.03,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <Navbar />

      <main className="dashboard-main" style={{ maxWidth: 1200, margin: '0 auto', padding: '120px 24px 80px', position: 'relative', zIndex: 1 }}>
        <header className="dashboard-header" style={{ marginBottom: 40 }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: 8 }}
          >
            Welcome back, <span style={{ color: 'var(--accent-primary)' }}>{user?.name?.split(' ')[0]}</span>!
          </motion.h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Here's an overview of your Clipo AI activity.</p>
        </header>

        <div className="dashboard-top-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 40 }}>
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: 24, padding: 32, backdropFilter: 'blur(10px)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%', background: 'var(--accent-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.3rem', fontWeight: 700, color: '#000', flexShrink: 0,
                overflow: 'hidden'
              }}>
                {user?.avatar ? (
                  <img src={user.avatar} alt="PFP" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user?.name?.[0]?.toUpperCase()
                )}
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: 4 }}>{user?.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <Mail size={14} /> {user?.email}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: 12 }}>
                <Calendar size={18} color="var(--accent-primary)" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Member Since</div>
                  <div style={{ fontWeight: 600 }}>{joinedDate}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{ width: '100%', padding: '14px', borderRadius: 12, border: '1px solid rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.05)', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 600, transition: 'all 0.2s' }}
              >
                <LogOut size={18} /> Logout Session
              </button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="dashboard-stats-stack" style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 24 }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              style={{ background: '#2a2a2a', border: '1px solid var(--border-glass)', borderRadius: 16, padding: 24 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', marginBottom: 8 }}>
                <MessageSquare size={16} color="var(--accent-primary)" />
                <span style={{ fontSize: '0.875rem' }}>Total Chats</span>
              </div>
              <div style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>{loading ? '—' : stats.totalSessions}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: 24, padding: 32, backdropFilter: 'blur(10px)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', marginBottom: 8 }}>
                <Sparkles size={18} />
                <span>Messages Exchanged</span>
              </div>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)' }}>{loading ? '...' : stats.totalMessages}</div>
            </motion.div>
          </div>
        </div>

        <div className="dashboard-split-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 40, alignItems: 'start' }}>
          {/* Recent Activity */}
          <section>
            <h3 style={{ fontSize: '1.4rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <History size={20} color="var(--accent-primary)" /> Recent Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} style={{ height: 80, background: 'rgba(255,255,255,0.02)', borderRadius: 16, animation: 'pulse 1.5s infinite' }} />
                ))
              ) : recentSessions.length > 0 ? (
                recentSessions.map((session, i) => (
                  <Link
                    key={session._id}
                    to={`/chat?session=${session._id}`}
                    style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: 16, transition: 'all 0.2s', cursor: 'pointer' }}
                    className="dashboard-item-hover"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MessageSquare size={18} color="var(--accent-primary)" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: 2 }}>{session.title || 'Untitled Session'}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Clock size={12} /> {new Date(session.updatedAt).toLocaleDateString()} · {session.messageCount} messages
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={18} color="var(--text-muted)" />
                  </Link>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  No sessions yet. Start your first chat!
                </div>
              )}
            </div>
            {recentSessions.length > 0 && (
              <Link to="/history" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 16, color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
                View Full History <ChevronRight size={16} />
              </Link>
            )}
          </section>

          {/* Quick Actions */}
          <aside>
            <h3 style={{ fontSize: '1.4rem', marginBottom: 20 }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Link to="/chat" style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '14px 18px', borderRadius: 12, background: 'var(--accent-primary)', color: '#000',
                  display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: '0.9rem'
                }}>
                  <Sparkles size={16} /> Start New Chat
                </div>
              </Link>
              <Link to="/docs" style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '18px', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)',
                  color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 12, fontWeight: 600
                }}>
                  <LayoutDashboard size={18} color="var(--accent-primary)" /> Documentation
                </div>
              </Link>
              <Link to="/about" style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '18px', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)',
                  color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 12, fontWeight: 600
                }}>
                  <User size={18} color="var(--accent-primary)" /> About Clipo
                </div>
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        .dashboard-item-hover:hover {
          border-color: rgba(255,255,255,0.2) !important;
          background: #333 !important;
        }
      `}} />
      <Footer />
    </div>
  );
}
