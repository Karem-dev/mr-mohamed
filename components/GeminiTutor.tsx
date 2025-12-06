import React, { useState, useRef, useEffect } from 'react';
import { streamPhysicsTutor, resetChatSession } from '../services/geminiService';
import { Bot, Send, Sparkles, X, RefreshCw, User, Minimize2, Maximize2 } from 'lucide-react';
import { ChatMessage } from '../types';

const GeminiTutor: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello! I'm Mr. Mohamed's AI Assistant. ⚛️\n\nI can help you solve problems, explain concepts like Newton's Laws, or guide you through our simulators.\n\nWhat are we learning today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Focus input when opening
  useEffect(() => {
    if (isOpen && !isLoading) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userText = query.trim();
    setQuery('');
    setIsLoading(true);

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: userText }]);

    try {
      // Create a placeholder for the model's response
      setMessages(prev => [...prev, { role: 'model', text: '' }]);
      
      const stream = streamPhysicsTutor(userText);
      let fullResponse = '';

      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === 'model') {
            lastMessage.text = fullResponse;
          }
          return newMessages;
        });
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I had trouble thinking about that. Please try again.", isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    resetChatSession();
    setMessages([{ role: 'model', text: "Chat cleared! How can I help you with physics today?" }]);
  };

  return (
    <div className={`fixed z-50 transition-all duration-300 ${
      isExpanded 
        ? 'inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center p-4' 
        : 'bottom-6 right-6'
    }`}>
      
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full shadow-2xl hover:shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
        >
          <div className="relative">
            <Bot size={28} className="animate-bounce-slow" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
          <div className="text-left hidden md:block">
            <p className="text-xs text-indigo-200 font-medium">Need help?</p>
            <p className="font-bold text-sm">Ask AI Tutor</p>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`
          flex flex-col bg-white dark:bg-slate-900 shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700
          ${isExpanded ? 'w-full max-w-4xl h-[80vh] rounded-2xl animate-fade-in-up' : 'w-[350px] sm:w-[400px] h-[600px] max-h-[80vh] rounded-2xl animate-scale-in origin-bottom-right'}
        `}>
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Physics Assistant</h3>
                <p className="text-xs text-indigo-100 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Online & Ready
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={handleReset}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Reset Chat"
              >
                <RefreshCw size={18} />
              </button>
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors hidden sm:block"
                title={isExpanded ? "Minimize" : "Expand"}
              >
                {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setIsExpanded(false);
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50 scroll-smooth">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0 mt-1">
                    <Bot size={16} className="text-white" />
                  </div>
                )}
                
                <div className={`
                  max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm
                  ${msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none'}
                  ${msg.isError ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : ''}
                `}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 mt-1">
                    <User size={16} className="text-slate-500 dark:text-slate-400" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex gap-3 justify-start">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <form onSubmit={handleSend} className="relative flex items-end gap-2">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about Newton's laws, circuits, or relativity..."
                className="w-full pl-4 pr-12 py-3 bg-slate-100 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all resize-none text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
                disabled={isLoading}
              />
              <button 
                type="submit"
                disabled={!query.trim() || isLoading}
                className="absolute right-2 bottom-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
              >
                <Send size={18} />
              </button>
            </form>
            <div className="mt-2 flex gap-2 justify-center">
               <button 
                  onClick={() => setQuery("Explain Newton's Second Law")}
                  className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-600 dark:text-slate-400 rounded-full transition-colors truncate max-w-[30%]"
               >
                 Explain Newton's 2nd Law
               </button>
               <button 
                  onClick={() => setQuery("How does a lens focus light?")}
                  className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-600 dark:text-slate-400 rounded-full transition-colors truncate max-w-[30%]"
               >
                 How do lenses work?
               </button>
               <button 
                  onClick={() => setQuery("Give me a practice problem for Ohm's Law")}
                  className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-600 dark:text-slate-400 rounded-full transition-colors truncate max-w-[30%]"
               >
                 Ohm's Law Problem
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiTutor;