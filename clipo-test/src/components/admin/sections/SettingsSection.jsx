import { useState, useEffect } from 'react';
import { Save, Bell, Shield, Settings, Globe, Zap } from 'lucide-react';
import api from '../../../utils/api';

export default function SettingsSection() {
  const [config, setConfig] = useState({
    notificationText: '',
    isNotificationActive: false,
    notificationTargetUrl: '',
    maintenanceMode: false,
    aiModel: 'openai/gpt-4o-mini'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await api.get('/admin/config');
        if (res.data.config) setConfig(prev => ({ ...prev, ...res.data.config }));
      } catch (err) {
        console.error('Failed to fetch config');
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch('/admin/config', config);
      alert('Settings saved successfully');
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Broadcast Settings */}
      <div style={{ background: '#111', padding: 32, borderRadius: 24, border: '1px solid #222' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ padding: 10, background: 'rgba(99,102,241,0.1)', color: '#818cf8', borderRadius: 12 }}>
            <Bell size={20} />
          </div>
          <h3 style={{ fontWeight: 700 }}>Global Broadcast</h3>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: 8 }}>Alert Message</label>
            <textarea 
              value={config.notificationText}
              onChange={e => setConfig({ ...config, notificationText: e.target.value })}
              style={{ width: '100%', padding: 16, background: '#0a0a0a', border: '1px solid #222', borderRadius: 12, color: '#fff', minHeight: 100 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: 8 }}>Action URL</label>
            <input 
              value={config.notificationTargetUrl}
              onChange={e => setConfig({ ...config, notificationTargetUrl: e.target.value })}
              style={{ width: '100%', padding: 12, background: '#0a0a0a', border: '1px solid #222', borderRadius: 12, color: '#fff' }}
            />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
             <input 
              type="checkbox" 
              checked={config.isNotificationActive}
              onChange={e => setConfig({ ...config, isNotificationActive: e.target.checked })}
              style={{ width: 18, height: 18, accentColor: 'var(--accent-primary)' }}
             />
             <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Activate Broadcast Banner</span>
          </label>
        </div>
      </div>

      {/* AI & Performance */}
      <div style={{ background: '#111', padding: 32, borderRadius: 24, border: '1px solid #222' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ padding: 10, background: 'rgba(245,158,11,0.1)', color: '#f59e0b', borderRadius: 12 }}>
            <Zap size={20} />
          </div>
          <h3 style={{ fontWeight: 700 }}>AI Platform Settings</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: 8 }}>Primary Model Provider</label>
            <select 
              value={config.aiModel}
              onChange={e => setConfig({ ...config, aiModel: e.target.value })}
              style={{ width: '100%', padding: 12, background: '#0a0a0a', border: '1px solid #222', borderRadius: 12, color: '#fff' }}
            >
              <option value="openai/gpt-4o-mini">OpenAI GPT-4o Mini</option>
              <option value="openai/gpt-4o">OpenAI GPT-4o</option>
              <option value="anthropic/claude-3-haiku">Claude 3 Haiku</option>
            </select>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
             <input 
              type="checkbox" 
              checked={config.maintenanceMode}
              onChange={e => setConfig({ ...config, maintenanceMode: e.target.checked })}
              style={{ width: 18, height: 18, accentColor: '#f87171' }}
             />
             <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Maintenance Mode (Lock Platform)</span>
          </label>
        </div>
      </div>

      <button 
        onClick={handleSave}
        disabled={saving}
        style={{ padding: '16px', background: 'var(--accent-primary)', color: '#000', border: 'none', borderRadius: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, cursor: saving ? 'not-allowed' : 'pointer' }}
      >
        <Save size={20} /> {saving ? 'Saving Changes...' : 'Save All Settings'}
      </button>
    </div>
  );
}
