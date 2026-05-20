import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, MessageSquare, ShieldAlert, 
  BarChart3, History, Settings, Menu, X, 
  LogOut, Bell, Search, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import socket from '../../utils/socket';

export default function AdminLayout({ children, activeSection, setActiveSection }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    socket.connect();
    socket.emit('join_admin');

    socket.on('moderation_alert', (data) => {
      const newNotif = {
        id: Date.now(),
        type: 'moderation',
        title: 'Critical Violation',
        message: `User ${data.userId.substring(0,8)}... flagged: ${data.categories.join(', ')}`,
        time: 'Just now'
      };
      setNotifications(prev => [newNotif, ...prev].slice(0, 10));
    });

    socket.on('new_report', (data) => {
      const newNotif = {
        id: Date.now(),
        type: 'report',
        title: 'New User Report',
        message: `Type: ${data.type}`,
        time: 'Just now'
      };
      setNotifications(prev => [newNotif, ...prev].slice(0, 10));
    });

    return () => {
      socket.off('moderation_alert');
      socket.off('new_report');
    };
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
    { id: 'chats', label: 'Chats', icon: <MessageSquare size={20} /> },
    { id: 'moderation', label: 'Moderation', icon: <ShieldAlert size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'security', label: 'Security Logs', icon: <History size={20} /> },
    { id: 'reports', label: 'Reports', icon: <AlertCircle size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a', color: '#fff' }}>
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        style={{ 
          background: '#111', borderRight: '1px solid #222', display: 'flex', 
          flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 100
        }}
      >
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'space-between' : 'center', marginBottom: 20 }}>
          {isSidebarOpen && <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-primary)' }}>AdminHub</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav style={{ flex: 1, padding: '0 12px' }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', borderRadius: 12, border: 'none',
                background: activeSection === item.id ? 'var(--accent-primary)' : 'transparent',
                color: activeSection === item.id ? '#000' : '#888', cursor: 'pointer', marginBottom: 4, transition: 'all 0.2s',
                justifyContent: isSidebarOpen ? 'flex-start' : 'center'
              }}
            >
              {item.icon}
              {isSidebarOpen && <span style={{ fontWeight: 600 }}>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid #222' }}>
          <button onClick={() => navigate('/')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: '12px', border: 'none', background: 'transparent', color: '#f87171', cursor: 'pointer', justifyContent: isSidebarOpen ? 'flex-start' : 'center' }}>
            <LogOut size={20} />
            {isSidebarOpen && <span style={{ fontWeight: 600 }}>Exit Portal</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: isSidebarOpen ? 280 : 80, padding: '40px', transition: 'margin-left 0.3s', maxWidth: '1600px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{menuItems.find(i => i.id === activeSection)?.label}</h1>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Welcome back, Super Admin</p>
          </div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
             <div style={{ position: 'relative' }}>
                <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#444' }} size={16} />
                <input placeholder="Global search..." style={{ padding: '10px 16px 10px 40px', background: '#111', border: '1px solid #222', borderRadius: 10, color: '#fff', width: 240 }} />
             </div>
             
             <div style={{ position: 'relative' }}>
                <button onClick={() => setShowNotifications(!showNotifications)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', position: 'relative' }}>
                  <Bell size={20} />
                  {notifications.length > 0 && <span style={{ position: 'absolute', top: -4, right: -4, width: 8, height: 8, background: 'var(--accent-primary)', borderRadius: '50%' }}></span>}
                </button>
                
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} style={{ position: 'absolute', top: 40, right: 0, width: 300, background: '#111', border: '1px solid #222', borderRadius: 16, padding: 16, zIndex: 1000, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                      <h4 style={{ marginBottom: 16, fontSize: '0.9rem', fontWeight: 700 }}>Notifications</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {notifications.map(n => (
                          <div key={n.id} style={{ padding: '10px', background: '#0a0a0a', borderRadius: 10, border: '1px solid #1a1a1a' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, color: n.type === 'moderation' ? '#f87171' : 'var(--accent-primary)' }}>
                              <AlertCircle size={14} />
                              <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{n.title}</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#888' }}>{n.message}</div>
                            <div style={{ fontSize: '0.65rem', color: '#444', marginTop: 4 }}>{n.time}</div>
                          </div>
                        ))}
                        {notifications.length === 0 && <div style={{ textAlign: 'center', color: '#444', fontSize: '0.8rem', padding: '20px 0' }}>No new alerts</div>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>

             <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#000' }}>A</div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
