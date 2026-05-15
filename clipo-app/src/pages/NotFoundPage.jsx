import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Ghost } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NotFoundPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      background: '#0a0a0b', 
      color: '#fff',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Dynamic Background Elements */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', top: '10%', left: '20%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' }} 
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 60, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', bottom: '15%', right: '15%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)' }} 
        />
        
        {/* Floating "dust" particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.1, x: Math.random() * 2000, y: Math.random() * 1000 }}
            animate={{ y: [null, -100], opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 5 + Math.random() * 10, repeat: Infinity, ease: "linear" }}
            style={{ position: 'absolute', width: 2, height: 2, background: '#fff', borderRadius: '50%' }}
          />
        ))}
      </div>

      <Navbar />
      
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px', position: 'relative', zIndex: 1 }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ 
            textAlign: 'center', 
            maxWidth: '600px', 
            padding: '60px 40px',
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '32px',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5)'
          }}
        >
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <h1 style={{ 
                fontSize: 'clamp(5rem, 15vw, 8rem)', 
                fontWeight: 900, 
                lineHeight: 1, 
                margin: 0, 
                background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.3) 100%)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '-0.06em'
              }}>
                404
              </h1>
            </motion.div>
            <motion.div 
              style={{ position: 'absolute', top: -10, right: -10 }}
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
               <Ghost size={40} color="var(--accent-primary)" style={{ opacity: 0.6 }} />
            </motion.div>
          </div>
          
          <h2 style={{ 
            fontSize: '2.4rem', 
            fontWeight: 800, 
            color: '#fff', 
            marginTop: '0.5rem', 
            marginBottom: '1rem',
            fontFamily: 'var(--font-heading)',
            letterSpacing: '-0.02em'
          }}>
            Oops! Still Learning...
          </h2>
          
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '48px', fontSize: '1.2rem', lineHeight: 1.6, fontWeight: 300 }}>
            Our AI searched every corner of the digital universe, but this specific page seems to have vanished into a black hole.
          </p>
          
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" style={{ 
              padding: '16px 32px', 
              borderRadius: '16px',
              background: 'var(--accent-primary)',
              color: '#000',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 10px 30px rgba(99,102,241,0.2)'
            }} 
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(99,102,241,0.3)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(99,102,241,0.2)'; }}
            >
              <Home size={20} /> Back to Reality
            </Link>
            
            <button 
              onClick={() => window.history.back()} 
              style={{ 
                padding: '16px 32px', 
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                transition: 'background 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              <ArrowLeft size={20} /> Go Back
            </button>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

