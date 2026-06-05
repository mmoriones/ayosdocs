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
  const [viewportHeight, setViewportHeight] = useState('100dvh');
  const lastScrollYRef = useRef(0);
  
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  
  const chat = useChat();
  const { messages, error } = chat;
  const isLoading = chat.status === 'streaming' || chat.status === 'submitted';

  // Fix hydration issues and ensures hook is ready on client
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    // Handle mobile keyboard and viewport resizing
    if (typeof window !== 'undefined' && window.visualViewport) {
      const handleResize = () => {
        setViewportHeight(`${window.visualViewport.height}px`);
        // Re-scroll to bottom if we were already at bottom
        if (shouldAutoScroll) {
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      };
      window.visualViewport.addEventListener('resize', handleResize);
      return () => window.visualViewport.removeEventListener('resize', handleResize);
    }
  }, [shouldAutoScroll]);

  // Intelligent Auto-Hide Logic (Synchronized with BottomNav)
  useEffect(() => {
    const handleScroll = () => {
      // Don't hide if the chat window is actually open
      if (isOpen) {
        setIsVisible(true);
        return;
      }

      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;
      
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

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
  const handleScrollInside = () => {
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
    <>
      {/* Background Overlay (Blocks clicks on site while chat is open) - Only on Desktop */}
      {isOpen && (
        <div 
          className="hidden md:block fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[190] animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Chat Bubble Toggle - Hide on mobile when chat is open or when scrolling down */}
      <div className={`fixed bottom-20 right-6 z-[200] transition-all duration-500 ease-in-out ${
        isVisible && !isOpen ? 'translate-y-0 opacity-100' : 'translate-y-28 opacity-0 pointer-events-none'
      }`}>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl transition-all active:scale-95 flex items-center justify-center relative"
          aria-label="Open Chat"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white animate-pulse" />
        </button>
      </div>

      {/* Chat Window - Full screen on mobile, floating on desktop */}
      {isOpen && (
        <div 
          style={{ height: typeof window !== 'undefined' && window.innerWidth < 768 ? viewportHeight : undefined }}
          className="fixed inset-0 md:inset-auto md:bottom-36 md:right-6 md:w-[400px] md:h-[550px] md:max-h-[calc(100dvh-160px)] w-full bg-white md:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300 z-[210]"
        >
          {/* Header */}
          <div className="bg-blue-600 p-4 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm md:text-base leading-tight">AyosDocs Assistant</h3>
                <p className="text-[10px] text-blue-100 uppercase tracking-widest font-semibold font-mono">Government Procedure Expert</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-90"
              aria-label="Close Chat"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Messages area */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScrollInside}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 custom-scrollbar overscroll-contain"
          >
            {messages.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <Bot className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p className="text-sm font-medium">Mabuhay! How can I help you today?</p>
                <p className="text-[10px] mt-2 bg-blue-100 text-blue-700 inline-block px-3 py-1.5 rounded-full">Try: &quot;Ano ang requirements para sa passport?&quot;</p>
              </div>
            )}
            
            {messages.map(m => (
              <div
                key={m.id}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 opacity-60 text-[10px] uppercase font-extrabold tracking-wider">
                    {m.role === 'user' ? (
                      <>You <User className="w-3 h-3" /></>
                    ) : (
                      <>Assistant <Bot className="w-3 h-3" /></>
                    )}
                  </div>
                  <div className="whitespace-pre-wrap leading-relaxed text-[13px] md:text-sm">
                    {m.parts && Array.isArray(m.parts) 
                      ? m.parts.filter(p => p.type === 'text').map(p => p.text).join(' ')
                      : (m.content || m.text)}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-4 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="text-center text-xs text-red-500 bg-red-50 p-3 rounded-xl border border-red-100 animate-in shake duration-300">
                Connection issue. Please try again.
              </div>
            )}

            {/* Scroll Anchor */}
            <div ref={messagesEndRef} className="h-4" />
          </div>

          {/* Input area */}
          <form 
            onSubmit={handleMySubmit} 
            className="p-4 bg-white border-t border-gray-100 flex gap-2 items-center pb-safe md:pb-4 shrink-0"
          >
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center focus-within:ring-2 focus-within:ring-blue-600 focus-within:bg-white transition-all">
              <input
                value={localInput}
                onChange={(e) => {
                  setLocalInput(e.target.value);
                  if (chat.setInput) chat.setInput(e.target.value);
                }}
                placeholder="Ask AyosDocs..."
                className="flex-1 bg-transparent border-none text-sm outline-none text-gray-800 focus:ring-0"
                disabled={isLoading}
                inputMode="text"
                enterKeyHint="send"
                autoComplete="off"
              />
            </div>
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
    </>
  );
}
