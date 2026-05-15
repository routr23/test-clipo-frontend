import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, MessageSquare, Database, Activity, ShieldCheck, 
  ArrowUpRight, RefreshCcw, Mail, Search, Trash2, Edit2, Check, X, Star, Plus, UserPlus, Bell, MousePointer2
} from 'lucide-react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [creating, setCreating] = useState(false);
  const [notifConfig, setNotifConfig] = useState({ notificationText: '', isNotificationActive: false, notificationTargetUrl: '' });
  const [updatingNotif, setUpdatingNotif] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const statsRes = await api.get('/admin/stats');
      const usersRes = await api.get('/admin/users');
      const feedbackRes = await api.get('/feedback');
      const configRes = await api.get('/admin/config');
      setData(statsRes.data);
      setUsers(usersRes.data.users);
      setFeedback(feedbackRes.data.feedbackList);
      setNotifConfig({
        notificationText: configRes.data.config.notificationText || '',
        isNotificationActive: configRes.data.config.isNotificationActive || false,
        notificationTargetUrl: configRes.data.config.notificationTargetUrl || ''
      });
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? All their chat sessions will be permanently removed.')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const startEdit = (user) => {
    setEditingId(user._id);
    setEditForm({ name: user.name, email: user.email });
  };

  const handleUpdateUser = async (userId) => {
    try {
      const { data: updatedData } = await api.patch(`/admin/users/${userId}`, editForm);
      setUsers(users.map(u => u._id === userId ? updatedData.user : u));
      setEditingId(null);
    } catch (err) {
      alert('Failed to update user');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const { data: createdData } = await api.post('/admin/users', newUserForm);
      setUsers([createdData.user, ...users]);
      setShowCreateModal(false);
      setNewUserForm({ name: '', email: '', password: '', role: 'user' });
      alert('User created successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm('Delete this feedback entry? This cannot be undone.')) return;
    try {
      await api.delete(`/feedback/${feedbackId}`);
      setFeedback(prev => prev.filter(f => f._id !== feedbackId));
    } catch (err) {
      alert('Failed to delete feedback');
    }
  };

  const handleUpdateNotification = async () => {
    setUpdatingNotif(true);
    try {
      await api.patch('/admin/config', notifConfig);
      alert('Global notification updated successfully');
    } catch (err) {
      alert('Failed to update notification');
    } finally {
      setUpdatingNotif(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <SEO title="Admin Dashboard | Clipo AI" />
      <Navbar />

      <main className="admin-main" style={{ maxWidth: 1400, margin: '0 auto', padding: '120px 24px 80px' }}>
        <header className="admin-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', display: 'flex', alignItems: 'center', gap: 12 }}>
              <ShieldCheck color="var(--accent-primary)" size={32} /> Admin Control Center
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage platform users and view site-wide analytics.</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button 
              onClick={() => setShowCreateModal(true)}
              style={{ padding: '10px 20px', borderRadius: 12, border: 'none', background: 'var(--accent-primary)', color: 'var(--bg-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}
            >
              <UserPlus size={16} /> Create User
            </button>
            <button 
              className="admin-refresh-btn"
              onClick={fetchAdminData}
              style={{ padding: '10px 20px', borderRadius: 12, border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.03)', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}
            >
              <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} /> Refresh Data
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="admin-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 48 }}>
          <StatCard icon={<Users />} title="Total Users" value={data?.stats?.totalUsers} color="#6366f1" />
          <StatCard icon={<Database />} title="Chat Sessions" value={data?.stats?.totalSessions} color="#10b981" />
          <StatCard icon={<MessageSquare />} title="Total Messages" value={data?.stats?.totalMessages} color="#f59e0b" />
          <StatCard icon={<Activity />} title="System Status" value="Healthy" color="#06b6d4" />
        </div>

        {/* Notification Controller */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ 
            background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', 
            borderRadius: 24, padding: 32, marginBottom: 48, backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ padding: 10, borderRadius: 12, background: 'rgba(99,102,241,0.1)', color: '#818cf8' }}>
              <Bell size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Global Broadcast Center</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Send a top-level alert to all users instantly.</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: 300 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>Notification Message</label>
              <input 
                value={notifConfig.notificationText}
                onChange={e => setNotifConfig(p => ({ ...p, notificationText: e.target.value }))}
                placeholder="e.g. System update scheduled for 2 PM..."
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', color: 'white' }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 300 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>Target Link (Optional)</label>
              <input 
                value={notifConfig.notificationTargetUrl}
                onChange={e => setNotifConfig(p => ({ ...p, notificationTargetUrl: e.target.value }))}
                placeholder="e.g. https://google.com"
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', color: 'white' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
               <label style={{ fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                 <input 
                  type="checkbox" 
                  checked={notifConfig.isNotificationActive}
                  onChange={e => setNotifConfig(p => ({ ...p, isNotificationActive: e.target.checked }))}
                  style={{ width: 18, height: 18, accentColor: 'var(--accent-primary)' }}
                 />
                 <span>Active Broadcast</span>
               </label>
            </div>
            <button 
              onClick={handleUpdateNotification}
              disabled={updatingNotif}
              style={{ 
                padding: '12px 24px', borderRadius: 12, border: 'none', 
                background: 'var(--accent-primary)', color: 'var(--bg-primary)', 
                fontWeight: 700, cursor: updatingNotif ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 8
              }}
            >
              {updatingNotif ? 'Pushing...' : <><MousePointer2 size={16} /> Push to All Users</>}
            </button>
          </div>
        </motion.section>

        <div className="admin-split-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 32, alignItems: 'start' }}>
          {/* User Management */}
          <section className="admin-panel" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: 24, padding: 32 }}>
            <div className="admin-panel-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>User Management</h3>
              <div className="admin-search-wrap" style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  className="admin-search-input"
                  placeholder="Search users..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  style={{ padding: '8px 12px 8px 36px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', borderRadius: 10, color: 'white', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div className="admin-users-table-wrap" style={{ overflowX: 'auto' }}>
              <table className="admin-users-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <th style={{ padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem' }}>PFP</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem' }}>User</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem' }}>Email</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem' }}>Role</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="admin-user-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '16px 8px' }}>
                        <div style={{ 
                          width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-primary)', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', 
                          fontSize: '0.75rem', fontWeight: 700, color: 'var(--bg-primary)', overflow: 'hidden'
                        }}>
                          {user.avatar ? (
                            <img src={user.avatar} alt="PFP" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            user.name[0].toUpperCase()
                          )}
                        </div>
                      </td>
                      <td data-label="User" className="admin-user-cell" style={{ padding: '16px 8px' }}>
                        {editingId === user._id ? (
                          <input 
                            value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--accent-primary)', borderRadius: 6, color: 'white', padding: '4px 8px', width: '100%' }}
                          />
                        ) : (
                          <span style={{ fontWeight: 600 }}>{user.name}</span>
                        )}
                      </td>
                      <td data-label="Email" className="admin-user-cell" style={{ padding: '16px 8px' }}>
                        {editingId === user._id ? (
                           <input 
                             value={editForm.email} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))}
                             style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--accent-primary)', borderRadius: 6, color: 'white', padding: '4px 8px', width: '100%' }}
                           />
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user.email}</span>
                        )}
                      </td>
                      <td data-label="Role" className="admin-user-cell" style={{ padding: '16px 8px' }}>
                        <span style={{ padding: '4px 8px', borderRadius: 8, fontSize: '0.75rem', background: user.role === 'admin' ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.05)', color: user.role === 'admin' ? '#818cf8' : 'var(--text-secondary)' }}>
                          {user.role}
                        </span>
                      </td>
                      <td data-label="Actions" className="admin-user-cell" style={{ padding: '16px 8px', textAlign: 'right' }}>
                        <div className="admin-user-actions" style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                          {editingId === user._id ? (
                            <>
                              <button onClick={() => handleUpdateUser(user._id)} style={{ color: '#10b981', background: 'none', border: 'none', cursor: 'pointer' }}><Check size={18} /></button>
                              <button onClick={() => setEditingId(null)} style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => startEdit(user)} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}><Edit2 size={16} /></button>
                              <button onClick={() => handleDeleteUser(user._id)} style={{ color: 'rgba(248,113,113,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* User Feedback Section */}
          <section className="admin-panel" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: 24, padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Community Feedback</h3>
              {feedback.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: '6px 12px' }}>
                  <Star size={13} fill="#f59e0b" color="#f59e0b" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b' }}>
                    {(feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>· {feedback.length} reviews</span>
                </div>
              )}
            </div>
            <div className="admin-feedback-list" style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 520, overflowY: 'auto', paddingRight: 4 }}>
              {feedback.map((f) => (
                <div key={f._id} className="admin-feedback-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 4 }}>{f.name}</div>
                      <div style={{ display: 'flex', gap: 2 }}>
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} size={12} fill={s <= f.rating ? '#f59e0b' : 'none'} color={s <= f.rating ? '#f59e0b' : 'rgba(255,255,255,0.2)'} />
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteFeedback(f._id)}
                      title="Delete feedback"
                      style={{
                        background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)',
                        borderRadius: 8, padding: '5px 7px', cursor: 'pointer',
                        color: '#f87171', display: 'flex', alignItems: 'center',
                        transition: 'all 0.15s', flexShrink: 0
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.18)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.35)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.15)'; }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>"{f.comment}"</p>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 10 }}>{new Date(f.createdAt).toLocaleDateString()}</div>
                </div>
              ))}
              {feedback.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>No feedback yet.</p>}
            </div>
          </section>
        </div>
      </main>

      <footer style={{ padding: '40px 24px', textAlign: 'center', opacity: 0.5 }}>
        <p>© 2026 Clipo AI Administrative Access</p>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .admin-modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);
          display: flex; alignItems: center; justifyContent: center; z-index: 2000;
          padding: 20px;
        }
        .admin-modal {
          background: var(--bg-secondary); border: 1px solid var(--border-glass);
          border-radius: 24px; padding: 32px; width: 100%; maxWidth: 500px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }
        .form-group { marginBottom: 20px; }
        .form-label { display: block; fontSize: 0.85rem; color: var(--text-muted); marginBottom: 8px; }
        .form-input { 
          width: 100%; padding: 12px 16px; borderRadius: 12px; background: rgba(255,255,255,0.03);
          border: 1px solid var(--border-glass); color: white; fontSize: 0.95rem; outline: none;
        }
        .form-input:focus { border-color: var(--accent-primary); background: rgba(255,255,255,0.06); }
      `}} />

      <AnimatePresence>
        {showCreateModal && (
          <div className="admin-modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="admin-modal"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Create New Account</h3>
                <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
              </div>
              <form onSubmit={handleCreateUser}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" required value={newUserForm.name} onChange={e => setNewUserForm(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" required value={newUserForm.email} onChange={e => setNewUserForm(p => ({ ...p, email: e.target.value }))} placeholder="john@example.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Temporary Password</label>
                  <input className="form-input" type="password" required value={newUserForm.password} onChange={e => setNewUserForm(p => ({ ...p, password: e.target.value }))} placeholder="At least 6 characters" />
                </div>
                <div className="form-group">
                  <label className="form-label">System Role</label>
                  <select className="form-input" value={newUserForm.role} onChange={e => setNewUserForm(p => ({ ...p, role: e.target.value }))}>
                    <option value="user">Standard User</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <button 
                  type="submit" disabled={creating}
                  style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: 'var(--accent-primary)', color: 'var(--bg-primary)', fontWeight: 700, fontSize: '1rem', cursor: creating ? 'not-allowed' : 'pointer', marginTop: 10 }}
                >
                  {creating ? <Loader2 className="animate-spin" size={20} /> : 'Create User Account'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Loader2({ className, size }) {
  return <RefreshCcw className={className} size={size} /> // Fallback for Loader2
}

function StatCard({ icon, title, value, color }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', borderRadius: 24, padding: 24, backdropFilter: 'blur(10px)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <div style={{ padding: 12, borderRadius: 12, background: `${color}15`, color: color }}>
          {icon}
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>{title}</div>
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 800 }}>{value !== undefined ? value : '...'}</div>
    </motion.div>
  );
}
