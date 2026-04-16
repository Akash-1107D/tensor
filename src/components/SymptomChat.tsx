import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Loader2, User, Bot, ArrowLeft, CheckCircle } from 'lucide-react';
import { ChatMessage, PatientInfo } from '../types';
import { getChatResponse } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  messages: ChatMessage[];
  onAddMessage: (msg: ChatMessage) => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading: boolean;
  patientInfo: PatientInfo;
  language: string;
}

export default function SymptomChat({ 
  messages, 
  onAddMessage, 
  onSubmit, 
  onBack, 
  isLoading, 
  patientInfo, 
  language 
}: Props) {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Initial greeting if no messages
  useEffect(() => {
    if (messages.length === 0) {
      const initialGreeting = async () => {
        setIsTyping(true);
        try {
          const response = await getChatResponse(
            [{ role: 'user', content: 'Hello, I need help with my symptoms.' }],
            patientInfo,
            language
          );
          onAddMessage({ role: 'assistant', content: response });
        } catch (error) {
          onAddMessage({ role: 'assistant', content: "Hello, I'm your health assistant. How are you feeling today?" });
        } finally {
          setIsTyping(false);
        }
      };
      initialGreeting();
    }
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', content: inputValue };
    onAddMessage(userMsg);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await getChatResponse([...messages, userMsg], patientInfo, language);
      onAddMessage({ role: 'assistant', content: response });
    } catch (error) {
      onAddMessage({ role: 'assistant', content: "I'm sorry, I'm having trouble connecting. Could you repeat that?" });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Health Assistant</h2>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Online
            </p>
          </div>
        </div>
        <button
          onClick={onSubmit}
          disabled={messages.length < 2 || isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
          Get Triage
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-thin scrollbar-thumb-gray-200"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex justify-start"
          >
            <div className="flex gap-2 items-center bg-gray-50 p-3 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your symptoms here..."
          className="w-full p-4 pr-12 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          disabled={isTyping || isLoading}
        />
        <button
          onClick={handleSend}
          disabled={!inputValue.trim() || isTyping || isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all"
        >
          <Send size={20} />
        </button>
      </div>
      <p className="text-[10px] text-gray-400 text-center mt-2">
        Chat with our assistant to describe your symptoms. Click "Get Triage" when ready.
      </p>
    </div>
  );
}
