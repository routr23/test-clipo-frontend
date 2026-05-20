import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Calendar, Download, RefreshCcw, Filter } from 'lucide-react';
import api from '../../../utils/api';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f87171', '#06b6d4', '#8b5cf6'];

export default function AnalyticsUsage() {
  const [data, setData] = useState([]);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/analytics?days=${days}`);
      setData(res.data.analytics);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  // Aggregate top countries from the latest analytics entry or all entries in range
  const latestEntry = data[data.length - 1];
  const countryData = latestEntry?.topCountries || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 12, background: '#111', padding: 4, borderRadius: 12, border: '1px solid #222' }}>
          {[7, 30, 90].map(d => (
            <button 
              key={d}
              onClick={() => setDays(d)}
              style={{ padding: '8px 16px', borderRadius: 10, border: 'none', background: days === d ? '#222' : 'transparent', color: days === d ? '#fff' : '#666', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
            >
              {d} Days
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={fetchAnalytics} style={{ padding: '10px', background: '#111', border: '1px solid #222', borderRadius: 12, color: '#666', cursor: 'pointer' }}><RefreshCcw size={18} /></button>
          <button style={{ padding: '10px 20px', background: 'var(--accent-primary)', border: 'none', borderRadius: 12, color: '#000', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <Download size={18} /> Export Report
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
        {/* Token Usage History */}
        <div className="chart-card" style={{ background: '#111', padding: 32, borderRadius: 24, border: '1px solid #222' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 32, fontSize: '1rem' }}>Token Consumption</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString([], { month: 'short', day: 'numeric' })} stroke="#444" fontSize={10} />
                <YAxis stroke="#444" fontSize={10} />
                <Tooltip contentStyle={{ background: '#111', border: '1px solid #222', borderRadius: 12 }} />
                <Area type="monotone" dataKey="totalTokens" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#usageGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth */}
        <div className="chart-card" style={{ background: '#111', padding: 32, borderRadius: 24, border: '1px solid #222' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 32, fontSize: '1rem' }}>User Acquisition</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString([], { month: 'short', day: 'numeric' })} stroke="#444" fontSize={10} />
                <YAxis stroke="#444" fontSize={10} />
                <Tooltip contentStyle={{ background: '#111', border: '1px solid #222', borderRadius: 12 }} />
                <Bar dataKey="newUsers" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Country Distribution */}
        <div className="chart-card" style={{ background: '#111', padding: 32, borderRadius: 24, border: '1px solid #222' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 32, fontSize: '1rem' }}>Geographic Distribution</h3>
          <div style={{ height: 300, display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={countryData} dataKey="count" nameKey="country" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5}>
                  {countryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#111', border: '1px solid #222', borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
               {countryData.map((c, i) => (
                 <div key={c.country} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem' }}>
                    <div style={{ width: 8, height: 8, background: COLORS[i % COLORS.length], borderRadius: '50%' }}></div>
                    <span style={{ color: '#888' }}>{c.country}:</span>
                    <span style={{ fontWeight: 700 }}>{c.count}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Latency / Response Time */}
        <div className="chart-card" style={{ background: '#111', padding: 32, borderRadius: 24, border: '1px solid #222' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 32, fontSize: '1rem' }}>System Latency (ms)</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString([], { month: 'short', day: 'numeric' })} stroke="#444" fontSize={10} />
                <YAxis stroke="#444" fontSize={10} />
                <Tooltip contentStyle={{ background: '#111', border: '1px solid #222', borderRadius: 12 }} />
                <Line type="monotone" dataKey="avgResponseTime" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Full Stats Table */}
      <div style={{ background: '#111', padding: 32, borderRadius: 24, border: '1px solid #222' }}>
        <h3 style={{ fontWeight: 700, marginBottom: 24, fontSize: '1.2rem' }}>Detailed Metrics Ledger</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #222' }}>
                <th style={{ padding: '16px', color: '#444' }}>Date</th>
                <th style={{ padding: '16px', color: '#444' }}>New Users</th>
                <th style={{ padding: '16px', color: '#444' }}>Total Chats</th>
                <th style={{ padding: '16px', color: '#444' }}>Tokens</th>
                <th style={{ padding: '16px', color: '#444' }}>Est. Cost</th>
                <th style={{ padding: '16px', color: '#444' }}>Mod. Alerts</th>
              </tr>
            </thead>
            <tbody>
              {data.slice().reverse().map(item => (
                <tr key={item._id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                  <td style={{ padding: '16px', fontWeight: 600 }}>{new Date(item.date).toLocaleDateString()}</td>
                  <td style={{ padding: '16px' }}>{item.newUsers}</td>
                  <td style={{ padding: '16px' }}>{item.totalChats}</td>
                  <td style={{ padding: '16px' }}>{item.totalTokens?.toLocaleString()}</td>
                  <td style={{ padding: '16px', color: '#f59e0b' }}>${item.totalCost?.toFixed(4)}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ color: item.moderationEvents > 0 ? '#f87171' : '#666' }}>{item.moderationEvents}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
