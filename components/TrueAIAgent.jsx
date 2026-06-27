'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Brain, Send, Copy, Trash2, ChevronRight, CheckCheck, Zap } from 'lucide-react';

const SLASH_COMMANDS = [
  { cmd: '/brief',          label: 'Brief commercial',      example: '/brief Airbus',              color: 'blue'   },
  { cmd: '/email',          label: 'Angle email',            example: '/email TotalEnergies',       color: 'green'  },
  { cmd: '/pitch',          label: 'Pitch 2 min',            example: '/pitch Microsoft 365 E5',    color: 'purple' },
  { cmd: '/swot',           label: 'Analyse SWOT',           example: '/swot SNCF',                 color: 'orange' },
  { cmd: '/prix',           label: 'Prix & plans KB',        example: '/prix Copilot',              color: 'red'    },
  { cmd: '/compare',        label: 'Comparaison produits',   example: '/compare E3 vs E5',          color: 'indigo' },
  { cmd: '/feature',        label: 'Features par plan',      example: '/feature Teams',             color: 'teal'   },
  { cmd: '/compare-plans',  label: 'Comparatif plans',       example: '/compare-plans E3 vs E5',    color: 'violet' },
  { cmd: '/intune',         label: 'Intune Plans',           example: '/intune',                    color: 'slate'  },
  { cmd: '/copilot-studio', label: 'Copilot Studio',         example: '/copilot-studio',            color: 'pink'   },
  { cmd: '/github-copilot', label: 'GitHub Copilot',         example: '/github-copilot Business',   color: 'gray'   },
];

const COLOR_MAP = {
  blue:   'bg-blue-100 text-blue-700 hover:bg-blue-200',
  green:  'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
  purple: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
  orange: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
  red:    'bg-red-100 text-red-700 hover:bg-red-200',
  indigo: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
  teal:   'bg-teal-100 text-teal-700 hover:bg-teal-200',
  violet: 'bg-violet-100 text-violet-700 hover:bg-violet-200',
  slate:  'bg-slate-100 text-slate-700 hover:bg-slate-200',
  pink:   'bg-pink-100 text-pink-700 hover:bg-pink-200',
  gray:   'bg-gray-100 text-gray-700 hover:bg-gray-200',
};

const KB_TOPIC_COLORS = {
  m365:     'bg-blue-100 text-blue-700',
  azure:    'bg-sky-100 text-sky-700',
  dynamics: 'bg-orange-100 text-orange-700',
  power:    'bg-yellow-100 text-yellow-700',
  security: 'bg-red-100 text-red-700',
  bundles:  'bg-purple-100 text-purple-700',
};

function StreamingDots() {
  return (
    <span className="inline-flex items-center gap-0.5 ml-1">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

function MessageBubble({ msg, onCopy, copied }) {
  const isUser = msg.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
        ${isUser ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white' : 'bg-gradient-to-br from-violet-500 to-purple-700 text-white'}`}>
        {isUser ? 'N' : <Brain className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      <div className={`group relative max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap
          ${isUser
            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-sm'
            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'
          }`}>
          {msg.content}
          {msg.streaming && <StreamingDots />}
        </div>

        {/* Copy button : assistant only */}
        {!isUser && !msg.streaming && msg.content && (
          <button
            onClick={() => onCopy(msg.content)}
            className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 pl-1"
          >
            {copied ? <CheckCheck className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copié' : 'Copier'}
          </button>
        )}

        {/* KB topics badge */}
        {msg.kbTopics?.length > 0 && (
          <div className="flex flex-wrap gap-1 pl-1 mt-0.5">
            {msg.kbTopics.map(t => (
              <span key={t} className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${KB_TOPIC_COLORS[t] || 'bg-slate-100 text-slate-600'}`}>
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrueAIAgent() {
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState('');
  const [streaming, setStreaming] = useState(false);
  const [kbTopics, setKbTopics]   = useState([]);
  const [copiedId, setCopiedId]   = useState(null);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);
  const readerRef  = useRef(null);

  // Auto-scroll on new content
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const copyText = useCallback(async (text) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(text.slice(0, 20));
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const clearChat = useCallback(() => {
    readerRef.current?.cancel();
    setMessages([]);
    setStreaming(false);
    setKbTopics([]);
    setInput('');
  }, []);

  const sendMessage = useCallback(async (text) => {
    const userText = (text || input).trim();
    if (!userText || streaming) return;

    setInput('');
    const userMsg = { role: 'user', content: userText, id: Date.now() };

    setMessages(prev => [
      ...prev,
      userMsg,
      { role: 'assistant', content: '', streaming: true, id: Date.now() + 1 },
    ]);
    setStreaming(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/ai-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, userMessage: userText }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      readerRef.current = reader;
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const payload = JSON.parse(line.slice(6));

            if (payload.delta) {
              setMessages(prev => {
                const next = [...prev];
                const last = next[next.length - 1];
                if (last?.role === 'assistant') {
                  next[next.length - 1] = { ...last, content: last.content + payload.delta };
                }
                return next;
              });
            }

            if (payload.done) {
              const topics = payload.kbTopics || [];
              setKbTopics(topics);
              setMessages(prev => {
                const next = [...prev];
                const last = next[next.length - 1];
                if (last?.role === 'assistant') {
                  next[next.length - 1] = { ...last, streaming: false, kbTopics: topics };
                }
                return next;
              });
              setStreaming(false);
            }
          } catch { /* malformed line : skip */ }
        }
      }
    } catch (err) {
      setMessages(prev => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last?.role === 'assistant' && last.streaming) {
          next[next.length - 1] = {
            ...last,
            content: `Erreur de connexion. Réessaie. (${err.message})`,
            streaming: false,
          };
        }
        return next;
      });
      setStreaming(false);
    }
  }, [input, messages, streaming]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-900">Microsoft AI Agent</h1>
            <p className="text-xs text-slate-500">Alimenté par la Knowledge Base Microsoft</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Active KB topics */}
          {kbTopics.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <div className="flex gap-1">
                {kbTopics.map(t => (
                  <span key={t} className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${KB_TOPIC_COLORS[t] || 'bg-slate-100 text-slate-600'}`}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Effacer
            </button>
          )}
        </div>
      </div>

      {/* ── Messages area ──────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
        {isEmpty ? (
          /* Empty state : slash command suggestions */
          <div className="flex flex-col items-center justify-center h-full gap-8 text-center px-4">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Que puis-je faire pour toi ?</h2>
              <p className="text-sm text-slate-500 max-w-md">
                Pose une question libre ou utilise une commande rapide.<br />
                Toutes les réponses s'appuient sur la Knowledge Base Microsoft.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-xl">
              {SLASH_COMMANDS.map(({ cmd, label, example, color }) => (
                <button
                  key={cmd}
                  onClick={() => { setInput(example); inputRef.current?.focus(); }}
                  className={`flex flex-col items-start gap-1 p-3 rounded-xl border border-transparent text-left transition-all ${COLOR_MAP[color]}`}
                >
                  <span className="text-xs font-mono font-bold">{cmd}</span>
                  <span className="text-xs opacity-80">{label}</span>
                  <span className="text-[10px] opacity-60 font-mono truncate w-full">{example}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              onCopy={copyText}
              copied={copiedId === msg.content?.slice(0, 20)}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Input bar ──────────────────────────────────────────────── */}
      <div className="px-4 pb-4 pt-2 bg-white border-t border-slate-200">
        {/* Quick command chips (visible when typing /) */}
        {input.startsWith('/') && (
          <div className="flex gap-2 mb-2 flex-wrap">
            {SLASH_COMMANDS.filter(c => c.cmd.startsWith(input.split(' ')[0])).map(({ cmd, label, color }) => (
              <button
                key={cmd}
                onClick={() => { setInput(cmd + ' '); inputRef.current?.focus(); }}
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium transition-all ${COLOR_MAP[color]}`}
              >
                <span className="font-mono">{cmd}</span>
                <ChevronRight className="w-3 h-3 opacity-60" />
                <span className="opacity-80">{label}</span>
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Pose une question ou tape /brief, /feature Teams, /compare-plans E3 vs E5, /intune…"
            rows={1}
            className="flex-1 resize-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all max-h-32 overflow-y-auto"
            style={{ lineHeight: '1.5' }}
            disabled={streaming}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || streaming}
            className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:from-violet-600 hover:to-purple-800"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5 text-center">
          Entrée pour envoyer · Shift+Entrée pour saut de ligne
        </p>
      </div>
    </div>
  );
}
