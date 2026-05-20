import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, MessageSquare, Zap, DollarSign, Activity, 
  ShieldAlert, Clock, Flag, AlertCircle
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import socket from '../../../utils/socket';
import api from '../../../utils/api';

export default function DashboardSection({ stats: initialStats }) {
  const [stats, setStats] = useState(initialStats);
  const [liveActivities, setLiveActivities] = useState([]);
  const [usageHistory, setUsageHistory] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data.stats);
      setOnlineCount(res.data.stats.onlineNow);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Fetch analytics for main chart
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/admin/analytics?days=7');
        setUsageHistory(res.data.analytics.map(item => ({
          name: new Date(item.date).toLocaleDateString([], { weekday: 'short' }),
          usage: item.totalTokens
        })));
      } catch (err) {
        console.error('Analytics fetch error:', err);
      }
    };
    fetchAnalytics();

    // Socket.io Real-time connection
    socket.connect();
    socket.emit('join_admin');

    socket.on('online_count', (count) => {
      setOnlineCount(count);
    });

    socket.on('live_chat', (data) => {
      setLiveActivities(prev => [{
        id: Date.now(),
        user: data.userName,
        action: `Sent: ${data.prompt}...`,
        time: 'Just now',
        tokens: data.tokens
      }, ...prev].slice(0, 8));
      
      // Real-time stat update
      setStats(s => ({
        ...s,
        totalTokens: (s?.totalTokens || 0) + data.tokens,
        totalRequests: (s?.totalRequests || 0) + 1
      }));
    });

    socket.on('moderation_alert', (data) => {
      setStats(s => ({ ...s, flaggedPrompts: (s?.flaggedPrompts || 0) + 1 }));
    });

    socket.on('new_report', () => {
      setStats(s => ({ ...s, pendingReports: (s?.pendingReports || 0) + 1 }));
    });

    return () => {
      socket.off('online_count');
      socket.off('live_chat');
      socket.off('moderation_alert');
      socket.off('new_report');
    };
  }, []);

  return (
    <div className="dashboard-section" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Dynamic Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
        <StatCard icon={<Users color="#6366f1" />} title="Total Users" value={stats?.totalUsers || 0} delta="+2.4%" />
        <StatCard icon={<Activity color="#10b981" />} title="Online Now" value={onlineCount} status="LIVE" />
        <StatCard icon={<Zap color="#f59e0b" />} title="API Tokens" value={stats?.totalTokens?.toLocaleString() || 0} delta="+5%" />
        <StatCard icon={<DollarSign color="#06b6d4" />} title="Total Cost" value={`$${stats?.totalCost?.toFixed(2) || '0.00'}`} color="#f87171" />
        <StatCard icon={<MessageSquare color="#8b5cf6" />} title="Total Chats" value={stats?.totalSessions || 0} />
        <StatCard icon={<Flag color="#f87171" />} title="Flagged" value={stats?.flaggedPrompts || 0} warning={stats?.flaggedPrompts > 0} />
        <StatCard icon={<AlertCircle color="#fbbf24" />} title="Reports" value={stats?.pendingReports || 0} warning={stats?.pendingReports > 0} />
        <StatCard icon={<Clock color="#94a3b8" />} title="Avg Latency" value={`${Math.round(stats?.avgResponseTime || 0)}ms`} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Main Chart Area */}
        <div style={{ background: '#111', padding: 32, borderRadius: 24, border: '1px solid #222' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Platform Consumption</h3>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ fontSize: '0.8rem', color: '#666', display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, background: 'var(--accent-primary)', borderRadius: '50%' }}></div> Weekly Token Volume
              </span>
            </div>
          </div>
          <div style={{ height: 320 }}>
            {usageHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={usageHistory}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis dataKey="name" stroke="#444" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#444" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: '#111', border: '1px solid #222', borderRadius: 12 }} />
                  <Area type="monotone" dataKey="usage" stroke="var(--accent-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorUsage)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444' }}>Loading analytics...</div>
            )}
          </div>
        </div>

        {/* Real-time Event Monitor */}
        <div style={{ background: '#111', padding: 32, borderRadius: 24, border: '1px solid #222', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <Activity size={20} color="var(--accent-primary)" />
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Active Stream</h3>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AnimatePresence initial={false}>
              {liveActivities.map((act) => (
                <motion.div key={act.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <ActivityItem user={act.user} action={act.action} time={act.time} tokens={act.tokens} />
                </motion.div>
              ))}
            </AnimatePresence>
            {liveActivities.length === 0 && (
              <div style={{ color: '#444', textAlign: 'center', padding: '60px 0', fontSize: '0.85rem' }}>Waiting for activity...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, delta, status, warning, color }) {
  return (
    <motion.div whileHover={{ y: -5 }} style={{ background: '#111', padding: 24, borderRadius: 24, border: `1px solid ${warning ? 'rgba(248,113,113,0.3)' : '#222'}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ padding: 10, background: '#1a1a1a', borderRadius: 12 }}>{icon}</div>
        {(delta || status) && (
          <span style={{ 
            fontSize: '0.65rem', fontWeight: 800, padding: '4px 8px', borderRadius: 8,
            background: status === 'LIVE' ? 'rgba(16,185,129,0.1)' : 'rgba(99,102,241,0.05)',
            color: status === 'LIVE' ? '#10b981' : '#6366f1'
          }}>
            {status || delta}
          </span>
        )}
      </div>
      <div style={{ color: '#666', fontSize: '0.75rem', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</div>
      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: color || '#fff' }}>{value}</div>
    </motion.div>
  );
}

function ActivityItem({ user, action, time, tokens }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#0a0a0a', borderRadius: 12, border: '1px solid #1a1a1a' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ width: 6, height: 6, background: '#10b981', borderRadius: '50%' }}></div>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{user}</div>
          <div style={{ fontSize: '0.7rem', color: '#555', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{action}</div>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '0.65rem', color: '#444' }}>{time}</div>
        <div style={{ fontSize: '0.6rem', color: 'var(--accent-primary)', fontWeight: 600 }}>{tokens} TKN</div>
      </div>
    </div>
  );
}
