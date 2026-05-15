import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: 60, display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, maxWidth: 800, margin: '140px auto 0', padding: '0 24px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, marginBottom: 24, color: 'var(--text-primary)' }}>
            Clipo AI <span style={{ background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Terms & Conditions</span>
          </h1>
          <div className="legal-content-card" style={{ 
            background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-xl)', 
            padding: '32px 40px', backdropFilter: 'blur(20px)', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 60 
          }}>
            <p style={{ marginBottom: 16 }}>Last updated: {new Date().toLocaleDateString()}</p>
            <h2 style={{ color: 'var(--text-primary)', marginTop: 24, marginBottom: 12 }}>1. Acceptance of Terms</h2>
            <p style={{ marginBottom: 16 }}>By accessing and using Clipo AI, you accept and agree to be bound by the terms and provision of this agreement.</p>
            <h2 style={{ color: 'var(--text-primary)', marginTop: 24, marginBottom: 12 }}>2. Educational Purpose</h2>
            <p style={{ marginBottom: 16 }}>Our service is designed as an educational aid. You agree not to use our AI tutoring for academic dishonesty, cheating, or completing graded assignments submitted as your own work.</p>
            <h2 style={{ color: 'var(--text-primary)', marginTop: 24, marginBottom: 12 }}>3. User Conduct</h2>
            <p style={{ marginBottom: 16 }}>You are responsible for all content you transmit through the service. Abusive behavior, harassment, or attempts to bypass system restrictions may result in account termination.</p>
            <h2 style={{ color: 'var(--text-primary)', marginTop: 24, marginBottom: 12 }}>4. Service Availability</h2>
            <p style={{ marginBottom: 16 }}>While we strive for 99.9% uptime, we do not guarantee continuous, uninterrupted access to our services. We reserve the right to modify or discontinue any feature without notice.</p>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
