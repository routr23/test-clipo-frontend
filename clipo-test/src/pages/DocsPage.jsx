import React from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, Sparkles, Cpu, Shield, 
  MessageSquare, Image as ImageIcon, 
  Zap, Lightbulb, CheckCircle2, 
  ChevronRight, ArrowRight, BookOpen,
  Keyboard, Settings, Globe
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import './DocsPage.css';

export default function DocsPage() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <SEO 
        title="Documentation - Mastering Clipo AI" 
        description="The ultimate guide to using Clipo AI for education, coding, and general assistance. Learn about models, features, and pro tips." 
      />
      <Navbar />
      
      <div className="docs-layout">
        {/* Sidebar Navigation */}
        <aside className="docs-sidebar">
          <div className="docs-nav-group">
            <div className="docs-nav-label">Getting Started</div>
            <a href="#welcome" className="docs-nav-item active">Welcome to Clipo</a>
            <a href="#quickstart" className="docs-nav-item">Quickstart Guide</a>
            <a href="#auth" className="docs-nav-item">Authentication</a>
          </div>

          <div className="docs-nav-group">
            <div className="docs-nav-label">AI Capabilities</div>
            <a href="#modes" className="docs-nav-item">Tutoring Modes</a>
            <a href="#image-vision" className="docs-nav-item">Vision & Images</a>
            <a href="#formatting" className="docs-nav-item">Markdown & Math</a>
          </div>

          <div className="docs-nav-group">
            <div className="docs-nav-label">Power User Features</div>
            <a href="#shortcuts" className="docs-nav-item">Keyboard Shortcuts</a>
            <a href="#prompts" className="docs-nav-item">Prompt Engineering</a>
            <a href="#settings" className="docs-nav-item">Customization</a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="docs-main">
          <article className="docs-article">
            
            {/* Header */}
            <header className="docs-header">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '-0.04em' }}>
                  Documentation
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Everything you need to know about the most advanced AI educational platform.
                </p>
              </motion.div>
            </header>

            {/* Welcome Section */}
            <section id="welcome" className="docs-section">
              <h2>Welcome to Clipo</h2>
              <div className="docs-text">
                <p>Clipo AI is a state-of-the-art artificial intelligence platform built for students, developers, and curious minds. We bridge the gap between complex AI models and intuitive educational workflows.</p>
                <div className="docs-image-mockup">
                  <div style={{ textAlign: 'center' }}>
                    <Sparkles size={48} color="var(--accent-primary)" style={{ marginBottom: 16, opacity: 0.5 }} />
                    <div style={{ color: '#444', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Clipo Intelligence System v2.0</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Quickstart Section */}
            <section id="quickstart" className="docs-section">
              <h2>Quickstart Guide</h2>
              <p className="docs-text">Get up and running with Clipo in under 60 seconds.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ padding: 20, background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>1. Initialize Session</div>
                  <p style={{ fontSize: '0.9rem', margin: 0 }}>Select a subject from the home dashboard (e.g., Physics, Computer Science) to load specialized context.</p>
                </div>
                <div style={{ padding: 20, background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>2. Input Inquiry</div>
                  <p style={{ fontSize: '0.9rem', margin: 0 }}>Type your question in the chat bar at the bottom. Use Shift+Enter for multiple paragraphs.</p>
                </div>
                <div style={{ padding: 20, background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>3. Iterate & Save</div>
                  <p style={{ fontSize: '0.9rem', margin: 0 }}>AI responses are saved automatically. Access them anytime from the "History" tab in the navbar.</p>
                </div>
              </div>
            </section>

            {/* Authentication Section */}
            <section id="auth" className="docs-section">
              <h2>Authentication</h2>
              <div className="docs-text">
                <p>We support secure, industry-standard authentication methods to protect your educational data.</p>
                <ul style={{ fontSize: '0.9rem' }}>
                  <li><strong>Google OAuth:</strong> One-click login using your existing Google account.</li>
                  <li><strong>Email Login:</strong> Standard secure email/password combination.</li>
                  <li><strong>Session Persistence:</strong> Your login remains active across multiple browser restarts for seamless access.</li>
                </ul>
              </div>
            </section>

            {/* Modes Section */}
            <section id="modes" className="docs-section">
              <h2>Tutoring Modes</h2>
              <p className="docs-text">We provide specialized environments to ensure you get the most accurate assistance for your specific needs.</p>
              
              <div className="docs-feature-card">
                <div className="docs-feature-icon">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: 8 }}>Educational Mode</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Optimized for academic integrity. Instead of just giving answers, the AI acts as a Socratic tutor, guiding you through concepts, explaining formulas, and helping you solve problems step-by-step.
                  </p>
                </div>
              </div>

              <div className="docs-feature-card">
                <div className="docs-feature-icon">
                  <Cpu size={24} />
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: 8 }}>General Mode</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Your all-purpose creative and technical assistant. Perfect for writing code, brainstorming essays, summarizing long documents, or just having a deep conversation about any topic.
                  </p>
                </div>
              </div>
            </section>

            {/* Vision Section */}
            <section id="image-vision" className="docs-section">
              <h2>Vision & Image Support</h2>
              <div className="docs-text">
                <p>Stuck on a handwritten math problem or a complex diagram? Use our Vision feature to get instant analysis.</p>
                <div className="docs-code-block">
                  // How to use Vision:<br/>
                  1. Click the Image icon in the chat bar<br/>
                  2. Upload a PNG or JPG (max 10MB)<br/>
                  3. Add a prompt: "Solve the problem shown in this image"
                </div>
              </div>
            </section>

            {/* Formatting Section */}
            <section id="formatting" className="docs-section">
              <h2>Markdown & Math</h2>
              <p className="docs-text">Clipo supports full GFM (GitHub Flavored Markdown) and LaTeX equations.</p>
              <div className="docs-code-block">
                {`// LaTeX Example:`}<br/>
                {`When $a \\ne 0$, there are two solutions to $ax^2 + bx + c = 0$`} <br/>
                {`and they are $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$`}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Equations are rendered beautifully using KaTeX, making complex scientific papers easy to read.</p>
            </section>

            {/* Shortcuts Section */}
            <section id="shortcuts" className="docs-section">
              <h2>Keyboard Shortcuts</h2>
              <p className="docs-text">Navigate Clipo like a pro with these time-saving commands.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginTop: '24px' }}>
                <div style={{ padding: '16px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: 4 }}>SUBMIT PROMPT</div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Enter</div>
                </div>
                <div style={{ padding: '16px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: 4 }}>NEW LINE</div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Shift + Enter</div>
                </div>
                <div style={{ padding: '16px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: 4 }}>NEW CHAT</div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Ctrl + K</div>
                </div>
                <div style={{ padding: '16px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: 4 }}>SIDEBAR</div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{`Ctrl + \\`}</div>
                </div>
              </div>
            </section>

            {/* Prompts Section */}
            <section id="prompts" className="docs-section">
              <h2>Prompt Engineering</h2>
              <div className="docs-text">
                <p>To get the best out of AI, specificity is key. Use the following framework for your prompts:</p>
                <div className="docs-feature-card">
                  <div className="docs-feature-icon"><MessageSquare size={20} /></div>
                  <div style={{ fontSize: '0.9rem' }}>
                    <strong>Role + Task + Constraint:</strong> "As a senior Physics teacher, explain Quantum Entanglement to a 10th-grade student using an analogy about socks. Keep it under 200 words."
                  </div>
                </div>
              </div>
            </section>

            {/* Settings Section */}
            <section id="settings" className="docs-section">
              <h2>Customization</h2>
              <div className="docs-text">
                <p>Personalize your environment via the <strong>Profile</strong> menu.</p>
                <ul style={{ fontSize: '0.9rem' }}>
                  <li><strong>Theme:</strong> Toggle between high-contrast Dark Mode and soft Light Mode.</li>
                  <li><strong>Preferences:</strong> Manage account data and subscription status.</li>
                  <li><strong>Feedback:</strong> Report bugs or request new AI features directly to our team.</li>
                </ul>
              </div>
            </section>

            {/* Footer Navigation */}
            <footer className="docs-footer">
              <div></div>
              <a href="/chat" className="docs-next-link">
                <span className="docs-next-label">Next Step</span>
                <span className="docs-next-title">Start Your First Chat <ArrowRight size={16} inline /></span>
              </a>
            </footer>

          </article>
        </main>
      </div>

      <Footer />
    </div>
  );
}
