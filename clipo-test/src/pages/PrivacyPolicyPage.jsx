import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Lock, Activity, AlertCircle, FileText, 
  Database, Globe, Users, Bell, Eye, EyeOff, 
  Settings, UserCheck, Clock, Mail 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './LegalPages.css';

const Section = ({ icon: Icon, title, children, id }) => (
  <motion.div 
    id={id}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="terms-section"
  >
    <div className="terms-section-header">
      <div className="terms-icon-box">
        <Icon size={20} color="var(--text-primary)" />
      </div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{title}</h2>
    </div>
    <div className="terms-content">
      {children}
    </div>
  </motion.div>
);

export default function PrivacyPolicyPage() {
  const lastUpdated = "May 16, 2026";

  return (
    <div className="terms-page">
      <Navbar />

      {/* Hero Section */}
      <div className="terms-hero">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}
          >
            <span className="terms-badge">Legal Documentation</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <Clock size={12} />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 24px', letterSpacing: '-0.03em' }}
          >
            Privacy <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontWeight: 400 }}>Policy</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: 0 }}
          >
            At Clipo AI, your privacy is our priority. We are committed to being transparent about how we collect, use, and protect your data in the era of artificial intelligence.
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="terms-container">
        
        {/* Navigation Sidebar (Desktop) */}
        <aside className="terms-nav">
          <a href="#intro" className="terms-nav-link">Introduction</a>
          <a href="#collection" className="terms-nav-link">Collection</a>
          <a href="#usage" className="terms-nav-link">Usage</a>
          <a href="#ai-processing" className="terms-nav-link">AI Systems</a>
          <a href="#sharing" className="terms-nav-link">Third Parties</a>
          <a href="#retention" className="terms-nav-link">Retention</a>
          <a href="#security" className="terms-nav-link">Security</a>
          <a href="#rights" className="terms-nav-link">Your Rights</a>
        </aside>

        {/* Main Legal Text */}
        <main>
          
          <Section id="intro" icon={Eye} title="1. Introduction">
            <p>Clipo AI ("we", "us", or "our") is an AI-powered educational platform designed to enhance your learning experience. This Privacy Policy explains how we handle your personal information when you interact with our Service.</p>
            <p>By using Clipo AI, you agree to the collection and use of information in accordance with this policy. We recommend reading this document carefully to understand our commitment to your data privacy.</p>
          </Section>

          <Section id="collection" icon={Database} title="2. Information We Collect">
            <p>We collect several types of information to provide and improve our AI services:</p>
            
            <div style={{ marginTop: '24px' }}>
              <h4 style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 700, marginBottom: 12 }}>Account & User Content</h4>
              <ul style={{ fontSize: '0.9rem' }}>
                <li><strong>Profile Info:</strong> Name, email address, and authentication provider details.</li>
                <li><strong>AI Conversations:</strong> Chat prompts, responses, and conversation history.</li>
                <li><strong>Media:</strong> Uploaded files or images processed by the AI.</li>
              </ul>
            </div>

            <div style={{ marginTop: '24px' }}>
              <h4 style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 700, marginBottom: 12 }}>Technical & Usage Data</h4>
              <ul style={{ fontSize: '0.9rem' }}>
                <li><strong>Network:</strong> IP address, device type, browser information, and timezone.</li>
                <li><strong>Usage:</strong> Features accessed, token consumption, and system response times.</li>
                <li><strong>Activity:</strong> Session duration and interaction analytics to prevent abuse.</li>
              </ul>
            </div>
          </Section>

          <Section id="usage" icon={Activity} title="3. How We Use Information">
            <p>We utilize your data for the following essential purposes:</p>
            <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', padding: 0, listStyle: 'none' }}>
              {[
                "Providing AI-powered tutoring",
                "Improving model accuracy",
                "Moderation and safety",
                "Personalizing user experience",
                "Debugging and performance",
                "Security monitoring"
              ].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)' }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="ai-processing" icon={Activity} title="4. AI & Automated Processing">
            <div className="terms-alert-card" style={{ borderLeftColor: 'var(--accent-blue)' }}>
              <p style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: 8 }}>AI Safety & Disclosures</p>
              <p style={{ fontSize: '0.85rem', marginBottom: 12 }}>Our platform uses automated systems to process your data. Please note:</p>
              <ul style={{ fontSize: '0.85rem', marginBottom: 0 }}>
                <li>Prompts are automatically scanned by moderation systems to detect harmful content.</li>
                <li>Conversations may be logged to improve our AI's educational accuracy.</li>
                <li>We strongly advise against sharing sensitive personal information (PII) within chats.</li>
                <li>External AI infrastructure providers may process anonymized data for generation.</li>
              </ul>
            </div>
          </Section>

          <Section id="sharing" icon={Globe} title="5. Third-Party Services">
            <p>We never sell your data to third-party advertisers. However, we work with trusted partners to operate our platform:</p>
            <ul style={{ fontSize: '0.9rem' }}>
              <li><strong>AI Providers:</strong> OpenAI, Anthropic, or Gemini for generating responses.</li>
              <li><strong>Infrastructure:</strong> Vercel or AWS for cloud hosting and data storage.</li>
              <li><strong>Analytics:</strong> PostHog or Google Analytics for performance monitoring.</li>
              <li><strong>Payments:</strong> Stripe for secure subscription processing.</li>
            </ul>
          </Section>

          <Section id="retention" icon={Clock} title="6. Data Retention">
            <p>We retain your chat history as long as your account is active to provide you with a continuous learning context. Technical logs are typically retained for 30–90 days for security purposes.</p>
            <p>Upon account deletion, your personal data is purged from our active databases, though some anonymized metadata may persist for internal system analytics.</p>
          </Section>

          <Section id="security" icon={Lock} title="7. Security Measures">
            <p>We implement multi-layered security to keep your information safe:</p>
            <ul style={{ fontSize: '0.9rem' }}>
              <li>End-to-end encryption for data in transit.</li>
              <li>Advanced access controls for administrative roles.</li>
              <li>Continuous security logging and monitoring.</li>
              <li>Secure OAuth2 authentication via trusted providers.</li>
            </ul>
          </Section>

          <Section id="rights" icon={UserCheck} title="8. Your Rights">
            <p>As a user of Clipo AI, you have the following rights regarding your privacy:</p>
            <ul style={{ fontSize: '0.9rem' }}>
              <li><strong>Access:</strong> Request a copy of the data we hold about you.</li>
              <li><strong>Erasure:</strong> Request the deletion of your account and conversation history.</li>
              <li><strong>Management:</strong> Update your profile settings directly through the Dashboard.</li>
              <li><strong>Inquiry:</strong> Contact us anytime regarding our data processing practices.</li>
            </ul>
          </Section>

          <Section icon={Mail} title="9. Contact Information">
            <p>For any privacy-related inquiries or data requests, please reach out to our dedicated privacy team:</p>
            <div className="terms-contact-card">
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Privacy Support</div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>privacy@clipo.ai</div>
              </div>
              <button style={{ 
                padding: '12px 24px', background: 'var(--accent-primary)', color: 'var(--bg-primary)', 
                border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' 
              }}>
                Email Privacy Team
              </button>
            </div>
          </Section>

        </main>
      </div>

      <Footer />
    </div>
  );
}
