import { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import DashboardSection from '../components/admin/sections/DashboardSection';
import UserManagement from '../components/admin/sections/UserManagement';
import ChatMonitoring from '../components/admin/sections/ChatMonitoring';
import ModerationSecurity from '../components/admin/sections/ModerationSecurity';
import AnalyticsUsage from '../components/admin/sections/AnalyticsUsage';
import ReportsSection from '../components/admin/sections/ReportsSection';
import SettingsSection from '../components/admin/sections/SettingsSection';
import SEO from '../components/SEO';
import api from '../utils/api';

export default function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data.stats);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return <DashboardSection stats={stats} />;
      case 'users': return <UserManagement />;
      case 'chats': return <ChatMonitoring />;
      case 'moderation': return <ModerationSecurity />;
      case 'analytics': return <AnalyticsUsage />;
      case 'security': return <ModerationSecurity initialTab="security" />;
      case 'reports': return <ReportsSection />;
      case 'settings': return <SettingsSection />;
      default: return <DashboardSection stats={stats} />;
    }
  };

  return (
    <>
      <SEO title="Platform Control | Clipo AI Admin" />
      <AdminLayout activeSection={activeSection} setActiveSection={setActiveSection}>
        {renderSection()}
      </AdminLayout>
    </>
  );
}
