import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { Target, Users, Zap, ShieldCheck, Rocket, Sparkles, Star } from 'lucide-react';
import api from '../utils/api';

export default function AboutPage() {
    const [stats, setStats] = useState({ averageRating: 0, totalFeedback: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/feedback/stats');
                setStats(data);
            } catch (err) {
                console.error('Failed to fetch rating stats');
            }
        };
        fetchStats();
    }, []);

    const features = [
        {
            icon: <Zap size={24} />,
            title: "Fast & Precise",
            desc: "Get instant answers and explanations powered by state-of-the-art AI models."
        },
        {
            icon: <ShieldCheck size={24} />,
            title: "Safe Learning",
            desc: "An educational-first environment designed to foster true understanding."
        },
        {
            icon: <Target size={24} />,
            title: "Personalized",
            desc: "Tailored tutoring that adapts to your learning pace and style."
        }
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
            <SEO
                title="About Us"
                description="Discover the mission behind Clipo AI. We are dedicated to making every subject easy to master through personalized, AI-powered tutoring."
            />
            <Navbar />

            <main style={{ flex: 1, paddingTop: '140px', paddingBottom: '80px' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>

                    {/* Hero Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{ textAlign: 'center', marginBottom: '80px' }}
                    >
                        <div className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', marginBottom: '16px', border: '1px solid var(--border-accent)' }}>
                            <Sparkles size={14} style={{ marginRight: 6 }} /> Our Mission
                        </div>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 800, marginBottom: '24px', lineHeight: 1.1 }}>
                            About <span style={{ background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Clipo AI</span>
                        </h1>
                        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
                            Clipo AI is more than just a chatbot. It's your personal 24/7 tutor designed to make learning intuitive, engaging, and accessible to everyone.
                        </p>
                    </motion.section>

                    {/* Core Values / Features */}
                    <section className="about-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '100px' }}>
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="glass-card"
                                style={{ padding: '32px', border: '1px solid var(--border-glass)' }}
                            >
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
                                    color: 'var(--accent-primary)'
                                }}>
                                    {f.icon}
                                </div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'var(--text-primary)' }}>{f.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
                            </motion.div>
                        ))}
                    </section>

                    

                    {/* Our Story / Vision */}
                    <motion.section
                        className="about-vision-card"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        style={{
                            background: 'var(--gradient-card)', border: '1px solid var(--border-glass)',
                            borderRadius: 'var(--radius-xl)', padding: '60px 40px', position: 'relative', overflow: 'hidden'
                        }}
                    >
                        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px' }}>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>Our <span style={{ color: 'var(--accent-primary)' }}>Vision</span></h2>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.8 }}>
                                We believe that every student deserves a high-quality, personalized education. However, institutionalized learning often moves at a fixed pace, leaving many behind.
                            </p>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                                Clipo was born from the idea that AI can bridge this gap. By providing instant, conversational, and context-aware feedback, we empower learners to master complex subjects at their own speed. Our goal is to build the world's most supportive learning companion.
                            </p>
                        </div>

                        {/* Decal / Decoration */}
                        <div style={{
                            position: 'absolute', right: '-40px', bottom: '-40px', opacity: 0.05, transform: 'rotate(-15deg)'
                        }}>
                            <Rocket size={300} color="var(--accent-primary)" />
                        </div>
                    </motion.section>

                    {/* Feedback/Ratings Section */}
                    <div style={{ marginTop: '80px', textAlign: 'center' }}>
                        <div className="about-rating-card" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '16px 32px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '20px', backdropFilter: 'blur(10px)' }}>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 4 }}>Student Satisfaction</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.averageRating}</span>
                                    <div style={{ display: 'flex', gap: 2 }}>
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <Star key={s} size={16} fill={s <= Math.round(stats.averageRating) ? '#f59e0b' : 'none'} color={s <= Math.round(stats.averageRating) ? '#f59e0b' : 'rgba(255,255,255,0.2)'} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div style={{ width: '1px', height: '40px', background: 'var(--border-glass)', margin: '0 8px' }} />
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{stats.totalFeedback}+</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Reviews</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
