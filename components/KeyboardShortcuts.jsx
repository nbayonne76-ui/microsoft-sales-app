"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Command, Keyboard, Zap, Search, ArrowRight } from 'lucide-react';

const KeyboardShortcuts = ({ 
  onOpenChatbot,
  onOpenScheduler, 
  onOpenContacts,
  onOpenSequences,
  onSaveEmail,
  onNewEmail 
}) => {
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Define all keyboard shortcuts
  const shortcuts = {
    // Global shortcuts
    'cmd+k': { action: () => setShowCommandPalette(true), description: 'Ouvrir la palette de commandes' },
    'cmd+/': { action: () => setShowCommandPalette(true), description: 'Aide et raccourcis' },
    'escape': { action: () => setShowCommandPalette(false), description: 'Fermer la palette' },
    
    // Quick actions
    'cmd+n': { action: onNewEmail, description: 'Nouveau email' },
    'cmd+i': { action: onOpenChatbot, description: 'Ouvrir l\'assistant IA' },
    'cmd+s': { action: onSaveEmail, description: 'Sauvegarder' },
    'cmd+shift+s': { action: onOpenScheduler, description: 'Programmer l\'envoi' },
    
    // Navigation
    'cmd+1': { action: onOpenChatbot, description: 'Assistant IA' },
    'cmd+2': { action: onOpenContacts, description: 'Contacts intelligents' },
    'cmd+3': { action: onOpenSequences, description: 'Séquences automatiques' },
    'cmd+4': { action: onOpenScheduler, description: 'Planification' },
    
    // Power user features
    'cmd+shift+c': { action: onOpenContacts, description: 'Palette de contacts' },
    'cmd+shift+a': { action: onOpenSequences, description: 'Automation avancée' },
    'cmd+enter': { action: () => {}, description: 'Envoyer l\'email' },
    'alt+enter': { action: () => {}, description: 'Programmer et envoyer' }
  };

  // Commands for the command palette
  const commands = [
    { id: 'new-email', title: 'Nouveau email', description: 'Créer un nouvel email', shortcut: 'Cmd+N', action: onNewEmail, icon: '✨' },
    { id: 'ai-assistant', title: 'Assistant IA', description: 'Ouvrir l\'assistant conversationnel', shortcut: 'Cmd+I', action: onOpenChatbot, icon: '🤖' },
    { id: 'smart-contacts', title: 'Contacts intelligents', description: 'Voir les suggestions de contacts', shortcut: 'Cmd+2', action: onOpenContacts, icon: '👥' },
    { id: 'schedule', title: 'Programmer l\'envoi', description: 'Planifier l\'email au moment optimal', shortcut: 'Cmd+Shift+S', action: onOpenScheduler, icon: '📅' },
    { id: 'sequences', title: 'Séquences automatiques', description: 'Configurer des suivis automatiques', shortcut: 'Cmd+3', action: onOpenSequences, icon: '🔄' },
    { id: 'save', title: 'Sauvegarder', description: 'Sauvegarder le brouillon', shortcut: 'Cmd+S', action: onSaveEmail, icon: '💾' },
    
    // Advanced commands
    { id: 'tone-casual', title: 'Ton décontracté', description: 'Changer le ton en décontracté', action: () => {}, icon: '😊' },
    { id: 'tone-formal', title: 'Ton formel', description: 'Changer le ton en formel', action: () => {}, icon: '👔' },
    { id: 'tone-friendly', title: 'Ton amical', description: 'Changer le ton en amical professionnel', action: () => {}, icon: '🤝' },
    { id: 'tone-urgent', title: 'Ton urgent', description: 'Changer le ton en urgent', action: () => {}, icon: '⚡' },
    
    // Templates quick access
    { id: 'template-prospect', title: 'Template prospection', description: 'Utiliser le template de prospection', action: () => {}, icon: '🎯' },
    { id: 'template-followup', title: 'Template suivi', description: 'Utiliser le template de suivi', action: () => {}, icon: '📧' },
    { id: 'template-proposal', title: 'Template proposition', description: 'Utiliser le template de proposition', action: () => {}, icon: '💼' },
  ];

  // Keyboard event handler
  const handleKeyDown = useCallback((event) => {
    const key = event.key.toLowerCase();
    const isCmd = event.metaKey || event.ctrlKey;
    const isShift = event.shiftKey;
    const isAlt = event.altKey;

    let shortcutKey = '';
    
    if (isCmd) shortcutKey += 'cmd+';
    if (isShift) shortcutKey += 'shift+';
    if (isAlt) shortcutKey += 'alt+';
    shortcutKey += key;

    // Handle command palette specific shortcuts
    if (showCommandPalette) {
      if (key === 'escape') {
        event.preventDefault();
        setShowCommandPalette(false);
        setSearchTerm('');
        setSelectedIndex(0);
      } else if (key === 'arrowdown') {
        event.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (key === 'arrowup') {
        event.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (key === 'enter') {
        event.preventDefault();
        const selectedCommand = filteredCommands[selectedIndex];
        if (selectedCommand?.action) {
          selectedCommand.action();
          setShowCommandPalette(false);
          setSearchTerm('');
          setSelectedIndex(0);
        }
      }
      return;
    }

    // Handle global shortcuts
    if (shortcuts[shortcutKey]) {
      event.preventDefault();
      shortcuts[shortcutKey].action();
    }
  }, [showCommandPalette, selectedIndex, shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Filter commands based on search
  const filteredCommands = commands.filter(command => 
    command.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    command.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm]);

  return (
    <>
      {/* Command Palette */}
      {showCommandPalette && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 z-50">
          <div className="w-full max-w-2xl mx-4 animate-fade-scale">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Search Header */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une commande ou action..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-lg placeholder-gray-400"
                  autoFocus
                />
                <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                  ESC
                </div>
              </div>

              {/* Commands List */}
              <div className="max-h-96 overflow-y-auto scrollbar-premium">
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((command, index) => (
                    <button
                      key={command.id}
                      onClick={() => {
                        command.action();
                        setShowCommandPalette(false);
                        setSearchTerm('');
                        setSelectedIndex(0);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ${
                        index === selectedIndex ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{command.icon}</span>
                          <div>
                            <div className="font-medium text-gray-800">{command.title}</div>
                            <div className="text-sm text-gray-500">{command.description}</div>
                          </div>
                        </div>
                        {command.shortcut && (
                          <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md font-mono">
                            {command.shortcut}
                          </div>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Aucune commande trouvée</p>
                    <p className="text-sm mt-1">Essayez "nouveau", "IA", "programmer"...</p>
                  </div>
                )}
              </div>

              {/* Footer with tips */}
              <div className="p-3 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <ArrowRight className="w-3 h-3" />
                      Entrée pour exécuter
                    </span>
                    <span className="flex items-center gap-1">
                      ↑↓ Naviguer
                    </span>
                  </div>
                  <span>Cmd+K pour rouvrir</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shortcuts Help Panel (floating) */}
      <ShortcutsHelpPanel shortcuts={shortcuts} />
    </>
  );
};

// Floating shortcuts help panel
const ShortcutsHelpPanel = ({ shortcuts }) => {
  const [isVisible, setIsVisible] = useState(false);

  const shortcutCategories = [
    {
      title: 'Navigation rapide',
      shortcuts: [
        { key: 'Cmd+K', desc: 'Palette de commandes' },
        { key: 'Cmd+1-4', desc: 'Naviguer entre les sections' },
        { key: 'Cmd+/', desc: 'Aide' }
      ]
    },
    {
      title: 'Actions principales',
      shortcuts: [
        { key: 'Cmd+N', desc: 'Nouveau email' },
        { key: 'Cmd+I', desc: 'Assistant IA' },
        { key: 'Cmd+S', desc: 'Sauvegarder' },
        { key: 'Cmd+↵', desc: 'Envoyer' }
      ]
    },
    {
      title: 'Fonctions avancées',
      shortcuts: [
        { key: 'Cmd+Shift+S', desc: 'Programmer' },
        { key: 'Cmd+Shift+C', desc: 'Contacts' },
        { key: 'Alt+↵', desc: 'Programmer et envoyer' }
      ]
    }
  ];

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-6 left-6 p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-200 z-40"
        data-tooltip="Raccourcis clavier"
      >
        <Keyboard className="w-5 h-5" />
      </button>

      {/* Shortcuts panel */}
      {isVisible && (
        <div className="fixed bottom-20 left-6 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Keyboard className="w-4 h-4" />
              Raccourcis clavier
            </h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4 max-h-80 overflow-y-auto scrollbar-premium">
            {shortcutCategories.map((category, index) => (
              <div key={index}>
                <h4 className="text-sm font-medium text-gray-700 mb-2">{category.title}</h4>
                <div className="space-y-1">
                  {category.shortcuts.map((shortcut, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{shortcut.desc}</span>
                      <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono border">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
            💡 Appuyez sur <kbd className="bg-gray-100 px-1 rounded">Cmd+K</kbd> n'importe où pour ouvrir la palette de commandes
          </div>
        </div>
      )}
    </>
  );
};

export default KeyboardShortcuts;