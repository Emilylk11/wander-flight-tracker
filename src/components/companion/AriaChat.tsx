'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import MessageBubble from './MessageBubble';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type AriaChatProps = {
  userName?: string;
  homeAirport?: string;
  trips?: { id?: string; name: string; dates: string; destinations: string[] }[];
  wishlist?: { destination: string; targetDate: string; lastPrice: number }[];
  savedMessages?: Message[];
};

export default function AriaChat({
  userName = 'Traveler',
  homeAirport = 'TUL — Tulsa, OK',
  trips = [],
  wishlist = [],
  savedMessages = [],
}: AriaChatProps) {
  const greeting = trips.length > 0
    ? `Hi ${userName}! I'm ARIA, your travel companion. I can see you have ${trips.length} trip${trips.length > 1 ? 's' : ''} planned. Ask me anything about destinations, budgets, or logistics — I'm here to help! ✈️`
    : `Hi ${userName}! I'm ARIA, your intelligent travel companion. Ask me anything about planning trips, finding deals, or exploring destinations. Let's start your next adventure! 🌍`;

  const initialMessages: Message[] = savedMessages.length > 0
    ? savedMessages
    : [{ role: 'assistant', content: greeting }];

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Save messages to Supabase whenever they change (debounced)
  const saveMessages = useCallback(async (msgs: Message[]) => {
    // Only save after the first message exchange (skip initial greeting)
    if (msgs.length <= 1) return;
    try {
      await fetch('/api/aria/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: msgs }),
      });
    } catch {
      // Silent fail — don't interrupt chat
    }
  }, []);

  async function handleSend() {
    const text = input.trim();
    if (!text || isStreaming) return;

    const userMessage: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsStreaming(true);

    try {
      const res = await fetch('/api/aria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          context: { userName, homeAirport, trips, wishlist },
        }),
      });

      if (!res.ok) throw new Error('API request failed');

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No reader');

      const decoder = new TextDecoder();
      let assistantContent = '';

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        assistantContent += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            content: assistantContent,
          };
          return updated;
        });
      }

      // Save the complete conversation after assistant finishes
      const finalMessages = [...newMessages, { role: 'assistant' as const, content: assistantContent }];
      saveMessages(finalMessages);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I'm having trouble connecting right now. Try again in a moment — I'll be ready to help plan your next adventure! ✈️",
        },
      ]);
    } finally {
      setIsStreaming(false);
    }
  }

  async function handleClearChat() {
    const freshMessages: Message[] = [{ role: 'assistant', content: greeting }];
    setMessages(freshMessages);
    try {
      await fetch('/api/aria/history', { method: 'DELETE' });
    } catch {
      // Silent fail
    }
  }

  return (
    <div className="bg-white border border-wborder rounded-card overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 180px)', minHeight: '360px' }}>
      <div className="px-3 sm:px-[18px] py-3 sm:py-3.5 border-b border-wborder flex items-center gap-2.5 flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-3 to-gold flex items-center justify-center text-sm">
          ✦
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-medium text-wtext">
            ARIA — Your Travel Companion
          </div>
          <div className="text-[10px] text-gold flex items-center gap-1">
            <div className="w-[5px] h-[5px] rounded-full bg-gold animate-pulse" />
            Online · knows your trips
          </div>
        </div>
        {messages.length > 1 && (
          <button
            onClick={handleClearChat}
            className="text-[10px] text-wtext-3 hover:text-wtext border border-wborder rounded-md px-2 py-1 cursor-pointer bg-transparent transition-colors"
          >
            Clear chat
          </button>
        )}
      </div>

      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-3.5 flex flex-col gap-2.5"
      >
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} userName={userName.slice(0, 1)} />
        ))}
        {isStreaming && messages[messages.length - 1]?.content === '' && (
          <div className="flex items-center gap-1 px-3 py-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-2.5 sm:px-3.5 py-2 sm:py-2.5 border-t border-wborder flex gap-2 flex-shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask ARIA anything about your trips..."
          className="flex-1 bg-cream border border-wborder rounded-lg px-3 py-2 text-xs text-wtext font-body outline-none focus:border-wborder-2"
          disabled={isStreaming}
        />
        <button
          onClick={handleSend}
          disabled={isStreaming || !input.trim()}
          className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-3 to-gold border-none cursor-pointer flex items-center justify-center flex-shrink-0 transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.5">
            <path d="M12 7L2 2l3 5-3 5 10-5z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
