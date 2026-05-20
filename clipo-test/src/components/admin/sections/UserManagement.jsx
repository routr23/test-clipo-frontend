import { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Shield, ShieldOff, Trash2, Edit, ChevronLeft, ChevronRight, VolumeX, Volume2, Database } from 'lucide-react';
import api from '../../../utils/api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/users?page=${page}&search=${searchTerm}&status=${statusFilter}&role=${roleFilter}`);
      setUsers(res.data.users);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, statusFilter, roleFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleAction = async (userId, action, value = null) => {
    let reason = 'Admin panel administrative action';
    if (action === 'delete') {
      if (!window.confirm('PERMANENTLY DELETE this user? This action cannot be undone.')) return;
    }
    if (action === 'mute' && !value) {
      value = prompt('Mute duration in days:', '7');
      if (!value) return;
    }
    if (action === 'ban' || action === 'mute') {
      reason = prompt('Reason for this action:', 'Violation of terms');
      if (!reason) return;
    }

    try {
      if (action === 'delete') {
        await api.delete(`/admin/users/${userId}`);
        alert('User deleted successfully');
      } else {
        await api.post(`/admin/users/${userId}/action`, { action, value, reason });
      }
      fetchUsers();
    } catch (err) {
      alert('Action failed: ' + (err.response?.data?.message || 'Server error'));
    }
  };

  return (
    <div style={{ background: '#111', borderRadius: 24, border: '1px solid #222', padding: 32 }}>
      {/* Header & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 16 }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#444' }} size={16} />
            <input 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '10px 16px 10px 40px', background: '#0a0a0a', border: '1px solid #222', borderRadius: 10, color: '#fff', width: 300 }} 
            />
          </div>
          <button type="submit" style={{ padding: '10px 20px', background: '#222', border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer' }}>Search</button>
        </form>

        <div style={{ display: 'flex', gap: 12 }}>
          <select 
            value={roleFilter} 
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            style={{ padding: '10px', background: '#0a0a0a', border: '1px solid #222', borderRadius: 10, color: '#888', outline: 'none' }}
          >
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="moderator">Moderators</option>
            <option value="admin">Admins</option>
          </select>
          <select 
            value={statusFilter} 
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            style={{ padding: '10px', background: '#0a0a0a', border: '1px solid #222', borderRadius: 10, color: '#888', outline: 'none' }}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
            <option value="suspended">Suspended</option>
            <option value="muted">Muted</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <th style={{ padding: '16px', color: '#444', fontWeight: 500, fontSize: '0.8rem' }}>USER IDENTITY</th>
              <th style={{ padding: '16px', color: '#444', fontWeight: 500, fontSize: '0.8rem' }}>STATUS</th>
              <th style={{ padding: '16px', color: '#444', fontWeight: 500, fontSize: '0.8rem' }}>ROLE</th>
              <th style={{ padding: '16px', color: '#444', fontWeight: 500, fontSize: '0.8rem' }}>USAGE</th>
              <th style={{ padding: '16px', color: '#444', fontWeight: 500, fontSize: '0.8rem' }}>GEO/DEVICE</th>
              <th style={{ padding: '16px', color: '#444', fontWeight: 500, fontSize: '0.8rem', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody style={{ opacity: loading ? 0.5 : 1 }}>
            {users.map((user) => (
              <tr key={user._id} style={{ borderBottom: '1px solid #1a1a1a', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#141414'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#000', overflow: 'hidden' }}>
                      {user.avatar ? <img src={user.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (user.name ? user.name[0].toUpperCase() : '?')}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#666' }}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    padding: '4px 10px', borderRadius: 8, fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase',
                    background: user.status === 'active' ? 'rgba(16,185,129,0.1)' : user.status === 'banned' ? 'rgba(248,113,113,0.1)' : 'rgba(245,158,11,0.1)',
                    color: user.status === 'active' ? '#10b981' : user.status === 'banned' ? '#f87171' : '#f59e0b'
                  }}>
                    {user.status || 'active'}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                  <select 
                    value={user.role} 
                    onChange={(e) => handleAction(user._id, 'role', e.target.value)}
                    style={{ background: '#1a1a1a', border: '1px solid #222', borderRadius: 8, color: '#aaa', padding: '6px 10px', fontSize: '0.8rem', outline: 'none' }}
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#aaa' }}>
                    <Database size={14} color="var(--accent-primary)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{((user.tokenUsage?.total || 0) / 1000).toFixed(1)}k</span>
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#444' }}>{user.chatsCount || 0} Chats</div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#888' }}>{user.country || 'Unknown'}</div>
                  <div style={{ fontSize: '0.65rem', color: '#444' }}>{user.os || 'Unknown'} • {user.browser || '-'}</div>
                </td>
                <td style={{ padding: '16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                    {user.status === 'muted' ? (
                       <button onClick={() => handleAction(user._id, 'unban')} title="Unmute User" style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer' }}><Volume2 size={18} /></button>
                    ) : (
                       <button onClick={() => handleAction(user._id, 'mute')} title="Mute User" style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer' }}><VolumeX size={18} /></button>
                    )}
                    
                    {user.status === 'active' ? (
                      <button onClick={() => handleAction(user._id, 'ban')} title="Ban User" style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer' }}><ShieldOff size={18} /></button>
                    ) : (
                      <button onClick={() => handleAction(user._id, 'unban')} title="Unban User" style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer' }}><Shield size={18} /></button>
                    )}
                    
                    <button onClick={() => handleAction(user._id, 'delete')} title="Delete User" style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, marginTop: 40, borderTop: '1px solid #222', paddingTop: 32 }}>
        <button 
          disabled={page === 1} 
          onClick={() => setPage(page - 1)}
          style={{ padding: '10px', background: '#111', border: '1px solid #222', borderRadius: 12, color: '#fff', cursor: 'pointer', opacity: page === 1 ? 0.3 : 1 }}
        >
          <ChevronLeft size={20} />
        </button>
        <span style={{ color: '#444', fontSize: '0.85rem', fontWeight: 600 }}>Page {page} of {totalPages}</span>
        <button 
          disabled={page === totalPages} 
          onClick={() => setPage(page + 1)}
          style={{ padding: '10px', background: '#111', border: '1px solid #222', borderRadius: 12, color: '#fff', cursor: 'pointer', opacity: page === totalPages ? 0.3 : 1 }}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
