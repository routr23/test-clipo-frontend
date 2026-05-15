import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap, History, LogOut, LogIn, Menu, X,
  Sparkles, LayoutDashboard, MessageCircle
} from 'lucide-react';
import LogoIcon from './LogoIcon';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // No navbar on the chat page — chat has its own sidebar
  if (location.pathname === '/chat') return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavLink = ({ to, children, icon: Icon }) => (
    <Link
      to={to}
      className="nav-link"
      onClick={() => setMenuOpen(false)}
    >
      {Icon && <Icon size={15} />}
      {children}
    </Link>
  );

  return (
    <nav className="main-navbar">
      {/* Logo */}
      <Link to="/" className="nav-brand">
        <LogoIcon size={40} />
        <span>
          Cli<span style={{ color: 'var(--accent-primary)' }}>po</span>
        </span>
      </Link>

      {/* Desktop Nav */}
      <div className="nav-links nav-desktop-links">
        {isAuthenticated ? (
          <>
            <NavLink to="/chat" icon={Sparkles}>Ask AI</NavLink>
            <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
            <NavLink to="/history" icon={History}>History</NavLink>
            <NavLink to="/feedback" icon={MessageCircle}>Feedback</NavLink>
            <div className="nav-divider" />
            {/* User avatar */}
            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', cursor: 'pointer' }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'var(--accent-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: 700, color: '#000', flexShrink: 0,
                overflow: 'hidden'
              }}>
                {user?.avatar ? (
                  <img src={user.avatar} alt="PFP" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user?.name?.[0]?.toUpperCase()
                )}
              </div>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {user?.name?.split(' ')[0]}
              </span>
            </Link>
            <button onClick={handleLogout} className="nav-link" style={{ color: '#f87171' }}>
              <LogOut size={15} />
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Log in</NavLink>
            <Link to="/register" className="btn btn-primary" style={{ padding: '7px 16px', fontSize: '0.875rem' }}>
              Get Started
            </Link>
          </>
        )}
      </div>

      {/* Mobile Toggle */}
      <button
        className="nav-mobile-menu"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{ background: 'none', border: 'none', color: 'var(--text-primary)', padding: 6, cursor: 'pointer', marginLeft: 'auto' }}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="nav-mobile-dropdown"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'fixed', top: 56, left: 0, right: 0,
              background: 'rgba(26, 26, 26, 0.98)',
              backdropFilter: 'blur(16px)',
              border: '1px solid var(--border-glass)',
              borderTop: 'none',
              padding: '12px 16px 20px',
              display: 'flex', flexDirection: 'column', gap: 6,
              zIndex: 300
            }}
          >
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  paddingBottom: 12, marginBottom: 4,
                  borderBottom: '1px solid var(--border-subtle)',
                  textDecoration: 'none', cursor: 'pointer'
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'var(--accent-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.9rem', fontWeight: 700, color: '#000',
                    overflow: 'hidden'
                  }}>
                    {user?.avatar ? (
                      <img src={user.avatar} alt="PFP" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      user?.name?.[0]?.toUpperCase()
                    )}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{user?.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{user?.email}</div>
                  </div>
                </Link>
                <NavLink to="/chat" icon={Sparkles}>Ask AI</NavLink>
                <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
                <NavLink to="/history" icon={History}>History</NavLink>
                <NavLink to="/feedback" icon={MessageCircle}>Feedback</NavLink>
                <button
                  onClick={handleLogout}
                  className="nav-link"
                  style={{ color: '#f87171', marginTop: 8, border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)' }}
                >
                  <LogOut size={15} /> Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Log in</NavLink>
                <Link to="/register" className="btn btn-primary" style={{ justifyContent: 'center' }} onClick={() => setMenuOpen(false)}>
                  Get Started
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
