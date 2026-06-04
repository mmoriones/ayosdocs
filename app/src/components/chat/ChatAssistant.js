'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Bot, Loader2 } from 'lucide-react';

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [localInput, setLocalInput] = useState('');
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  
  const chat = useChat();
  const { messages, error } = chat;
  const isLoading = chat.status === 'streaming' || chat.status === 'submitted';

  // Fix hydration issues and ensures hook is ready on client
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Intelligent Auto-Hide Logic (Synchronized with BottomNav)
  useEffect(() => {
    const handleScroll = () => {
      // Don't hide if the chat modal is actually open
      if (isOpen) {
        setIsVisible(true);
        return;
      }

      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isOpen]);

  // BLOCK BACKGROUND SCROLL when chat is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Detect if user has scrolled up
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShouldAutoScroll(isAtBottom);
    }
  };

  // Auto-scroll to bottom whenever messages change or window opens
  useEffect(() => {
    if (isOpen && messagesEndRef.current && shouldAutoScroll) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, shouldAutoScroll]);

  if (!mounted) return null;

  const handleMySubmit = async (e) => {
    e.preventDefault();
    if (!localInput.trim() || isLoading) return;

    const content = localInput;
    setLocalInput('');
    
    try {
      if (chat.sendMessage) {
        await chat.sendMessage({ text: content });
      } else if (chat.append) {
        await chat.append({ role: 'user', content });
      }
    } catch (err) {
      console.error("Chat error:", err);
      setLocalInput(content);
    }
  };

  return (
    <div className={`fixed bottom-20 right-6 z-[200] transition-all duration-500 ease-in-out ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-28 opacity-0 pointer-events-none'
    }`}>
      {/* Background Overlay (Blocks clicks on site while chat is open) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[-1] animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Chat Bubble Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl transition-all active:scale-95 flex items-center justify-center relative"
        aria-label={isOpen ? "Close Chat" : "Open Chat"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-36 right-4 left-4 md:right-6 md:left-auto md:w-[400px] h-[550px] max-h-[calc(100dvh-160px)] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
            <div>
              <h3 className="font-bold">AyosDocs Assistant</h3>
              <p className="text-[10px] text-blue-100 uppercase tracking-widest font-semibold">Government Procedure Expert</p>
            </div>
            <Bot className="w-5 h-5 opacity-50" />
          </div>

          {/* Messages area */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 custom-scrollbar"
          >
            {messages.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <Bot className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p className="text-sm">Mabuhay! How can I help you today?</p>
                <p className="text-[10px] mt-2 bg-blue-100 text-blue-700 inline-block px-2 py-1 rounded">Ask about: Passport, BIR, NBI, etc.</p>
              </div>
            )}
            
            {messages.map(m => (
              <div
                key={m.id}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 opacity-60 text-[10px] uppercase font-bold">
                    {m.role === 'user' ? (
                      <>You <User className="w-3 h-3" /></>
                    ) : (
                      <><Bot className="w-3 h-3" /> Assistant</>
                    )}
                  </div>
                  <div className="whitespace-pre-wrap leading-relaxed text-[13px]">
                    {m.parts && Array.isArray(m.parts) 
                      ? m.parts.filter(p => p.type === 'text').map(p => p.text).join(' ')
                      : (m.content || m.text)}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-3 shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                </div>
              </div>
            )}
            
            {error && (
              <div className="text-center text-xs text-red-500 bg-red-50 p-2 rounded border border-red-100">
                Connection issue. Please try again.
              </div>
            )}

            {/* Scroll Anchor */}
            <div ref={messagesEndRef} className="h-1" />
          </div>

          {/* Input area */}
          <form onSubmit={handleMySubmit} className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input
              value={localInput}
              onChange={(e) => {
                setLocalInput(e.target.value);
                if (chat.setInput) chat.setInput(e.target.value);
              }}
              placeholder="Type your question..."
              className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
              disabled={isLoading}
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading || !localInput.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white w-10 h-10 rounded-full transition-all flex items-center justify-center shadow-lg active:scale-90 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
