import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { API_BASE } from '../utils/constants';
import Button from '../components/ui/Button';
import { Send, Bot, User, Sparkles } from 'lucide-react';

export default function AiBuddy() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hey! 👋 I\'m your AI shopping buddy. Ask me anything about products, deals, or recommendations!' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const socket = io(API_BASE.AI_BUDDY, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('response', (data) => {
      setIsTyping(false);
      const text = typeof data === 'string' ? data : data.message || data.text || JSON.stringify(data);
      setMessages((prev) => [...prev, { role: 'ai', text }]);
    });
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);
    if (socketRef.current?.connected) {
      socketRef.current.emit('message', userMsg);
    } else {
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { role: 'ai', text: 'Sorry, I\'m unable to connect right now. Please make sure the AI Buddy service is running on port 3005.' },
        ]);
      }, 1000);
    }
  };

  const suggestions = [
    'Recommend electronics under ₹5000',
    'What\'s trending in fashion?',
    'Compare smartphones',
    'Find best deals today',
  ];

  return (
    <div className="flex flex-col mh-bg-primary" style={{ height: 'calc(100vh - 4rem)' }}>
      {/* Header */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b mh-border flex items-center gap-3 mh-bg-card flex-shrink-0">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-gradient)' }}>
          <Bot size={18} className="text-white" />
        </div>
        <div>
          <h1 className="font-bold text-sm sm:text-base mh-text-primary">AI Buddy</h1>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: connected ? 'var(--success)' : 'var(--error)' }} />
            <span className="text-[10px] sm:text-xs mh-text-tertiary">{connected ? 'Online' : 'Offline'}</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 space-y-3 sm:space-y-4">
        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4">
            {suggestions.map((s) => (
              <button key={s} onClick={() => setInput(s)}
                className="mh-card p-3 sm:p-4 text-xs sm:text-sm text-left hover:!border-[var(--accent)] cursor-pointer group">
                <Sparkles size={12} className="inline mr-1.5 mh-text-accent" />
                <span className="mh-text-secondary">{s}</span>
              </button>
            ))}
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 sm:gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            {msg.role === 'ai' && (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-gradient)' }}>
                <Bot size={14} className="text-white" />
              </div>
            )}
            <div className={`max-w-[80%] sm:max-w-[75%] px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'text-white rounded-br-sm'
                : 'mh-card !shadow-none rounded-bl-sm'
            }`}
              style={msg.role === 'user' ? { background: 'var(--accent-gradient)' } : {}}
            >
              {msg.role === 'ai' && <span className="mh-text-primary">{msg.text}</span>}
              {msg.role === 'user' && msg.text}
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 mh-bg-tertiary mh-text-secondary">
                <User size={14} />
              </div>
            )}
          </div>
        ))}

        {/* Typing */}
        {isTyping && (
          <div className="flex items-center gap-2 sm:gap-3 animate-fade-in">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-gradient)' }}>
              <Bot size={14} className="text-white" />
            </div>
            <div className="mh-card !shadow-none px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ animationDelay: '0s', backgroundColor: 'var(--text-tertiary)' }} />
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ animationDelay: '0.15s', backgroundColor: 'var(--text-tertiary)' }} />
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ animationDelay: '0.3s', backgroundColor: 'var(--text-tertiary)' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-3 sm:px-6 py-3 sm:py-4 border-t mh-border mh-bg-card flex-shrink-0">
        <form onSubmit={handleSend} className="flex items-center gap-2 p-1.5 sm:p-2 rounded-2xl border mh-border mh-bg-input">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 px-2 sm:px-3 py-2 sm:py-2.5 text-sm bg-transparent outline-none mh-text-primary" />
          <Button type="submit" size="sm" disabled={!input.trim()} className="!rounded-xl !px-3 sm:!px-4">
            <Send size={16} />
          </Button>
        </form>
      </div>
    </div>
  );
}
