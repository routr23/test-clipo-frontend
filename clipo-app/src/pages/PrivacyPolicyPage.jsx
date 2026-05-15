import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: 60, display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, maxWidth: 800, margin: '140px auto 0', padding: '0 24px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, marginBottom: 24, color: 'var(--text-primary)' }}>
            Clipo AI <span style={{ background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Privacy Policy</span>
          </h1>
          <div className="legal-content-card" style={{ 
            background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-xl)', 
            padding: '32px 40px', backdropFilter: 'blur(20px)', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 60 
          }}>
            <p style={{ marginBottom: 16 }}>Last updated: {new Date().toLocaleDateString()}</p>
            <h2 style={{ color: 'var(--text-primary)', marginTop: 24, marginBottom: 12 }}>1. Information We Collect</h2>
            <p style={{ marginBottom: 16 }}>We collect information you provide directly to us when creating an account or using our chat features. This includes your email address, username, and chat history.</p>
            <h2 style={{ color: 'var(--text-primary)', marginTop: 24, marginBottom: 12 }}>2. How We Use Information</h2>
            <p style={{ marginBottom: 16 }}>Your information is used to provide, maintain, and improve our services, including personalizing your AI tutoring experience.</p>
            <h2 style={{ color: 'var(--text-primary)', marginTop: 24, marginBottom: 12 }}>3. AI Processing</h2>
            <p style={{ marginBottom: 16 }}>Conversations are processed through Other AI Providers API to provide AI responses. We do not use your private study content to train public AI models.</p>
            <h2 style={{ color: 'var(--text-primary)', marginTop: 24, marginBottom: 12 }}>4. Data Security</h2>
            <p style={{ marginBottom: 16 }}>We implement industry-standard encryption and security measures to protect your personal information and chat logs.</p>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
