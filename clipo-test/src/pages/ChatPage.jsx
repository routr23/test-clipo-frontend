import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Send, Trash2, Copy, Check, Edit2, Menu, X,
  Image as ImageIcon, PenSquare, ChevronDown, Search,
  Mic, Plus, LayoutDashboard, History, FileText, Share2, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { streamChatResponse } from '../utils/openrouter';
import LogoIcon from '../components/LogoIcon';

/* ── constants ────────────────────────────────────────────── */
const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
  'History', 'Literature', 'Economics', 'Geography', 'Coding', 'General'
];



/* ── helpers ──────────────────────────────────────────────── */
function preprocessMath(content) {
  if (!content) return '';
  return content
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, p1) => `$$${p1}$$`)
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, p1) => `$${p1}$`);
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} style={{
      background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
      borderRadius: 6, padding: '3px 8px', cursor: 'pointer',
      color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
      gap: 4, fontSize: '0.72rem', transition: 'all 0.15s'
    }}>
      {copied ? <><Check size={11} color="var(--accent-primary)" /> Copied</> : <><Copy size={11} /> Copy</>}
    </button>
  );
}

const mdComponents = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    const codeString = String(children).replace(/\n$/, '');
    return !inline && match ? (
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" {...props}
          customStyle={{ borderRadius: 10, fontSize: '0.85rem', margin: 0 }}>
          {codeString}
        </SyntaxHighlighter>
        <div style={{ position: 'absolute', top: 8, right: 8 }}>
          <CopyButton text={codeString} />
        </div>
      </div>
    ) : (
      <code className={className} {...props}>{children}</code>
    );
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

function TypingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '10px 0' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: '50%',
          background: 'var(--text-muted)',
          animation: `typing-dot 1.4s ease-in-out ${i * 0.2}s infinite`
        }} />
      ))}
    </div>
  );
}

function getHostname(url) {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace('www.', '');
  } catch {
    return 'Source';
  }
}

function SourcesList({ sources, onClick }) {
  if (!sources || sources.length === 0) return null;
  const firstThree = sources.slice(0, 3);
  return (
    <div className="sources-inner" onClick={onClick} style={{ cursor: 'pointer' }}>
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

function SourcesSidebar({ isOpen, onClose, sources }) {
  if (!isOpen) return null;
  return (
    <div className="sources-sidebar">
      <div className="sidebar-sources-header">
        <h3>Sources</h3>
        <button className="sidebar-close-btn" onClick={onClose}><X size={18} /></button>
      </div>
      <div className="sidebar-sources-content">
        {sources && sources.map((s, idx) => {
          const host = getHostname(s.url);
          return (
            <a key={idx} href={s.url} target="_blank" rel="noopener noreferrer" className="source-item-card">
              <div className="source-item-card-header">
                <img src={`https://www.google.com/s2/favicons?domain=${host}&sz=32`} alt="" />
                <span>{host}</span>
              </div>
              <div className="source-item-card-title">{s.title || host}</div>
              {s.content && <div className="source-item-card-snippet">{s.content}</div>}
            </a>
          );
        })}
      </div>
    </div>
  );
}

/* ── CenteredInput — shown when no messages ───────────────── */
function CenteredInput({ input, setInput, onSend, onKeyDown, isStreaming, attachedImage, attachedFile, onAttach, onRemoveAttachment, fileInputRef, subject, setSubject, showSubjectMenu, setShowSubjectMenu, textareaRef, isListening, toggleMic }) {
  const isMobile = window.innerWidth <= 768;

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? '24px 16px' : '60px 24px',
      position: 'relative'
    }}>
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
        style={{
          fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
          fontWeight: 700, color: 'var(--text-primary)',
          marginBottom: 32, textAlign: 'center', lineHeight: 1.25
        }}
      >
        What's on your mind today?
      </motion.h2>

      {/* Big centered input box */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }}
        style={{ width: '100%', maxWidth: 680 }}
      >
        {/* Attachment Previews */}
        {(attachedImage || attachedFile) && (
          <div style={{ marginBottom: 8, position: 'relative', display: 'flex', gap: 8 }}>
            {attachedImage && (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img src={attachedImage} alt="Preview" style={{ height: 56, borderRadius: 8, border: '1px solid var(--border-glass)' }} />
                <button onClick={onRemoveAttachment} style={{ position: 'absolute', top: -8, right: -8, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={11} />
                </button>
              </div>
            )}
            {attachedFile && (
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', padding: '6px 12px', borderRadius: 8 }}>
                <FileText size={16} color="var(--accent-primary)" />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{attachedFile.name}</span>
                <button onClick={onRemoveAttachment} style={{ background: 'none', border: 'none', color: '#ef4444', marginLeft: 8, cursor: 'pointer', display: 'flex' }}>
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        )}

        <div className="chat-input-box">
          {/* Attach */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, paddingBottom: 4, paddingLeft: 4 }}>
            <input type="file" accept="image/*,.txt,.csv,.md,.js,.py,.json" ref={fileInputRef} style={{ display: 'none' }} onChange={onAttach} />
            <button onClick={() => fileInputRef.current?.click()} disabled={isStreaming} title="Attach file or image"
              style={{ background: 'none', border: 'none', color: (attachedImage || attachedFile) ? 'var(--accent-primary)' : 'var(--text-muted)', cursor: 'pointer', padding: 8, display: 'flex', alignItems: 'center', borderRadius: '50%', transition: 'all 0.15s' }}>
              <ImageIcon size={20} />
            </button>
          </div>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => {
              setInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
            onKeyDown={onKeyDown}
            placeholder="Message AI chat..."
            disabled={isStreaming}
            rows={1}
            className="chat-textarea"
            style={{ paddingTop: 10, paddingBottom: 10 }}
          />

          {/* Send Area */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, paddingBottom: 4, paddingRight: 4 }}>
            <button onClick={toggleMic} disabled={isStreaming} title={isListening ? "Stop listening" : "Start Voice Typing"}
              style={{
                background: isListening ? 'rgba(239, 68, 68, 0.1)' : 'none',
                border: 'none',
                color: isListening ? '#ef4444' : 'var(--text-muted)',
                cursor: 'pointer',
                padding: 8,
                display: 'flex',
                alignItems: 'center',
                borderRadius: '50%',
                transition: 'all 0.15s',
                animation: isListening ? 'pulse 2s infinite' : 'none'
              }}>
              <Mic size={20} />
            </button>
            <button
              onClick={() => onSend()}
              disabled={(!input.trim() && !attachedImage && !attachedFile) || isStreaming}
              className="chat-send-btn"
              style={{
                width: 34, height: 34,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%',
                transition: 'all 0.15s', flexShrink: 0
              }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                            */
/* ══════════════════════════════════════════════════════════ */
export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [subject, setSubject] = useState(searchParams.get('subject') || 'General');
  const [isStreaming, setIsStreaming] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [streamingContent, setStreamingContent] = useState('');
  const [streamingSources, setStreamingSources] = useState([]);
  const [streamingStatus, setStreamingStatus] = useState('');
  const [isSourcesSidebarOpen, setIsSourcesSidebarOpen] = useState(false);
  const [sidebarSources, setSidebarSources] = useState([]);
  const sourcesRef = useRef([]);
  const [attachedImage, setAttachedImage] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);
  const [error, setError] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [shareText, setShareText] = useState('Share Link');
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);
  const [renamingSessionId, setRenamingSessionId] = useState(null);
  const [renamingValue, setRenamingValue] = useState('');
  const [deletingSessionId, setDeletingSessionId] = useState(null);
  const [showSubjectMenu, setShowSubjectMenu] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [sessionsPage, setSessionsPage] = useState(1);
  const [hasMoreSessions, setHasMoreSessions] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const isProcessingRef = useRef(false);

  const hasMessages = messages.length > 0 || isStreaming;
  const isMobile = window.innerWidth <= 768;

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false; // changed to false to prevent text spamming
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          console.log('Voice caught:', finalTranscript);
          setInput((prev) => {
            const prefix = prev && !prev.endsWith(' ') ? prev + ' ' : prev;
            return prefix + finalTranscript;
          });
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      setError('Voice input is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Handle Search Debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSessionsPage(1);
      loadSessions(1, sidebarSearch, true);
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [sidebarSearch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  useEffect(() => {
    const sessionId = searchParams.get('session');
    if (!sessionId) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get(`/chat/sessions/${sessionId}`);
        if (cancelled) return;
        setCurrentSession(data.session);
        setMessages(data.session.messages || []);
        setSubject(data.session.subject || 'General');
        if (isMobile) setSidebarOpen(false);
      } catch { if (!cancelled) setError('Failed to load chat.'); }
    })();
    return () => { cancelled = true; };
  }, [searchParams]);

  useEffect(() => {
    const sessionId = searchParams.get('session');
    const subjectParam = searchParams.get('subject');
    if (sessionId) return;
    if (subjectParam) { setSubject(subjectParam); createNewSession(subjectParam); }
  }, []);

  const loadSessions = async (pageToLoad = 1, searchQuery = sidebarSearch, reset = false) => {
    if (pageToLoad === 1 && !reset) setLoadingSessions(true);
    if (pageToLoad > 1) setIsFetchingMore(true);
    try {
      const { data } = await api.get(`/chat/sessions?page=${pageToLoad}&limit=20&search=${encodeURIComponent(searchQuery)}`);
      const list = data.sessions || [];
      // Backend already returns sorted by updatedAt: -1

      if (reset) {
        setSessions(list);
      } else {
        setSessions(prev => {
          const newMap = new Map();
          prev.forEach(s => newMap.set(s._id, s));
          list.forEach(s => newMap.set(s._id, s));
          return Array.from(newMap.values()).sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
        });
      }

      setHasMoreSessions(data.pagination ? data.pagination.hasMore : false);
    } catch {
      setError('Failed to load chat history.');
    } finally {
      setLoadingSessions(false);
      setIsFetchingMore(false);
    }
  };

  const handleScrollSessions = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 20;
    if (bottom && hasMoreSessions && !isFetchingMore) {
      const nextPage = sessionsPage + 1;
      setSessionsPage(nextPage);
      loadSessions(nextPage, sidebarSearch, false);
    }
  };

  const createNewSession = async (subj = subject) => {
    try {
      const { data } = await api.post('/chat/sessions', { subject: subj });
      setSessions(prev => [data.session, ...prev]);
      setCurrentSession(data.session);
      setMessages([]);
      setSubject(subj);
      if (isMobile) setSidebarOpen(false);
      return data.session;
    } catch { setError('Failed to create session.'); return null; }
  };

  const loadSession = async (session) => {
    try {
      const { data } = await api.get(`/chat/sessions/${session._id}`);
      setCurrentSession(data.session);
      setMessages(data.session.messages);
      setSubject(data.session.subject);
      if (isMobile) setSidebarOpen(false);
    } catch { setError('Failed to load session.'); }
  };

  const startRename = (session, e) => { e.stopPropagation(); setRenamingSessionId(session._id); setRenamingValue(session.title); };

  const saveRename = async (sessionId, e) => {
    if (e) e.stopPropagation();
    if (!renamingValue.trim()) return setRenamingSessionId(null);
    try {
      const { data } = await api.patch(`/chat/sessions/${sessionId}`, { title: renamingValue });
      setSessions(prev => prev.map(s => s._id === sessionId ? { ...s, title: data.session.title } : s));
      if (currentSession?._id === sessionId) setCurrentSession(prev => ({ ...prev, title: data.session.title }));
      setRenamingSessionId(null);
    } catch { setError('Failed to rename.'); }
  };

  const deleteSession = async (sessionId, e) => {
    if (e) e.stopPropagation();
    try {
      await api.delete(`/chat/sessions/${sessionId}`);
      setSessions(prev => prev.filter(s => s._id !== sessionId));
      if (currentSession?._id === sessionId) { setCurrentSession(null); setMessages([]); }
      setDeletingSessionId(null);
    } catch { setError('Failed to delete.'); }
  };

  const handleShareSession = async () => {
    if (!currentSession) return;
    setIsSharing(true);
    try {
      const { data } = await api.post(`/chat/sessions/${currentSession._id}/share`, { isPublic: true });
      const fullUrl = `${window.location.origin}${data.shareUrl}`;
      await navigator.clipboard.writeText(fullUrl);
      setShareText('Copied!');
      setTimeout(() => setShareText('Share Link'), 3000);
    } catch {
      setError('Failed to generate share link.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('File must be < 5MB'); return; }

    const reader = new FileReader();
    if (file.type.startsWith('image/')) {
      reader.onloadend = () => { setAttachedImage(reader.result); setAttachedFile(null); };
      reader.readAsDataURL(file);
    } else {
      reader.onloadend = () => { setAttachedFile({ name: file.name, content: reader.result }); setAttachedImage(null); };
      reader.readAsText(file);
    }
  };

  const removeAttachment = () => { setAttachedImage(null); setAttachedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; };

  const sendMessage = useCallback(async (overrideText) => {
    // 1. Get current values from refs or state at the moment of execution
    const text = overrideText !== undefined ? overrideText : textareaRef.current?.value || '';
    const currentImage = attachedImage;
    const currentFile = attachedFile;

    // 2. Immediate synchronous check to block double-entry
    if ((!text.trim() && !currentImage && !currentFile) || isStreaming || isProcessingRef.current) return;

    // 3. Set locks
    isProcessingRef.current = true;
    setIsStreaming(true);
    setError('');

    let session = currentSession;
    if (!session) {
      session = await createNewSession(subject);
      if (!session) {
        isProcessingRef.current = false;
        setIsStreaming(false);
        return;
      }
    }

    // Build message content — append file text if present
    let messageText = text.trim();
    if (currentFile) {
      messageText = messageText
        ? `${messageText}\n\n[Attached file: ${currentFile.name}]\n\`\`\`\n${currentFile.content}\n\`\`\``
        : `[Attached file: ${currentFile.name}]\n\`\`\`\n${currentFile.content}\n\`\`\``;
    }

    const userMsg = { role: 'user', content: messageText, createdAt: new Date() };
    if (currentImage) userMsg.imageUrl = currentImage;

    // 4. Update UI state (Functional updates to avoid closure issues)
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachedImage(null);
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    setStreamingContent('');
    setStreamingSources([]);
    setStreamingStatus('');
    sourcesRef.current = [];

    streamChatResponse({
      messages: [...messages, userMsg],
      subject,
      onSources: (sources) => {
        setStreamingSources(sources);
        sourcesRef.current = sources;
      },
      onStatus: (status) => {
        setStreamingStatus(status);
      },
      onChunk: (chunk, full) => {
        setStreamingStatus('');
        setStreamingContent(full);
      },
      onDone: async (final) => {
        const finalContent = final || "I apologize, but I couldn't generate a response for that. Could you please try rephrasing your question or checking your connection?";
        const aiMsg = {
          role: 'assistant',
          content: finalContent,
          sources: sourcesRef.current,
          createdAt: new Date()
        };
        setMessages(prev => [...prev, aiMsg]);
        setStreamingContent('');
        setIsStreaming(false);
        isProcessingRef.current = false; // Release lock
        try {
          const { data } = await api.put(`/chat/sessions/${session._id}`, { messages: [userMsg, aiMsg] });
          setCurrentSession(data.session);
          setSessions(prev => prev.map(s => s._id === data.session._id ? { ...s, title: data.session.title, updatedAt: data.session.updatedAt } : s));
        } catch { console.error('save failed'); }
      },
      onError: (msg) => {
        setError(msg);
        setIsStreaming(false);
        isProcessingRef.current = false; // Release lock
        setStreamingContent('');
      }
    });
  }, [isStreaming, currentSession, messages, subject, attachedImage, attachedFile]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isStreaming && !isProcessingRef.current) {
        sendMessage();
      }
    }
  };
  const handleLogout = () => { logout(); navigate('/'); };

  const filteredSessions = sessions; // Filtering is now server-side via sidebarSearch effect

  const toggleSubjectMenu = (e) => { e.stopPropagation(); setShowSubjectMenu(!showSubjectMenu); };

  return (
    <div className="chat-layout">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 190 }} />
        )}
      </AnimatePresence>

      {/* ══ SIDEBAR ══════════════════════════════════════════ */}
      <div className={`chat-sidebar ${!sidebarOpen ? 'collapsed' : ''} ${isMobile && sidebarOpen ? 'mobile-open' : ''}`}>

        {/* Logo + collapse */}
        <div style={{ padding: '14px 12px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LogoIcon size={34} />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              Cli<span style={{ color: 'var(--accent-primary)' }}>po</span>
            </span>
          </div>
          <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(false)} title="Collapse">
            <X size={15} />
          </button>
        </div>

        {/* Search bar */}
        <div style={{ padding: '6px 12px 8px', flexShrink: 0 }}>
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              value={sidebarSearch}
              onChange={e => setSidebarSearch(e.target.value)}
              placeholder="Search..."
              style={{
                width: '100%', padding: '7px 10px 7px 30px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-glass)',
                borderRadius: 8, color: 'var(--text-primary)',
                fontSize: '0.8rem', outline: 'none',
                fontFamily: 'var(--font-body)'
              }}
            />
          </div>
        </div>

        {/* New Chat button */}
        <div style={{ padding: '0 12px 0', flexShrink: 0 }}>
          <button className="new-chat-btn" onClick={() => { setCurrentSession(null); setMessages([]); if (isMobile) setSidebarOpen(false); }}>
            <PenSquare size={14} /> New Chat
          </button>
        </div>

        {/* Dashboard button */}
        <div style={{ padding: '8px 12px 0', flexShrink: 0 }}>
          <button className="new-chat-btn" onClick={() => navigate('/dashboard')} style={{ background: 'var(--bg-card)', borderStyle: 'dashed' }}>
            <LayoutDashboard size={14} /> Dashboard
          </button>
        </div>

        {/* History button */}
        <div style={{ padding: '8px 12px 0px', flexShrink: 0 }}>
          <button className="new-chat-btn" onClick={() => navigate('/history')} style={{ background: 'var(--bg-card)', borderStyle: 'dashed' }}>
            <History size={14} /> History
          </button>
        </div>

        {/* Feedback button */}
        <div style={{ padding: '8px 12px 8px', flexShrink: 0 }}>
          <button className="new-chat-btn" onClick={() => navigate('/feedback')} style={{ background: 'var(--bg-card)', borderStyle: 'dashed' }}>
            <History size={14} /> Feedback
          </button>
        </div>

        {/* Session list */}
        <div className="sidebar-sessions" onScroll={handleScrollSessions}>
          {loadingSessions && sessionsPage === 1 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
              <div className="spinner" style={{ margin: '0 auto 10px', width: 24, height: 24, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            </div>
          ) : filteredSessions.length === 0
            ? <div style={{ textAlign: 'center', padding: '28px 10px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>No chats yet</div>
            : filteredSessions.map(session => (
              <div
                key={session._id}
                onClick={() => renamingSessionId !== session._id && loadSession(session)}
                className={`session-item ${currentSession?._id === session._id ? 'active' : ''}`}
              >
                {renamingSessionId === session._id ? (
                  <input autoFocus value={renamingValue}
                    onChange={e => setRenamingValue(e.target.value)}
                    onBlur={() => saveRename(session._id)}
                    onKeyDown={e => { if (e.key === 'Enter') saveRename(session._id); if (e.key === 'Escape') setRenamingSessionId(null); }}
                    onClick={e => e.stopPropagation()}
                    style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 4, color: 'var(--text-primary)', fontSize: '0.8rem', padding: '2px 6px', outline: 'none', width: '100%' }}
                  />
                ) : (
                  <span className="session-item-title">{session.title}</span>
                )}

                {deletingSessionId === session._id ? (
                  <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                    <button onClick={e => deleteSession(session._id, e)} style={{ background: '#ef4444', border: 'none', color: 'white', fontSize: '0.65rem', padding: '2px 5px', borderRadius: 4, cursor: 'pointer' }}>Del</button>
                    <button onClick={e => { e.stopPropagation(); setDeletingSessionId(null); }} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontSize: '0.65rem', padding: '1px 4px', borderRadius: 4, cursor: 'pointer' }}>No</button>
                  </div>
                ) : (
                  <div className="session-item-actions">
                    <button className="session-action-btn" onClick={e => startRename(session, e)}><Edit2 size={11} /></button>
                    <button className="session-action-btn" onClick={e => { e.stopPropagation(); setDeletingSessionId(session._id); }}><Trash2 size={11} color="#f87171" /></button>
                  </div>
                )}
              </div>
            ))
          }
          {isFetchingMore && (
            <div style={{ textAlign: 'center', padding: '10px', color: 'var(--text-muted)' }}>
              <div className="spinner" style={{ margin: '0 auto', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            </div>
          )}
        </div>

        {/* User footer */}
        <div className="sidebar-footer">
          <button className="user-profile-btn" onClick={() => navigate('/profile')} title="My Profile">
            <div style={{
              width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 700, color: 'var(--bg-primary)', flexShrink: 0,
              overflow: 'hidden'
            }}>
              {user?.avatar ? (
                <img src={user.avatar} alt="PFP" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                user?.name?.[0]?.toUpperCase()
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>My Profile</div>
            </div>
          </button>
        </div>
      </div>

      {/* ══ MAIN AREA ════════════════════════════════════════ */}
      <div className="chat-main">
        {/* Top bar */}
        <div className="chat-topbar" style={{ backdropFilter: 'blur(8px)', background: 'var(--bg-primary)', WebkitBackdropFilter: 'blur(8px)' }}>
          {!sidebarOpen && (
            <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(true)} title="Open Sidebar">
              <Menu size={18} />
            </button>
          )}

          <button
            className="new-chat-top-btn"
            onClick={() => { setCurrentSession(null); setMessages([]); }}
            title="Start New Chat"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', background: 'var(--bg-card)',
              border: '1px solid var(--border-glass)', borderRadius: 8,
              color: 'var(--accent-primary)', fontSize: '0.82rem',
              cursor: 'pointer', fontFamily: 'var(--font-body)',
              fontWeight: 500, marginLeft: 8
            }}
          >
            <Plus size={14} /> <span className="hide-on-mobile">New Chat</span>
          </button>

          {currentSession && hasMessages && (
            <button
              onClick={handleShareSession}
              disabled={isSharing}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', background: 'transparent',
                border: '1px solid var(--border-glass)', borderRadius: 8,
                color: 'var(--text-secondary)', fontSize: '0.82rem',
                cursor: 'pointer', fontFamily: 'var(--font-body)',
                fontWeight: 500, marginLeft: 'auto', transition: 'all 0.2s'
              }}
            >
              <Share2 size={13} /> <span className="hide-on-mobile">{shareText}</span>
            </button>
          )}
          <div style={{ flex: 1 }} />

          {/* Model pill — top right */}
          <div style={{ position: 'relative' }}>
            <button onClick={toggleSubjectMenu}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: 8, color: 'var(--text-secondary)', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              {subject} <ChevronDown size={13} />
            </button>
            <AnimatePresence>
              {showSubjectMenu && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}
                  style={{ position: 'absolute', top: '110%', right: 0, background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: 10, padding: 6, zIndex: 100, minWidth: 180, boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
                  {SUBJECTS.map(s => (
                    <button key={s} onClick={() => { setSubject(s); setShowSubjectMenu(false); }}
                      style={{ width: '100%', display: 'block', textAlign: 'left', padding: '7px 12px', background: s === subject ? 'rgba(25,195,125,0.1)' : 'transparent', border: 'none', borderRadius: 6, color: s === subject ? 'var(--accent-primary)' : 'var(--text-secondary)', fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* ── Messages OR Welcome ─────────────────────────── */}
        {!hasMessages ? (
          /* CENTERED WELCOME INPUT */
          <CenteredInput
            input={input} setInput={setInput}
            onSend={sendMessage} onKeyDown={handleKeyDown}
            isStreaming={isStreaming}
            attachedImage={attachedImage}
            attachedFile={attachedFile}
            onAttach={handleFileUpload}
            onRemoveAttachment={removeAttachment}
            fileInputRef={fileInputRef}
            subject={subject} setSubject={setSubject}
            showSubjectMenu={false}
            setShowSubjectMenu={() => { }}
            textareaRef={textareaRef}
            isListening={isListening}
            toggleMic={toggleMic}
          />
        ) : (
          <>
            {/* Message list */}
            <div className="chat-messages-wrap" onClick={() => setShowSubjectMenu(false)}>
              <div className="chat-messages-inner">
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => (
                    <motion.div key={i} className={`msg-row ${msg.role}`}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
                      {msg.role === 'assistant' ? (
                        <div className="msg-avatar" style={{ background: 'transparent', color: 'var(--accent-primary)' }}>
                          <LogoIcon size={26} />
                        </div>
                      ) : (
                        <div className="msg-avatar" style={{
                          order: 2, background: 'var(--bg-input)', border: '1px solid var(--border-glass)',
                          color: 'var(--text-secondary)', overflow: 'hidden', display: 'flex',
                          alignItems: 'center', justifyContent: 'center'
                        }}>
                          {user?.avatar ? (
                            <img src={user.avatar} alt="Me" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            user?.name?.[0]?.toUpperCase() || 'U'
                          )}
                        </div>
                      )}

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
                        {msg.role === 'assistant' && msg.content && (
                          <div className="msg-footer-row">
                            <div className="msg-actions-group">
                              <CopyButton text={msg.content} />
                            </div>
                            {msg.sources && msg.sources.length > 0 && (
                              <SourcesList
                                sources={msg.sources}
                                onClick={() => {
                                  setSidebarSources(msg.sources);
                                  setIsSourcesSidebarOpen(true);
                                }}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Streaming */}
                {isStreaming && streamingContent && (
                  <motion.div className="msg-row assistant" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="msg-avatar" style={{ background: 'transparent', color: 'var(--accent-primary)' }}>
                      <LogoIcon size={26} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="msg-bubble assistant">
                        {streamingStatus && (
                          <div className="searching-status">
                            <span style={{ fontSize: '1rem' }}>🌐</span> {streamingStatus}
                          </div>
                        )}
                        <MarkdownMessage content={streamingContent} />
                        {isStreaming && streamingContent && (
                          <span style={{ display: 'inline-block', width: 7, height: 15, background: 'var(--accent-primary)', borderRadius: 2, marginLeft: 2, animation: 'blink 0.8s ease-in-out infinite', verticalAlign: 'middle' }} />
                        )}
                      </div>
                      {streamingSources.length > 0 && !streamingStatus && (
                        <div className="msg-footer-row">
                          <div className="msg-actions-group" style={{ opacity: 0.4 }}>
                            <CopyButton text={streamingContent} />
                          </div>
                          <SourcesList
                            sources={streamingSources}
                            onClick={() => {
                              setSidebarSources(streamingSources);
                              setIsSourcesSidebarOpen(true);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {isStreaming && !streamingContent && (
                  <div className="msg-row assistant">
                    <div className="msg-avatar" style={{ background: 'transparent', color: 'var(--accent-primary)' }}>
                      <LogoIcon size={26} />
                    </div>
                    <div><TypingDots /></div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div style={{ margin: '0 16px 6px', display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '9px 14px' }}>
                <span style={{ fontSize: '0.875rem', color: '#f87171', flex: 1 }}>{error}</span>
                <button onClick={() => setError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={14} /></button>
              </div>
            )}

            {/* Bottom input */}
            <div className="chat-input-area">
              <div className="chat-input-inner">
                {/* Attachment Previews */}
                {(attachedImage || attachedFile) && (
                  <div style={{ marginBottom: 8, position: 'relative', display: 'flex', gap: 8 }}>
                    {attachedImage && (
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <img src={attachedImage} alt="Preview" style={{ height: 56, borderRadius: 8, border: '1px solid var(--border-glass)' }} />
                        <button onClick={removeAttachment} style={{ position: 'absolute', top: -8, right: -8, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={11} /></button>
                      </div>
                    )}
                    {attachedFile && (
                      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', padding: '6px 12px', borderRadius: 8 }}>
                        <FileText size={16} color="var(--accent-primary)" />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{attachedFile.name}</span>
                        <button onClick={removeAttachment} style={{ background: 'none', border: 'none', color: '#ef4444', marginLeft: 8, cursor: 'pointer', display: 'flex' }}><X size={14} /></button>
                      </div>
                    )}
                  </div>
                )}
                <div className="chat-input-box">
                  {/* Attach */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2, paddingBottom: 4, paddingLeft: 4 }}>
                    <input type="file" accept="image/*,.txt,.csv,.md,.js,.py,.json" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />
                    <button onClick={() => fileInputRef.current?.click()} disabled={isStreaming} title="Attach file or image"
                      style={{ background: 'none', border: 'none', color: (attachedImage || attachedFile) ? 'var(--accent-primary)' : 'var(--text-muted)', cursor: 'pointer', padding: 8, display: 'flex', alignItems: 'center', borderRadius: '50%', transition: 'all 0.15s' }}>
                      <ImageIcon size={20} />
                    </button>
                  </div>

                  <textarea ref={textareaRef} className="chat-textarea" value={input}
                    onChange={e => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }}
                    onKeyDown={handleKeyDown}
                    placeholder={`Message AI chat…`}
                    disabled={isStreaming} rows={1}
                    style={{ paddingTop: 10, paddingBottom: 10 }}
                  />

                  {/* Send Area */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2, paddingBottom: 4, paddingRight: 4 }}>
                    <button onClick={toggleMic} disabled={isStreaming} title={isListening ? "Stop listening" : "Start Voice Typing"}
                      style={{
                        background: isListening ? 'rgba(239, 68, 68, 0.1)' : 'none',
                        border: 'none',
                        color: isListening ? '#ef4444' : 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: 8,
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: '50%',
                        transition: 'all 0.15s',
                        animation: isListening ? 'pulse 2s infinite' : 'none'
                      }}>
                      <Mic size={20} />
                    </button>
                    <button className="chat-send-btn" onClick={() => sendMessage()} disabled={(!input.trim() && !attachedImage && !attachedFile) || isStreaming}
                      style={{
                        width: 34, height: 34,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: '50%',
                        transition: 'all 0.15s', flexShrink: 0
                      }}
                    >
                      <Send size={15} />
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
                  Clipo may make mistakes — verify important information.
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <SourcesSidebar
        isOpen={isSourcesSidebarOpen}
        onClose={() => setIsSourcesSidebarOpen(false)}
        sources={sidebarSources}
      />
    </div>
  );
}