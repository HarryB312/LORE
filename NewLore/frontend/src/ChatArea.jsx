import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

export default function ChatArea({ messages, onSendMessage }) {
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  // Auto-scrolls to the bottom whenever a new message arrives
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50">
      {/* Top Navigation Bar */}
      <div className="h-16 border-b border-slate-200 bg-white flex items-center px-8 shadow-sm justify-between">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-700 text-sm">NewLore Research Engine Active</span>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* AI Avatar */}
              {msg.sender === 'ai' && (
                <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm text-white shrink-0">
                  <Bot size={18} />
                </div>
              )}

              {/* Message Bubble */}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed ${
                msg.sender === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
              }`}>
                {msg.text}
              </div>

              {/* User Avatar */}
              {msg.sender === 'user' && (
                <div className="h-8 w-8 rounded-lg bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 shrink-0">
                  <User size={18} />
                </div>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Form Footer */}
      <div className="p-6 border-t border-slate-200 bg-white shadow-md">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-3 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about the documents (e.g., 'What are the key findings?')"
            className="w-full bg-slate-100 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl pl-4 pr-12 py-3.5 text-sm outline-none transition-all placeholder-slate-400 text-slate-800"
          />
          <button
            type="submit"
            className="absolute right-2 top-1.5 bottom-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center justify-center shadow-sm"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
