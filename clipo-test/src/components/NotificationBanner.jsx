import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';

export default function NotificationBanner() {
  const [config, setConfig] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  // Hide on auth pages
  const isAuthPage = ['/login', '/register', '/admin/login'].includes(location.pathname);

  useEffect(() => {
    if (!isAuthPage) fetchConfig();
  }, [location.pathname]);

  if (isAuthPage) return null;

  const fetchConfig = async () => {
    try {
      const { data } = await api.get('/admin/config');
      if (data.config && data.config.isNotificationActive && data.config.notificationText) {
        const lastUpdated = new Date(data.config.notificationUpdatedAt).getTime();
        const dismissedAt = parseInt(localStorage.getItem('clipo_notif_dismissed_at') || '0');
        
        // Show if it's never been dismissed OR if admin updated it AFTER the last dismissal
        if (lastUpdated > dismissedAt) {
          setConfig(data.config);
          setIsVisible(true);
        }
      }
    } catch (err) {
      console.error('Failed to fetch billboard config:', err);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('clipo_notif_dismissed_at', Date.now().toString());
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && config && (
        <motion.div 
          initial={{ y: -50, x: '-50%', opacity: 0 }} 
          animate={{ y: 0, x: '-50%', opacity: 1 }} 
          exit={{ y: -50, x: '-50%', opacity: 0 }}
          className="global-notification-banner"
          style={{ 
            position: 'fixed',
            top: 20,
            left: '50%',
            background: 'var(--accent-primary)', 
            color: 'var(--bg-primary)',
            zIndex: 9999,
            borderRadius: 30,
            padding: '4px 8px',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
            maxWidth: '90%',
            width: 'fit-content'
          }}
        >
          <div 
            onClick={() => {
              if (config.notificationTargetUrl) {
                window.open(config.notificationTargetUrl, '_blank', 'noopener,noreferrer');
              }
            }}
            style={{ 
              padding: '6px 40px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: 10,
              fontSize: '0.85rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              position: 'relative',
              cursor: config.notificationTargetUrl ? 'pointer' : 'default'
            }}
          >
            <Sparkles size={16} />
            <span>{config.notificationText}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss();
              }}
              style={{ 
                position: 'absolute', 
                right: 12, 
                top: '50%', 
                transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.1)',
                border: 'none',
                borderRadius: '50%',
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'inherit',
                zIndex: 2
              }}
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
