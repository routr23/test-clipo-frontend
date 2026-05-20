import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen, FlaskConical, Atom, Cpu, Globe, Calculator,
  DollarSign, Leaf, Sparkles, ArrowRight, Star, Users, Brain, Zap, Code, HelpCircle, ChevronDown
} from 'lucide-react';

const SUBJECTS = [
  { icon: Sparkles, name: 'General', color: '#6366f1', bg: 'rgba(99,102,241,0.1)', desc: 'General assistance, coding, creative ideas, and everyday tasks.' },
  { icon: BookOpen, name: 'Educational', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', desc: 'Step-by-step tutoring for academic topics, science, and math.' }
];

const STATS = [
  { icon: Users, value: '1000+', label: 'Users' },
  { icon: Brain, value: '2', label: 'Core Modes' },
  { icon: Zap, value: '< 2s', label: 'Response Time' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    { q: 'What exactly is Clipo AI?', a: 'Clipo AI is a personalized educational platform that uses specialized AI models to help you master any subject through interactive, context-aware conversations.' },
    { q: 'How is it different from general chatbots?', a: 'Clipo features a specialized Educational mode designed for step-by-step tutoring. It doesn\'t just give answers; it explains the "why" behind every concept.' },
    { q: 'Can I upload images of my problems?', a: 'Yes! You can attach images of handwritten notes, formulas, or diagrams, and Clipo will analyze them to provide detailed solutions.' },
    { q: 'Is my learning data private?', a: 'Absolutely. Your data is secure and used only to personalize your experience. We prioritize privacy above all else.' },
    { q: 'What modes are supported?', a: 'We offer two main modes: Educational for academic tutoring and General for everything else, including coding and creative tasks!' }
  ];

  return (
    <div className="landing-page">
      <SEO title="Home" description="Master any subject with Clipo AI. Your personalized smart educational tutor." />
      <Navbar />

      {/* Hero */}
      <section className="landing-hero">
        <div style={{ maxWidth: 800, width: '100%', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(25,195,125,0.1)', border: '1px solid rgba(25,195,125,0.25)',
              borderRadius: 20, padding: '5px 14px', marginBottom: 24
            }}
          >
            <Sparkles size={13} color="var(--accent-primary)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 500 }}>
              Powered by advanced AI models
            </span>
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Master Any Subject with{' '}
            <span className="hero-accent">Clipo AI</span>
          </motion.h1>

          <motion.p
            className="hero-sub"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Ask any academic question and get instant, detailed, AI-powered explanations
            tailored to your subject. Like ChatGPT, but built for learning.
          </motion.p>

          <motion.div
            className="hero-cta-row"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {isAuthenticated ? (
              <button onClick={() => navigate('/chat')} className="btn btn-primary" style={{ fontSize: '1rem', padding: '12px 28px' }}>
                Continue Learning <ArrowRight size={16} />
              </button>
            ) : (
              <>
                <button onClick={() => navigate('/register')} className="btn btn-primary" style={{ fontSize: '1rem', padding: '12px 28px' }}>
                  Start Free <ArrowRight size={16} />
                </button>
                <button onClick={() => navigate('/login')} className="btn btn-ghost" style={{ fontSize: '1rem', padding: '12px 28px' }}>
                  Sign In
                </button>
              </>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            className="stats-bar"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          >
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="stat-pill">
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(25,195,125,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={14} color="var(--accent-primary)" />
                </div>
                <div>
                  <strong>{value}</strong>
                  <span style={{ display: 'block' }}>{label}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Subjects */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 className="section-title">
          Pick Your <span style={{ color: 'var(--accent-primary)' }}>Subject</span>
        </h2>
        <p className="section-sub">Every subject has a tailored AI tutor ready to help you understand concepts deeply.</p>

        <motion.div
          className="subject-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {SUBJECTS.map(({ icon: Icon, name, color, bg, desc }) => (
            <motion.button
              key={name}
              className="subject-card"
              onClick={() => navigate(`/chat?subject=${encodeURIComponent(name)}`)}
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ y: -3 }}
            >
              <div className="subject-icon" style={{ background: bg }}>
                <Icon size={20} color={color} />
              </div>
              <div className="subject-name">{name}</div>
              <div className="subject-desc">{desc}</div>
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '80px 24px', maxWidth: 740, margin: '0 auto' }}>
        <h2 className="section-title" style={{ marginBottom: 8 }}>
          Got <span style={{ color: 'var(--accent-primary)' }}>Questions?</span>
        </h2>
        <p className="section-sub">Everything you need to know about Clipo AI.</p>
        <div>
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="faq-item"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <div className="faq-q" onClick={() => setActiveIndex(activeIndex === i ? null : i)}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <HelpCircle size={16} color="var(--accent-primary)" />
                  {faq.q}
                </span>
                <motion.div animate={{ rotate: activeIndex === i ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                  <ChevronDown size={18} />
                </motion.div>
              </div>
              <AnimatePresence>
                {activeIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
                  >
                    <div className="faq-a">{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.4 }}
          style={{
            maxWidth: 560, margin: '0 auto',
            background: '#2a2a2a', border: '1px solid var(--border-glass)',
            borderRadius: 20, padding: '48px 36px'
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: 14 }}>🎓</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 12 }}>
            Ready to Learn Smarter?
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24, maxWidth: 380, margin: '0 auto 24px' }}>
            {isAuthenticated
              ? 'Continue your journey and get expert answers to your toughest questions.'
              : 'Join students getting instant, expert answers to their toughest questions.'}
          </p>
          {isAuthenticated ? (
            <button onClick={() => navigate('/chat')} className="btn btn-primary">
              Ask AI <Sparkles size={15} />
            </button>
          ) : (
            <button onClick={() => navigate('/register')} className="btn btn-primary">
              Create Free Account <ArrowRight size={15} />
            </button>
          )}
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
