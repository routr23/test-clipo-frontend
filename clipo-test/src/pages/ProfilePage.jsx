import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Mail, Calendar, Shield, LogOut, ArrowLeft, Edit2, Loader2, Key, Sun, Moon, Monitor
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';
import SEO from '../components/SEO';

export default function ProfilePage() {
  const { user, login, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const fileInputRef = useRef(null);

  const joinedDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    day: 'numeric'
  }) : 'March 2024';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ text: 'Image size should be less than 2MB', type: 'error' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        if (!isEditing) setIsEditing(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const { data } = await api.put('/auth/profile', { name, avatar });
      // Update local storage and context
      login(data.user, localStorage.getItem('clipo_token'));
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setIsEditing(false);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to update profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
      <SEO title="Profile | Clipo AI" description="Manage your Clipo AI profile and account settings." />

      {/* Top Navbar */}
      <header style={{
        padding: '16px 24px',
        borderBottom: '1px solid var(--border-glass)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg-primary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate(-1)} style={{
            background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4, borderRadius: 6,
            transition: 'background 0.2s'
          }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <ArrowLeft size={20} />
          </button>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 600 }}>Account Settings</h1>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px 24px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 640 }}>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
          >
            {/* Profile Header Card */}
            <div style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)',
              borderRadius: 16, padding: '32px 24px', display: 'flex', alignItems: 'center', gap: 24
            }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%', background: 'var(--accent-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2.5rem', fontWeight: 700, color: 'var(--bg-primary)', flexShrink: 0,
                  overflow: 'hidden', border: '2px solid var(--border-glass)'
                }}>
                  {avatar ? (
                    <img src={avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    user?.name?.[0]?.toUpperCase()
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    position: 'absolute', bottom: -4, right: -4, background: 'var(--bg-card)',
                    border: '1px solid var(--border-glass)', borderRadius: '50%', width: 28, height: 28,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    color: 'var(--text-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  <Edit2 size={14} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>{user?.name}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Mail size={14} /> {user?.email}
                </p>
                {user?.role === 'admin' && (
                  <span style={{
                    marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.75rem',
                    background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)',
                    padding: '2px 8px', borderRadius: 12, fontWeight: 600
                  }}>
                    <Shield size={12} /> Admin
                  </span>
                )}
              </div>
            </div>

            {/* General Settings */}
            <div style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)',
              borderRadius: 16, padding: 24
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <User size={18} /> General Information
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Name Field */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>Full Name</label>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      disabled={!isEditing}
                      style={{
                        flex: 1, padding: '10px 14px', borderRadius: 10, background: isEditing ? 'var(--bg-input)' : 'transparent',
                        border: isEditing ? '1px solid var(--border-glass)' : '1px solid transparent', color: 'var(--text-primary)',
                        fontSize: '0.95rem', outline: 'none', transition: 'all 0.2s',
                        borderBottom: !isEditing ? '1px solid var(--border-glass)' : '1px solid var(--border-glass)'
                      }}
                    />
                    {isEditing ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={handleSave} disabled={loading} style={{
                          padding: '0 16px', borderRadius: 10, background: 'var(--accent-primary)', color: 'var(--bg-primary)',
                          border: 'none', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6
                        }}>
                          {loading ? <Loader2 size={16} className="animate-spin" /> : 'Save'}
                        </button>
                        <button onClick={() => { setIsEditing(false); setName(user?.name || ''); }} style={{
                          padding: '0 16px', borderRadius: 10, background: 'var(--bg-card)', color: 'var(--text-primary)',
                          border: '1px solid var(--border-glass)', fontWeight: 500, cursor: 'pointer'
                        }}>
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setIsEditing(true)} style={{
                        padding: '0 16px', borderRadius: 10, background: 'var(--bg-card)', color: 'var(--text-primary)',
                        border: '1px solid var(--border-glass)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                      }}>
                        <Edit2 size={14} /> Edit
                      </button>
                    )}
                  </div>
                </div>

                {/* Email (Readonly) */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>Email Address</label>
                  <input
                    type="text"
                    value={user?.email || ''}
                    disabled
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: 10, background: 'transparent',
                      border: '1px solid transparent', borderBottom: '1px solid var(--border-glass)', color: 'var(--text-secondary)',
                      fontSize: '0.95rem', outline: 'none', cursor: 'not-allowed'
                    }}
                  />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6 }}>Email address cannot be changed.</p>
                </div>
              </div>

              {message.text && (
                <div style={{
                  marginTop: 16, padding: '10px 14px', borderRadius: 8, fontSize: '0.875rem',
                  background: message.type === 'success' ? 'rgba(25, 195, 125, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: message.type === 'success' ? '#19c37d' : '#ef4444',
                  border: message.type === 'success' ? '1px solid rgba(25, 195, 125, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                  {message.text}
                </div>
              )}
            </div>

            {/* Appearance Card */}
            <div style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)',
              borderRadius: 16, padding: 24
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                {isDark ? <Moon size={18} /> : <Sun size={18} />} Appearance
              </h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>Theme</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {isDark ? 'Dark mode is active' : 'Light mode is active'}
                  </div>
                </div>
                {/* Toggle Switch */}
                <button
                  onClick={toggleTheme}
                  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                  style={{
                    position: 'relative',
                    width: 56,
                    height: 30,
                    borderRadius: 999,
                    border: 'none',
                    cursor: 'pointer',
                    background: isDark
                      ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                      : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    transition: 'background 0.4s ease',
                    boxShadow: isDark
                      ? 'inset 0 1px 3px rgba(0,0,0,0.4), 0 0 12px rgba(99,102,241,0.15)'
                      : 'inset 0 1px 3px rgba(0,0,0,0.15), 0 0 12px rgba(245,158,11,0.2)',
                    flexShrink: 0,
                    overflow: 'hidden'
                  }}
                >
                  {/* Sun/Moon Icons inside track */}
                  <Sun size={12} style={{
                    position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)',
                    color: isDark ? 'rgba(255,255,255,0.2)' : '#fff',
                    transition: 'color 0.3s'
                  }} />
                  <Moon size={12} style={{
                    position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
                    color: isDark ? '#c4b5fd' : 'rgba(0,0,0,0.15)',
                    transition: 'color 0.3s'
                  }} />
                  {/* Knob */}
                  <div style={{
                    position: 'absolute',
                    top: 3,
                    left: isDark ? 29 : 3,
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: isDark ? '#1e1b4b' : '#ffffff',
                    boxShadow: isDark
                      ? '0 2px 6px rgba(0,0,0,0.5), inset 0 -1px 2px rgba(99,102,241,0.3)'
                      : '0 2px 6px rgba(0,0,0,0.15), inset 0 -1px 2px rgba(245,158,11,0.2)',
                    transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s, box-shadow 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  >
                    {isDark ? (
                      <Moon size={13} color="#a78bfa" />
                    ) : (
                      <Sun size={13} color="#f59e0b" />
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Account Details */}
            <div style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)',
              borderRadius: 16, padding: 24
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Key size={18} /> Account Status
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)' }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>Subscription Plan</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Free Tier</div>
                  </div>
                  <button style={{
                    padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border-glass)',
                    background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '0.85rem', cursor: 'pointer'
                  }}>
                    Upgrade Target
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>Member Since</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}><Calendar size={12} style={{ display: 'inline', marginRight: 4 }} />{joinedDate}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div style={{ marginTop: 8 }}>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%', padding: '14px', borderRadius: 12, border: '1px solid rgba(239, 68, 68, 0.3)',
                  background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 600,
                  fontSize: '0.95rem', transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>

          </motion.div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}} />
    </div>
  );
}
