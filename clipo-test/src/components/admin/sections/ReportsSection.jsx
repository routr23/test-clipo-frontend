import { useState, useEffect } from 'react';
import { Flag, CheckCircle, XCircle, Clock, User, MessageSquare } from 'lucide-react';
import api from '../../../utils/api';

export default function ReportsSection() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/reports');
      setReports(res.data.reports);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleResolve = async (id, status) => {
    try {
      const note = prompt('Admin resolution note:');
      await api.patch(`/admin/reports/${id}`, { status, adminNote: note });
      fetchReports();
    } catch (err) {
      alert('Failed to resolve report');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 24 }}>
        {reports.map((report) => (
          <div key={report._id} style={{ background: '#111', padding: 24, borderRadius: 24, border: '1px solid #222' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ padding: 10, background: 'rgba(248,113,113,0.1)', color: '#f87171', borderRadius: 10 }}>
                  <Flag size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{report.type.toUpperCase().replace('_', ' ')}</div>
                  <div style={{ fontSize: '0.75rem', color: '#444' }}>{new Date(report.timestamp).toLocaleString()}</div>
                </div>
              </div>
              <span style={{ 
                padding: '4px 10px', borderRadius: 8, fontSize: '0.65rem', fontWeight: 800,
                background: report.status === 'pending' ? 'rgba(251,191,36,0.1)' : 'rgba(16,185,129,0.1)',
                color: report.status === 'pending' ? '#fbbf24' : '#10b981'
              }}>
                {report.status.toUpperCase()}
              </span>
            </div>

            <div style={{ background: '#0a0a0a', padding: 16, borderRadius: 12, marginBottom: 20, border: '1px solid #1a1a1a' }}>
              <p style={{ fontSize: '0.9rem', color: '#888', margin: 0, lineHeight: 1.5 }}>{report.content}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#555' }}>
                    <User size={14} /> {report.reporterId?.name || 'Anonymous'}
                  </div>
                  {report.chatId && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#555', cursor: 'pointer' }}>
                      <MessageSquare size={14} /> View Chat
                    </div>
                  )}
               </div>
               
               {report.status === 'pending' && (
                 <div style={{ display: 'flex', gap: 8 }}>
                   <button onClick={() => handleResolve(report._id, 'dismissed')} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer' }}><XCircle size={20} /></button>
                   <button onClick={() => handleResolve(report._id, 'resolved')} style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer' }}><CheckCircle size={20} /></button>
                 </div>
               )}
            </div>
          </div>
        ))}
        {reports.length === 0 && <div style={{ color: '#444', textAlign: 'center', padding: 100 }}>No reports to review.</div>}
      </div>
    </div>
  );
}
