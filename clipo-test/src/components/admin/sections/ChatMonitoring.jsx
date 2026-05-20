import { useState, useEffect } from 'react';
import { 
  MessageSquare, ExternalLink, Trash2, Search, Filter, 
  ChevronLeft, ChevronRight, ShieldAlert, Download, User, X
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api from '../../../utils/api';

export default function ChatMonitoring() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedChat, setSelectedChat] = useState(null);

  const fetchChats = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/chats?page=${page}&search=${searchTerm}`);
      setChats(res.data.chats);
      setTotalPages(Math.ceil(res.data.total / 20));
    } catch (err) {
      console.error('Failed to fetch chats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchChats();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [page, searchTerm]);

  const handleDeleteChat = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this chat session?')) return;
    try {
      await api.delete(`/admin/chats/${id}`);
      setChats(prev => prev.filter(c => c._id !== id));
      if (selectedChat?._id === id) setSelectedChat(null);
    } catch (err) {
      alert('Failed to delete chat');
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: selectedChat ? '400px 1fr' : '1fr', gap: 24, height: 'calc(100vh - 180px)' }}>
      {/* Chat List */}
      <div style={{ background: '#111', borderRadius: 24, border: '1px solid #222', padding: 24, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ position: 'relative', flex: 1, marginRight: 12 }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#444' }} size={16} />
            <input 
              placeholder="Search chats..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '10px 16px 10px 40px', background: '#0a0a0a', border: '1px solid #222', borderRadius: 10, color: '#fff', width: '100%' }} 
            />
          </div>
          <button style={{ padding: '10px', background: '#222', border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer' }}>
            <Download size={16} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingRight: 4 }}>
          {loading ? (
             <div style={{ textAlign: 'center', padding: 40, color: '#444' }}>Loading...</div>
          ) : chats.length === 0 ? (
             <div style={{ textAlign: 'center', padding: 40, color: '#444' }}>No chats found</div>
          ) : chats.map((chat) => (
            <div 
              key={chat._id} 
              onClick={() => setSelectedChat(chat)}
              style={{ 
                background: '#0a0a0a', padding: 16, borderRadius: 16, border: `1px solid ${selectedChat?._id === chat._id ? 'var(--accent-primary)' : '#1a1a1a'}`, 
                cursor: 'pointer', transition: 'all 0.2s', position: 'relative'
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {chat.userId?.avatar ? <img src={chat.userId.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={16} color="#666" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{chat.userId?.name || 'Deleted User'}</div>
                  <div style={{ fontSize: '0.7rem', color: '#444' }}>{new Date(chat.updatedAt).toLocaleString()}</div>
                </div>
              </div>

              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 8, color: '#eee', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{chat.title}</div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#666', background: '#111', padding: '2px 8px', borderRadius: 4 }}>{chat.subject}</span>
                <button 
                  onClick={(e) => handleDeleteChat(chat._id, e)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#444' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                  onMouseLeave={e => e.currentTarget.style.color = '#444'}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 24, paddingTop: 12, borderTop: '1px solid #222' }}>
          <button disabled={page === 1} onClick={() => setPage(page - 1)} style={{ padding: '6px', background: '#0a0a0a', border: '1px solid #222', borderRadius: 8, color: '#fff', opacity: page === 1 ? 0.3 : 1 }}><ChevronLeft size={16} /></button>
          <span style={{ fontSize: '0.8rem', color: '#444' }}>{page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)} style={{ padding: '6px', background: '#0a0a0a', border: '1px solid #222', borderRadius: 8, color: '#fff', opacity: page === totalPages ? 0.3 : 1 }}><ChevronRight size={16} /></button>
        </div>
      </div>

      {/* Conversation Viewer */}
      {selectedChat ? (
        <div style={{ background: '#111', borderRadius: 24, border: '1px solid #222', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px', borderBottom: '1px solid #222' }}>
            <div>
              <h3 style={{ fontWeight: 700, margin: 0 }}>{selectedChat.title}</h3>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>Chat ID: {selectedChat._id}</div>
            </div>
            <button onClick={() => setSelectedChat(null)} style={{ padding: 8, background: '#222', border: 'none', borderRadius: '50%', color: '#666', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
             {selectedChat.messages.map((msg, i) => (
               <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%', display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                 <div style={{ fontSize: '0.7rem', color: '#444', marginBottom: 6, fontWeight: 700 }}>{msg.role === 'user' ? 'USER' : 'ASSISTANT'}</div>
                 <div style={{ 
                   padding: '16px 20px', borderRadius: 20, fontSize: '0.95rem', lineHeight: 1.6,
                   background: msg.role === 'user' ? 'var(--accent-primary)' : '#0a0a0a',
                   color: msg.role === 'user' ? '#000' : '#ccc',
                   border: msg.role === 'user' ? 'none' : '1px solid #1a1a1a',
                   boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                 }}>
                   <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                 </div>
               </div>
             ))}
          </div>
        </div>
      ) : (
        <div style={{ background: '#111', borderRadius: 24, border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333' }}>
          <div style={{ textAlign: 'center' }}>
            <MessageSquare size={64} style={{ marginBottom: 16, opacity: 0.2 }} />
            <p>Select a conversation to view details</p>
          </div>
        </div>
      )}
    </div>
  );
}
