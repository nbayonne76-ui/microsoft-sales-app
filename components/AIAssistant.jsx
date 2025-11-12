"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Brain, Send, Mic, MicOff, Volume2, VolumeX, User, Bot, 
  Minimize2, Maximize2, X, RefreshCw, Lightbulb, MessageSquare
} from 'lucide-react';
import { toast } from "sonner";

const AIAssistant = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Bonjour ! Je suis votre assistant IA personnel pour l\'email marketing. Je peux vous aider avec :\n\n• Optimiser vos emails existants\n• Suggérer des améliorations de contenu\n• Répondre à vos questions sur les stratégies email\n• Analyser le ton et l\'efficacité de vos messages\n\nComment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const messagesEndRef = useRef(null);
  const recognition = useRef(null);
  const synthesis = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Speech Recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition.current = new SpeechRecognition();
        recognition.current.continuous = false;
        recognition.current.interimResults = false;
        recognition.current.lang = 'fr-FR';

        recognition.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          setIsListening(false);
        };

        recognition.current.onerror = () => {
          setIsListening(false);
          toast.error('Erreur de reconnaissance vocale');
        };

        recognition.current.onend = () => {
          setIsListening(false);
        };
      }

      // Speech Synthesis
      if ('speechSynthesis' in window) {
        synthesis.current = window.speechSynthesis;
      }
    }
  }, []);

  const startVoiceRecognition = () => {
    if (recognition.current && !isListening) {
      setIsListening(true);
      recognition.current.start();
    }
  };

  const stopVoiceRecognition = () => {
    if (recognition.current && isListening) {
      recognition.current.stop();
      setIsListening(false);
    }
  };

  const speakText = (text) => {
    if (synthesis.current && !isSpeaking) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthesis.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthesis.current && isSpeaking) {
      synthesis.current.cancel();
      setIsSpeaking(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          context: 'email_marketing_assistant'
        })
      });

      const result = await response.json();

      if (response.ok) {
        const assistantMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: result.response,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        // Optional: Auto-speak the response
        if (result.response && result.response.length < 500) {
          setTimeout(() => speakText(result.response), 500);
        }
      } else {
        toast.error(result.error || 'Erreur lors de la communication avec l\'assistant');
      }
    } catch (error) {
      toast.error('Erreur de connexion avec l\'assistant IA');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'assistant',
        content: 'Chat effacé ! Comment puis-je vous aider maintenant ?',
        timestamp: new Date()
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`bg-white rounded-lg shadow-2xl border transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-96'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            <span className="font-semibold">Assistant IA Personnel</span>
            {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-white/20 rounded"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-white/20 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'assistant' && (
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-xs p-3 rounded-lg text-sm ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-white border rounded-bl-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  {message.type === 'user' && (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-white rounded-b-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 relative">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Tapez votre message ou utilisez la voix..."
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows="1"
                    style={{ minHeight: '38px' }}
                  />
                  {isListening && (
                    <div className="absolute right-2 top-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
                    className={`p-2 rounded-lg transition-colors ${
                      isListening 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title="Reconnaissance vocale"
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={isSpeaking ? stopSpeaking : () => {
                      const lastAssistantMessage = [...messages].reverse().find(m => m.type === 'assistant');
                      if (lastAssistantMessage) speakText(lastAssistantMessage.content);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      isSpeaking 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title="Synthèse vocale"
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
                
                <button
                  onClick={clearChat}
                  className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded"
                >
                  Effacer
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;