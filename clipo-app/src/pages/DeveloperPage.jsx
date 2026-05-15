import { motion } from 'framer-motion';
import { Github, Instagram, Mail, Code2, Cpu, Globe, Heart, ExternalLink } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const DiscordIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.27 4.57c-1.3-.6-2.69-1.05-4.14-1.3-.18.32-.38.75-.53 1.1a15.2 15.2 0 0 0-4.57 0c-.14-.35-.35-.78-.52-1.1-1.45.25-2.84.7-4.14 1.3-2.63 3.93-3.34 7.76-2.99 11.54.12.16.24.32.37.47a16.52 16.52 0 0 0 5.04 2.54c.42-.58.79-1.2 1.1-1.86a11.1 11.1 0 0 1-1.57-.75c.13-.1.26-.2.39-.3a11.76 11.76 0 0 0 10.15 0c.13.1.26.2.39.3-.5.33-1.03.58-1.57.75.31.66.68 1.28 1.1 1.86a16.52 16.52 0 0 0 5.04-2.54c.41-4.38-.72-8.17-2.99-11.54ZM8.29 15.13c-.98 0-1.78-.9-1.78-2.02s.78-2.01 1.78-2.01c1.01 0 1.8.9 1.78 2.01 0 1.12-.78 2.02-1.78 2.02Zm7.42 0c-.98 0-1.78-.9-1.78-2.02s.78-2.01 1.78-2.01c1.01 0 1.8.9 1.78 2.01 0 1.12-.78 2.02-1.78 2.02Z" />
  </svg>
);

export default function DeveloperPage() {
  const skills = [
    { name: 'Frontend', icon: <Code2 size={18} />, tech: 'React, Next.js, Framer Motion' },
    { name: 'Backend', icon: <Cpu size={18} />, tech: 'Node.js, Express, MongoDB' },
    { name: 'AI/ML', icon: <Globe size={18} />, tech: 'LLM Integration, Prompt Engineering' },
  ];

  const socialLinks = [
    { icon: <Github size={20} />, url: 'https://github.com/vaishnavverma', label: 'GitHub' },
    { icon: <Instagram size={20} />, url: 'https://instagram.com/_routr', label: 'Instagram' },
    { icon: <DiscordIcon size={20} />, url: 'https://discord.com/users/1405146958045122671', label: 'Discord' },
    { icon: <Mail size={20} />, url: 'mailto:routrvaishnav@gmail.com', label: 'Email' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <SEO
        title="Developer"
        description="Meet the developer behind Clipo AI. Vaishnav Verma is a full-stack developer passionate about AI in education."
      />
      <Navbar />

      <main style={{ flex: 1, paddingTop: '140px', paddingBottom: '100px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>

          {/* Profile Section */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px', alignItems: 'center', marginBottom: '80px' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              style={{ position: 'relative' }}
            >
              <div style={{
                width: '180px', height: '180px', borderRadius: '40px',
                background: 'var(--gradient-brand)', padding: '4px'
              }}>
                <div style={{
                  width: '100%', height: '100%', borderRadius: '36px',
                  background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '4rem', fontWeight: 800, color: 'var(--text-primary)'
                }}>
                  V
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', background: 'var(--accent-primary)', color: 'white', padding: '8px 16px', borderRadius: '30px', fontSize: '0.8rem', fontWeight: 600 }}>
                Developer
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ flex: 1, minWidth: '300px' }}
            >
              <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '12px', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                Vaishnav Verma
              </h1>
              <p style={{ fontSize: '1.2rem', color: 'var(--accent-primary)', marginBottom: '24px', fontWeight: 600 }}>
                Full-Stack Developer & AI Enthusiast
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '32px' }}>
                Passionate about building modern web applications that solve real-world problems.
                I specialize in creating seamless user experiences and integrating advanced AI capabilities
                into intuitive digital products like Clipo AI.
              </p>

              <div style={{ display: 'flex', gap: '16px' }}>
                {socialLinks.map((link, i) => (
                  <a
                    key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                    style={{
                      width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-primary)'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Experience/Skills Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '80px' }}>
            {skills.map((skill, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{
                  padding: '32px', background: 'var(--bg-card)', border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-xl)', backdropFilter: 'blur(20px)'
                }}
              >
                <div style={{ color: 'var(--accent-primary)', marginBottom: '16px' }}>{skill.icon}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>{skill.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>{skill.tech}</p>
              </motion.div>
            ))}
          </div>

          {/* Project Focus */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              padding: '48px', background: 'var(--gradient-card)', border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-2xl)', textAlign: 'center'
            }}
          >
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)' }}>Currently focused on Clipo AI</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 32px', lineHeight: 1.6 }}>
              I am dedicated to making Clipo AI the premier platform for personalized education.
              Always open to feedback and collaboration.
            </p>
            <a href="https://github.com/vaishnavverma/clipo" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '14px 32px' }}>
              View Source on GitHub <ExternalLink size={16} style={{ marginLeft: 8 }} />
            </a>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
