import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Activity, AlertCircle, FileText, Scale, ExternalLink, Mail, Clock, User, XCircle } from 'lucide-react';
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

export default function TermsPage() {
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
            Terms of <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontWeight: 400 }}>Service</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: 0 }}
          >
            We've designed our terms to be simple, transparent, and focused on protecting both our users and the integrity of our AI systems.
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="terms-container">
        
        {/* Navigation Sidebar (Desktop) */}
        <aside className="terms-nav">
          <a href="#intro" className="terms-nav-link">Introduction</a>
          <a href="#eligibility" className="terms-nav-link">Eligibility</a>
          <a href="#accounts" className="terms-nav-link">User Accounts</a>
          <a href="#usage" className="terms-nav-link">Acceptable Use</a>
          <a href="#ai-disclaimer" className="terms-nav-link">AI Disclaimer</a>
          <a href="#content" className="terms-nav-link">User Content</a>
          <a href="#moderation" className="terms-nav-link">Moderation</a>
          <a href="#liability" className="terms-nav-link">Liability</a>
        </aside>

        {/* Main Legal Text */}
        <main>
          
          <Section id="intro" icon={FileText} title="1. Introduction">
            <p>Welcome to Clipo AI. These Terms of Service ("Terms") govern your access to and use of our AI-powered chatbot platform, including our website and any associated services (collectively, the "Service").</p>
            <p>By creating an account or using the Service, you confirm that you have read, understood, and agreed to be bound by these Terms. If you do not agree, you must immediately cease all use of the Service.</p>
          </Section>

          <Section id="eligibility" icon={User} title="2. Eligibility">
            <p>You must be at least 13 years old (or the minimum age required in your country) to use Clipo AI. If you are under 18, you must have permission from a parent or legal guardian.</p>
            <p>You represent and warrant that you have the legal capacity to enter into these Terms and that your use of the Service complies with all applicable laws and regulations.</p>
          </Section>

          <Section id="accounts" icon={Lock} title="3. User Accounts">
            <p>To access certain features, you must register for an account. You are solely responsible for maintaining the confidentiality of your credentials and for all activities that occur under your account.</p>
            <ul>
              <li>You must provide accurate and complete information during registration.</li>
              <li>You may not share your account or use the account of another person.</li>
              <li>We reserve the right to suspend or terminate accounts that provide false information or violate security protocols.</li>
            </ul>
          </Section>

          <Section id="usage" icon={Shield} title="4. Acceptable Use Policy">
            <p>We aim to foster a safe and productive environment. You agree not to engage in any of the following prohibited activities:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '16px' }}>
              {[
                "Illegal activity or spamming",
                "Harassment or hate speech",
                "Reverse engineering AI models",
                "Bypassing safety filters",
                "Distributing malware",
                "Automated bulk querying"
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
                  <XCircle size={14} color="var(--accent-pink)" style={{ opacity: 0.5 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section id="ai-disclaimer" icon={AlertCircle} title="5. AI Service Disclaimer">
            <div className="terms-alert-card">
              <p style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: 8 }}>Important Notice on AI Outputs</p>
              <p style={{ fontSize: '0.85rem', marginBottom: 12 }}>Clipo AI utilizes advanced large language models. Please be aware of the following limitations:</p>
              <ul style={{ fontSize: '0.85rem', marginBottom: 0 }}>
                <li>AI may generate inaccurate, misleading, or biased information.</li>
                <li>Outputs do not constitute professional medical, legal, or financial advice.</li>
                <li>You must verify all AI-generated facts independently before taking action.</li>
                <li>We do not guarantee the factual accuracy or reliability of any response.</li>
              </ul>
            </div>
          </Section>

          <Section id="content" icon={Activity} title="6. User Content">
            <p>You retain all ownership rights to the prompts and data you input into the Service ("User Content").</p>
            <p>By using the Service, you grant Clipo AI a limited license to process and store your User Content to provide the Service, improve performance, and ensure compliance with safety policies. We do not sell your data to third parties.</p>
          </Section>

          <Section id="moderation" icon={Shield} title="7. Moderation & Safety">
            <p>To protect our community, we employ automated and manual moderation systems. Prompts that violate our Acceptable Use Policy may be flagged, blocked, or reported.</p>
            <p>Repeated violations will result in automatic account suspension or permanent banning. We reserve the right to remove any content that we deem harmful or inappropriate at our sole discretion.</p>
          </Section>

          <Section id="liability" icon={Scale} title="8. Limitation of Liability">
            <p>CLIPO AI AND ITS AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF YOUR USE OF THE SERVICE OR AI-GENERATED OUTPUTS.</p>
            <p>THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK.</p>
          </Section>

          <Section icon={Mail} title="9. Contact Information">
            <p>If you have any questions or concerns regarding these Terms, please contact our legal team at:</p>
            <div className="terms-contact-card">
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Support Email</div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>support@clipo.ai</div>
              </div>
              <button style={{ 
                padding: '12px 24px', background: 'var(--accent-primary)', color: 'var(--bg-primary)', 
                border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' 
              }}>
                Contact Support
              </button>
            </div>
          </Section>

        </main>
      </div>

      <Footer />
    </div>
  );
}
