import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Share2, FileText, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import api from '../utils/api';

const preprocessMath = (content) => {
  if (!content) return '';
  return content
    .replace(/\\\((.*?)\\\)/g, (_, match) => `$${match}$`)
    .replace(/\\\[(.*?)\\\]/g, (_, match) => `$$${match}$$`);
};

const getHostname = (urlStr) => {
  try {
    return new URL(urlStr).hostname;
  } catch {
    return 'source';
  }
};

const mdComponents = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    const codeString = String(children).replace(/\n$/, '');

    if (!inline && match) {
      return (
        <div style={{ position: 'relative', marginTop: '1.5em', marginBottom: '1.5em', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
          <div style={{ background: '#1e1e1e', padding: '6px 12px', fontSize: '0.75rem', color: '#9cdcfe', fontFamily: 'var(--font-mono)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            {match[1]}
          </div>
          <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" customStyle={{ margin: 0, padding: '16px', background: '#1e1e1e', fontSize: '0.9rem' }} {...props}>
            {codeString}
          </SyntaxHighlighter>
        </div>
      );
    }
    return <code className={className} {...props}>{children}</code>;
  }
};

function MarkdownMessage({ content }) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        components={mdComponents}
      >
        {preprocessMath(content)}
      </ReactMarkdown>
    </div>
  );
}

function SourcesList({ sources }) {
  if (!sources || sources.length === 0) return null;
  const firstThree = sources.slice(0, 3);
  return (
    <div className="sources-inner" style={{ cursor: 'default' }}>
      <div className="source-overlap-group">
        {firstThree.map((s, idx) => {
          const host = getHostname(s.url);
          return (
            <div key={idx} className="source-mini-box">
              <img src={`https://www.google.com/s2/favicons?domain=${host}&sz=32`} alt="" />
            </div>
          );
        })}
      </div>
      <span className="sources-text">Sources</span>
    </div>
  );
}

export default function SharedChatPage() {
  const { shareId } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSharedSession = async () => {
      try {
        const { data } = await api.get(`/public/chat/${shareId}`);
        setSession(data.session);
      } catch (err) {
        setError(err.response?.data?.message || 'Chat not found or is private.');
      } finally {
        setLoading(false);
      }
    };
    fetchSharedSession();
  }, [shareId]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div className="spinner" style={{ width: 40, height: 40, border: '3px solid var(--border-glass)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: 24, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <AlertCircle size={32} color="#ef4444" />
        </div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: 12 }}>Link Unavailable</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 32, maxWidth: 400 }}>{error}</p>
        <Link to="/" className="btn btn-primary">Go to Clipo Home</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>

      {/* Topbar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(33,33,33,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-subtle)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
            <div style={{ display: 'flex', gap: 3 }}>
              <div style={{ width: 14, height: 14, background: 'var(--accent-primary)', borderRadius: '50%' }} />
              <div style={{ width: 14, height: 14, border: '2px solid var(--accent-primary)', borderRadius: '50%' }} />
            </div>
            Clipo
          </Link>
          <div style={{ height: 16, width: 1, background: 'var(--border-subtle)' }} />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Shared by {session.creatorName}</span>
        </div>

        <Link to="/" className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
          Try Clipo <ArrowRight size={14} />
        </Link>
      </div>

      <div style={{ flex: 1, padding: '40px 20px', maxWidth: 800, margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', marginBottom: 12 }}>{session.title}</h1>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)', padding: '6px 16px', borderRadius: 20, border: '1px solid var(--border-glass)' }}>
            <BookOpen size={14} color="var(--accent-primary)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{session.subject}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {session.messages.map((msg, idx) => (
            <div key={idx} className={`msg-row ${msg.role}`} style={{ padding: 0 }}>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div className={`msg-bubble ${msg.role}`}>
                  {msg.imageUrl && (
                    <div style={{ marginBottom: msg.content ? 10 : 0, borderRadius: 12, overflow: 'hidden' }}>
                      <img src={msg.imageUrl} alt="Attached" style={{ maxWidth: '100%', maxHeight: 300, display: 'block' }} />
                    </div>
                  )}
                  {msg.content && (
                    msg.role === 'user'
                      ? <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                      : <MarkdownMessage content={msg.content} />
                  )}
                </div>
                {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                  <div className="msg-footer-row">
                    <SourcesList sources={msg.sources} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '24px', textAlign: 'center', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 16 }}>Ready to turbocharge your learning?</p>
        <Link to="/register" className="btn btn-primary">Start using Clipo for free</Link>
      </div>

    </div>
  );
}
