import { motion } from 'framer-motion';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import {
    HelpCircle, MessageCircle, Zap, ShieldCheck,
    AlertCircle, CheckCircle2, ChevronDown, BookOpen,
    Lightbulb, Mail, ExternalLink
} from 'lucide-react';

export default function HelpPage() {
    const [expandedFAQ, setExpandedFAQ] = useState(null);

    const faqs = [
        {
            q: "How do I create an account?",
            a: "You can sign up using either your email or Google account. Click the 'Sign Up' button on the landing page, enter your details, and you're ready to start learning!"
        },
        {
            q: "How do I choose a subject?",
            a: "When you start a chat session, you'll see a dropdown menu with all available subjects. Select the subject that matches your question for the most accurate and tailored responses."
        },
        {
            q: "Can I access my chat history?",
            a: "Yes! All your conversations are saved automatically. Visit the 'History' page to view, search, and revisit any previous chat session."
        },
        {
            q: "How do I upload an image with my question?",
            a: "In the chat interface, look for the image icon next to the message input field. Click it to upload an image of a problem, diagram, or equation, and the AI will analyze it for you."
        },
        {
            q: "Is my data secure and private?",
            a: "Absolutely. We use industry-standard encryption to protect your data. Your chat history and personal information are never shared with third parties."
        },
        {
            q: "What should I do if I'm not happy with an answer?",
            a: "You can ask follow-up questions to clarify or request a different explanation. You can also submit feedback through the 'Feedback' page to help us improve."
        },
        {
            q: "How do I delete my account?",
            a: "Visit your dashboard settings and look for the account management section. You'll find the option to delete your account there. Note that this action is permanent."
        },
        {
            q: "What devices can I use Clipo AI on?",
            a: "Clipo AI works on any device with a web browser - desktop, tablet, or mobile. Your chat history syncs across all devices."
        },
        {
            q: "Is there a way to get personalized support?",
            a: "Yes! For detailed assistance, please contact us at routrvaishnav@gmail.com or use the contact form at the bottom of this page."
        }
    ];

    const commonIssues = [
        {
            icon: AlertCircle,
            title: "Can't Log In",
            steps: [
                "Clear your browser cache and cookies.",
                "Try using a different browser or incognito mode.",
                "Reset your password if using email login.",
                "If using Google Auth, ensure your Google account is active.",
                "Contact support if the issue persists."
            ]
        },
        {
            icon: Zap,
            title: "Slow Response Times",
            steps: [
                "Check your internet connection speed.",
                "Close other browser tabs and applications.",
                "Try refreshing the page.",
                "If the AI is busy, wait a moment and try again.",
                "Report persistent issues to our support team."
            ]
        },
        {
            icon: MessageCircle,
            title: "Image Upload Not Working",
            steps: [
                "Ensure your image file is under 5MB.",
                "Supported formats: JPG, PNG, GIF, WEBP.",
                "Check your internet connection.",
                "Try uploading from a different browser or device.",
                "Contact support with details about the error."
            ]
        },
        {
            icon: BookOpen,
            title: "History Not Saving",
            steps: [
                "Make sure you're logged in with an account.",
                "Check that your browser allows cookies.",
                "Refresh the page to see if sessions appear.",
                "Clear browser cache and try again.",
                "Reach out to support if history is still missing."
            ]
        },
        {
            icon: Lightbulb,
            title: "Poor Answer Quality",
            steps: [
                "Select the correct subject for your question.",
                "Be specific and detailed in your questions.",
                "Provide context about what you've already tried.",
                "Ask follow-up questions to clarify.",
                "Leave feedback so we can improve our AI."
            ]
        },
        {
            icon: ShieldCheck,
            title: "Security or Privacy Concerns",
            steps: [
                "Review our Privacy Policy and Terms of Service.",
                "Check your account security settings.",
                "Enable two-factor authentication if available.",
                "Report any suspicious activity immediately.",
                "Contact our security team: routrvaishnav@gmail.com"
            ]
        }
    ];

    const tips = [
        {
            title: "Be Specific with Questions",
            description: "Instead of 'Explain photosynthesis', try 'Can you explain the light-dependent reactions of photosynthesis and how they differ from the Calvin cycle?'"
        },
        {
            title: "Use Subject Categories",
            description: "Selecting the right subject ensures you get specialized, accurate responses tailored to that field."
        },
        {
            title: "Ask Follow-up Questions",
            description: "Don't hesitate to ask for clarification, simpler explanations, or additional examples. The AI adapts to your learning needs."
        },
        {
            title: "Leverage Image Uploads",
            description: "Complex diagrams, handwritten notes, or equation screenshots can be analyzed by the AI for more personalized help."
        },
        {
            title: "Review Your History",
            description: "Use the History page to revisit previous explanations and build upon them in future sessions."
        },
        {
            title: "Provide Feedback",
            description: "Your feedback helps us improve. If an answer was helpful or needs improvement, let us know through the Feedback page."
        }
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
            <SEO
                title="Help Center"
                description="Get help using Clipo AI. Find answers to common questions, troubleshooting guides, and support resources."
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
                            <HelpCircle size={14} style={{ marginRight: 6 }} /> Help Center
                        </div>
                        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 800, marginBottom: '24px', lineHeight: 1.1 }}>
                            How Can We <span style={{ background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Help You?</span>
                        </h1>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                            Find answers to your questions and troubleshoot common issues with our comprehensive help guides.
                        </p>
                    </motion.div>

                    {/* FAQs Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        style={{ marginBottom: '100px' }}
                    >
                        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, marginBottom: '40px', textAlign: 'center', color: 'var(--text-primary)' }}>
                            Frequently Asked Questions
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {faqs.map((faq, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05 }}
                                    style={{
                                        background: 'var(--bg-card)',
                                        border: '1px solid var(--border-glass)',
                                        borderRadius: 'var(--radius-lg)',
                                        overflow: 'hidden',
                                        backdropFilter: 'blur(20px)'
                                    }}
                                >
                                    <button
                                        onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                                        style={{
                                            width: '100%',
                                            padding: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            gap: '16px',
                                            background: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>
                                            {faq.q}
                                        </span>
                                        <ChevronDown
                                            size={20}
                                            style={{
                                                flexShrink: 0,
                                                color: 'var(--accent-primary)',
                                                transform: expandedFAQ === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                                                transition: 'transform 0.3s ease'
                                            }}
                                        />
                                    </button>

                                    {expandedFAQ === idx && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            style={{ borderTop: '1px solid var(--border-glass)', padding: '0 24px' }}
                                        >
                                            <p style={{ padding: '24px 0', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                                                {faq.a}
                                            </p>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Tips & Best Practices */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        style={{ marginBottom: '100px' }}
                    >
                        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, marginBottom: '40px', textAlign: 'center', color: 'var(--text-primary)' }}>
                            Tips for Better Results
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                            {tips.map((tip, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.08 }}
                                    style={{
                                        background: 'var(--bg-card)',
                                        border: '1px solid var(--border-glass)',
                                        borderRadius: 'var(--radius-lg)',
                                        padding: '32px 24px',
                                        backdropFilter: 'blur(20px)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '16px'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <Lightbulb size={24} color="var(--accent-primary)" />
                                        <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                                            {tip.title}
                                        </h3>
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                                        {tip.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Troubleshooting */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        style={{ marginBottom: '80px' }}
                    >
                        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, marginBottom: '40px', textAlign: 'center', color: 'var(--text-primary)' }}>
                            Troubleshooting Guide
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                            {commonIssues.map((issue, idx) => {
                                const IconComponent = issue.icon;
                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        style={{
                                            background: 'var(--bg-card)',
                                            border: '1px solid var(--border-glass)',
                                            borderRadius: 'var(--radius-xl)',
                                            padding: '32px',
                                            backdropFilter: 'blur(20px)'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <IconComponent size={24} color="var(--accent-primary)" />
                                            </div>
                                            <h3 style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                                                {issue.title}
                                            </h3>
                                        </div>

                                        <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: 0 }}>
                                            {issue.steps.map((step, stepIdx) => (
                                                <li key={stepIdx} style={{ display: 'flex', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                                                    <span style={{ flexShrink: 0, fontWeight: 600, color: 'var(--accent-primary)', minWidth: '24px' }}>
                                                        {stepIdx + 1}.
                                                    </span>
                                                    <span>{step}</span>
                                                </li>
                                            ))}
                                        </ol>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Contact Support */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="help-support-card"
                        style={{
                            background: 'var(--gradient-card)',
                            border: '1px solid var(--border-glass)',
                            borderRadius: 'var(--radius-xl)',
                            padding: '60px 40px',
                            textAlign: 'center'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                            <MessageCircle size={40} color="var(--accent-primary)" />
                        </div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '24px', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                            Still Need Help?
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 32px' }}>
                            Our dedicated support team is ready to assist you. Reach out with any questions or issues.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', margin: '0 auto' }}>
                            <a
                                href="mailto:routrvaishnav@gmail.com"
                                style={{
                                    padding: '16px 40px',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    background: 'var(--accent-primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-lg)',
                                    cursor: 'pointer',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                                onMouseLeave={(e) => e.target.style.opacity = '1'}
                            >
                                <Mail size={18} /> Email Support
                            </a>

                            <a
                                href="/feedback"
                                style={{
                                    padding: '16px 40px',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    background: 'transparent',
                                    color: 'var(--accent-primary)',
                                    border: '1px solid var(--border-accent)',
                                    borderRadius: 'var(--radius-lg)',
                                    cursor: 'pointer',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'rgba(99, 102, 241, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'transparent';
                                }}
                            >
                                <ExternalLink size={18} /> Send Feedback
                            </a>
                        </div>
                    </motion.div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
