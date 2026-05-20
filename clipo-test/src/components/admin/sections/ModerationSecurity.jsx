import { useState, useEffect } from 'react';
import { ShieldAlert, History, AlertTriangle, CheckCircle2, Lock, User, Trash2 } from 'lucide-react';
import api from '../../../utils/api';
import socket from '../../../utils/socket';

export default function ModerationSecurity({ initialTab = 'moderation' }) {
  const [modLogs, setModLogs] = useState([]);
  const [secLogs, setSecLogs] = useState([]);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const modRes = await api.get('/admin/moderation/logs');
      const secRes = await api.get('/admin/security/logs');
      setModLogs(modRes.data.logs);
      setSecLogs(secRes.data.logs);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();

    // Listen for real-time moderation alerts
    socket.on('moderation_alert', (data) => {
      setModLogs(prev => [{
        _id: Date.now(),
        timestamp: new Date(),
        userId: { name: 'Live Event' },
        content: data.content,
        riskLevel: data.riskLevel,
        category: data.categories,
        actionTaken: data.actionTaken
      }, ...prev].slice(0, 50));
    });

    return () => socket.off('moderation_alert');
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: 8, background: '#111', padding: 4, borderRadius: 12, width: 'fit-content', border: '1px solid #222' }}>
        <button 
          onClick={() => setActiveTab('moderation')}
          style={{ padding: '8px 20px', borderRadius: 10, border: 'none', background: activeTab === 'moderation' ? '#222' : 'transparent', color: activeTab === 'moderation' ? '#fff' : '#666', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <ShieldAlert size={16} /> Moderation
        </button>
        <button 
          onClick={() => setActiveTab('security')}
          style={{ padding: '8px 20px', borderRadius: 10, border: 'none', background: activeTab === 'security' ? '#222' : 'transparent', color: activeTab === 'security' ? '#fff' : '#666', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Lock size={16} /> Security Logs
        </button>
      </div>

      {activeTab === 'moderation' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 24 }}>
           {modLogs.map((log) => (
             <div key={log._id} style={{ background: '#111', padding: 24, borderRadius: 24, border: '1px solid #222', position: 'relative', overflow: 'hidden' }}>
               <div style={{ position: 'absolute', top: 0, right: 0, width: 4, height: '100%', background: log.riskLevel === 'critical' ? '#f87171' : log.riskLevel === 'dangerous' ? '#fbbf24' : '#10b981' }}></div>
               
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ fontSize: '0.75rem', color: '#555' }}>{new Date(log.timestamp).toLocaleString()}</div>
                  <span style={{ 
                    fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', 
                    color: log.riskLevel === 'critical' ? '#f87171' : log.riskLevel === 'dangerous' ? '#fbbf24' : '#10b981' 
                  }}>
                    {log.riskLevel}
                  </span>
               </div>

               <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <User size={16} color="#666" />
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{log.userId?.name || 'Unknown User'}</span>
               </div>

               <div style={{ background: '#0a0a0a', padding: 16, borderRadius: 12, marginBottom: 16, border: '1px solid #1a1a1a' }}>
                 <p style={{ fontSize: '0.85rem', color: '#888', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>"{log.content}"</p>
               </div>

               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {log.category?.map(cat => (
                      <span key={cat} style={{ fontSize: '0.65rem', background: '#1a1a1a', padding: '4px 8px', borderRadius: 6, color: '#666', border: '1px solid #222' }}>{cat}</span>
                    ))}
                  </div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: log.actionTaken === 'auto_ban' ? '#f87171' : '#10b981' }}>
                    {log.actionTaken?.toUpperCase()}
                  </div>
               </div>
             </div>
           ))}
           {modLogs.length === 0 && <div style={{ gridColumn: '1/-1', color: '#444', textAlign: 'center', padding: 100 }}>No moderation incidents on record.</div>}
        </div>
      ) : (
        <div style={{ background: '#111', borderRadius: 24, border: '1px solid #222', overflow: 'hidden' }}>
           <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#1a1a1a' }}>
                  <tr>
                    <th style={{ padding: '20px', textAlign: 'left', fontSize: '0.8rem', color: '#444', fontWeight: 700 }}>EVENT</th>
                    <th style={{ padding: '20px', textAlign: 'left', fontSize: '0.8rem', color: '#444', fontWeight: 700 }}>USER</th>
                    <th style={{ padding: '20px', textAlign: 'left', fontSize: '0.8rem', color: '#444', fontWeight: 700 }}>DETAILS</th>
                    <th style={{ padding: '20px', textAlign: 'left', fontSize: '0.8rem', color: '#444', fontWeight: 700 }}>TIMESTAMP</th>
                  </tr>
                </thead>
                <tbody>
                  {secLogs.map((log) => (
                    <tr key={log._id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                      <td style={{ padding: '20px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-primary)', background: 'rgba(99,102,241,0.1)', padding: '4px 8px', borderRadius: 6 }}>
                          {log.event.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '20px', fontSize: '0.9rem', fontWeight: 600 }}>{log.userId?.name || 'System'}</td>
                      <td style={{ padding: '20px', fontSize: '0.85rem', color: '#666' }}>{log.details}</td>
                      <td style={{ padding: '20px', fontSize: '0.8rem', color: '#444' }}>{new Date(log.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>
      )}
    </div>
  );
}
