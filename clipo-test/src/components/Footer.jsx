import { Link } from 'react-router-dom';
import { Mail, MapPin, Github, Instagram } from 'lucide-react';
import LogoIcon from './LogoIcon';

const DiscordIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.27 4.57c-1.3-.6-2.69-1.05-4.14-1.3-.18.32-.38.75-.53 1.1a15.2 15.2 0 0 0-4.57 0c-.14-.35-.35-.78-.52-1.1-1.45.25-2.84.7-4.14 1.3-2.63 3.93-3.34 7.76-2.99 11.54.12.16.24.32.37.47a16.52 16.52 0 0 0 5.04 2.54c.42-.58.79-1.2 1.1-1.86a11.1 11.1 0 0 1-1.57-.75c.13-.1.26-.2.39-.3a11.76 11.76 0 0 0 10.15 0c.13.1.26.2.39.3-.5.33-1.03.58-1.57.75.31.66.68 1.28 1.1 1.86a16.52 16.52 0 0 0 5.04-2.54c.41-4.38-.72-8.17-2.99-11.54ZM8.29 15.13c-.98 0-1.78-.9-1.78-2.02s.78-2.01 1.78-2.01c1.01 0 1.8.9 1.78 2.01 0 1.12-.78 2.02-1.78 2.02Zm7.42 0c-.98 0-1.78-.9-1.78-2.02s.78-2.01 1.78-2.01c1.01 0 1.8.9 1.78 2.01 0 1.12-.78 2.02-1.78 2.02Z" />
  </svg>
);

const FL = ({ to, children }) => (
  <Link to={to} className="footer-link">{children}</Link>
);

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <LogoIcon size={24} />
          <span className="footer-brand">Clipo AI</span>
        </div>

        <div className="footer-links">
          <FL to="/">Home</FL>
          <FL to="/about">About</FL>
          <FL to="/docs">Docs</FL>
          <FL to="/help">Help</FL>
          <FL to="/feedback">Feedback</FL>
          <FL to="/privacy">Privacy</FL>
          <FL to="/terms">Terms</FL>
        </div>

        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <a href="mailto:routrvaishnav@gmail.com" className="footer-link" title="Email">
            <Mail size={16} />
          </a>
          <a href="https://github.com/vaishnavverma" target="_blank" rel="noopener noreferrer" className="footer-link">
            <Github size={16} />
          </a>
          <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="footer-link">
            <DiscordIcon size={16} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-link">
            <Instagram size={16} />
          </a>
        </div>
      </div>
      <div className="footer-copy">
        © {new Date().getFullYear()} Clipo AI. All rights reserved. &nbsp;·&nbsp;{' '}
        <Link to="/admin/login" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.5 }}
          onMouseEnter={e => e.target.style.opacity = 1}
          onMouseLeave={e => e.target.style.opacity = 0.5}>Admin</Link>
      </div>
    </footer>
  );
}
