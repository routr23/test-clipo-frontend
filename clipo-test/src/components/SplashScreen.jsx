import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

let _splashDone = false;

export function shouldShowSplash() {
  return !_splashDone;
}

/* Animated particle dot */
function Particle({ x, y, delay, size }) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${x}%`, top: `${y}%`,
        width: size, height: size,
        borderRadius: '50%',
        background: 'rgba(99,102,241,0.6)',
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.8, 0],
        scale: [0, 1, 0],
        y: [0, -40, -80],
      }}
      transition={{ duration: 2.5, delay, repeat: Infinity, ease: 'easeOut' }}
    />
  );
}

const PARTICLES = [
  { x: 15, y: 70, delay: 0,    size: 4 },
  { x: 25, y: 60, delay: 0.3,  size: 3 },
  { x: 40, y: 80, delay: 0.6,  size: 5 },
  { x: 55, y: 65, delay: 0.2,  size: 3 },
  { x: 70, y: 75, delay: 0.8,  size: 4 },
  { x: 82, y: 60, delay: 0.4,  size: 3 },
  { x: 90, y: 72, delay: 1.0,  size: 5 },
  { x: 10, y: 45, delay: 0.7,  size: 3 },
  { x: 60, y: 40, delay: 1.2,  size: 4 },
  { x: 30, y: 35, delay: 0.9,  size: 3 },
];

const LETTERS = ['C', 'l', 'i', 'p', 'o'];

import { useTheme } from '../context/ThemeContext';

export default function SplashScreen({ onDone }) {
  const { isDark } = useTheme();
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setExit(true), 2400);
    const t2 = setTimeout(() => {
      _splashDone = true;
      onDone();
    }, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <AnimatePresence>
      {!exit && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'var(--bg-primary)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Background grid lines */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `
              linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }} />

          {/* Big ambient glow */}
          <motion.div
            style={{
              position: 'absolute',
              width: 500, height: 500,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
            animate={{ scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Floating particles */}
          {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}

          {/* Spinning outer ring */}
          <div style={{ position: 'relative', marginBottom: 32 }}>
            <motion.div
              style={{
                position: 'absolute',
                inset: -18,
                borderRadius: '50%',
                border: '1.5px solid transparent',
                borderTopColor: 'rgba(99,102,241,0.8)',
                borderRightColor: 'rgba(167,139,250,0.4)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
            />

            {/* Second slower ring */}
            <motion.div
              style={{
                position: 'absolute',
                inset: -30,
                borderRadius: '50%',
                border: '1px solid transparent',
                borderBottomColor: 'rgba(99,102,241,0.3)',
                borderLeftColor: 'rgba(167,139,250,0.2)',
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
            />

            {/* Glow halo */}
            <motion.div
              style={{
                position: 'absolute', inset: -6,
                borderRadius: '50%',
                boxShadow: '0 0 40px 10px rgba(99,102,241,0.2)',
              }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Logo */}
            <motion.img
              src={isDark ? "/images/Clipo-white.png" : "/images/Clipo-black.png"}
              alt="Clipo"
              initial={{ scale: 0, rotate: -20, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}
              style={{
                width: 72, height: 72,
                objectFit: 'contain',
                position: 'relative', zIndex: 1,
                filter: 'drop-shadow(0 0 16px rgba(99,102,241,0.5))',
              }}
            />
          </div>

          {/* Brand name — letters stagger in */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 20 }}>
            {LETTERS.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.4, ease: 'easeOut' }}
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '2.6rem',
                  letterSpacing: '-0.03em',
                  color: i < 3 ? 'var(--text-primary)' : 'rgba(99,102,241,1)',
                  lineHeight: 1,
                }}
              >
                {letter}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 500,
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
                marginLeft: 8,
                letterSpacing: '0.12em',
                alignSelf: 'flex-end',
                paddingBottom: 8,
              }}
            >
              AI
            </motion.span>
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.82rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: 40,
              fontWeight: 500,
            }}
          >
            Your AI Learning Companion
          </motion.p>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{
              width: 200, height: 2,
              borderRadius: 999,
              background: 'var(--border-glass)',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.9, duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
              style={{
                height: '100%',
                borderRadius: 999,
                background: 'linear-gradient(90deg, #6366f1 0%, #a78bfa 50%, #6366f1 100%)',
                backgroundSize: '200% 100%',
                boxShadow: '0 0 10px rgba(99,102,241,0.7)',
              }}
            />
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
