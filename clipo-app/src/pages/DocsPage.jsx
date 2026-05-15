import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { 
  BookOpen, Code, Lightbulb, MessageSquare, 
  Rocket, ShieldCheck, Zap, HelpCircle, 
  CheckCircle2, Sparkles, Image as ImageIcon,
  Cpu
} from 'lucide-react';

export default function DocsPage() {
  const sections = [
    { 
      id: 'getting-started',
      icon: Rocket, 
      title: 'Getting Started', 
      content: [
        'Create an account using your email or Google Auth to save your chat history.',
        'Choose a subject from the home page or the chat dropdown to start a focused session.',
        'Type your question in the chat bar and press Enter.'
      ]
    },
    { 
      id: 'how-it-works',
      icon: Cpu, 
      title: 'How it Works', 
      content: [
        'Clipo AI uses advanced LLMs tailored for educational contexts.',
        'Each subject (Mathematics, Coding, etc.) uses a specialized system prompt for accuracy.',
        'The "General" subject provides broad assistance across all topics.'
      ]
    },
    { 
      id: 'features',
      icon: Sparkles, 
      title: 'Key Features', 
      content: [
        'Subject-Specific Tutoring: Context-aware answers based on your chosen field.',
        'Image Support: Upload screenshots of problems or diagrams for the AI to analyze.',
        'Markdown & Code highlighting: Beautifully formatted equations and code snippets.',
        'Persistent History: Access your previous conversations anytime from the History page.'
      ]
    },
    { 
      id: 'pro-tips',
      icon: Lightbulb, 
      title: 'Pro Tips for Students', 
      content: [
        'Be Specific: Instead of "How does gravity work?", try "Explain the difference between Newtonian and Einsteinian gravity."',
        'Use the Image tool: If a math problem is complex, take a photo and upload it.',
        'Formatting: Use Shift+Enter for line breaks to keep your prompts organized.',
        'Iterative Learning: Ask follow-up questions like "Can you explain that last point in simpler terms?".'
      ]
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <SEO 
        title="Documentation" 
        description="Learn how to get the most out of Clipo AI. Step-by-step guides, pro tips, and feature explanations for students." 
      />
      <Navbar />
      
      <main style={{ flex: 1, paddingTop: '140px', paddingBottom: '100px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '80px' }}
          >
            <div className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', marginBottom: '16px', border: '1px solid var(--border-accent)' }}>
              <HelpCircle size={14} style={{ marginRight: 6 }} /> Documentation
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 800, marginBottom: '24px', lineHeight: 1.1 }}>
              Master <span style={{ background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Clipo AI</span>
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
              The complete guide to using your personalized AI tutor effectively and mastering every subject.
            </p>
          </motion.div>

          {/* Docs Grid */}
          <div className="docs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px', marginBottom: '80px' }}>
            {sections.map((sec, i) => (
              <motion.div 
                key={sec.id} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="docs-card"
                style={{
                  background: 'var(--bg-card)', 
                  border: '1px solid var(--border-glass)', 
                  borderRadius: 'var(--radius-xl)', 
                  padding: '40px', 
                  backdropFilter: 'blur(20px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <sec.icon size={24} color="var(--accent-primary)" />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {sec.title}
                  </h3>
                </div>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {sec.content.map((item, idx) => (
                    <li key={idx} style={{ display: 'flex', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      <CheckCircle2 size={18} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* FAQ / Final CTA */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="docs-cta-card"
            style={{ 
              background: 'var(--gradient-card)', 
              border: '1px solid var(--border-glass)', 
              borderRadius: 'var(--radius-xl)', 
              padding: '60px 40px', 
              textAlign: 'center' 
            }}
          >
            <h2 style={{ fontSize: '2.5rem', marginBottom: '24px', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>Still Have Questions?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.1rem' }}>Our support team is always here to help you on your learning journey.</p>
            <a href="mailto:routrvaishnav@gmail.com" className="btn btn-primary" style={{ padding: '16px 40px', fontSize: '1rem' }}>
              Contact Support
            </a>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
