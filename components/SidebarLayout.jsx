'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import Navigation from './Navigation';
import { Menu, Bot, Presentation, X } from 'lucide-react';

const SidebarCtx = createContext({ collapsed: false, setCollapsed: () => {}, presentationMode: false });
export const useSidebar = () => useContext(SidebarCtx);

export default function SidebarLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Ctrl+Shift+P → toggle presentation mode
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setPresentationMode(m => !m);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (presentationMode) {
    return (
      <SidebarCtx.Provider value={{ collapsed: true, setCollapsed, presentationMode }}>
        <div className="min-h-screen bg-gray-50">
          {/* Presentation mode banner */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-ms-blue text-white text-xs flex items-center justify-between px-4 py-1.5 no-print">
            <span className="flex items-center gap-1.5"><Presentation className="h-3.5 w-3.5" /> Mode présentation — Ctrl+Shift+P pour quitter</span>
            <button onClick={() => setPresentationMode(false)} className="hover:text-white/70 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="pt-7">{children}</div>
        </div>
      </SidebarCtx.Provider>
    );
  }

  return (
    <SidebarCtx.Provider value={{ collapsed, setCollapsed, presentationMode }}>
      {/* Mobile backdrop */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Navigation
        collapsed={isMobile ? false : collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <main
        className="min-h-screen transition-all duration-300"
        style={{ paddingLeft: isMobile ? 0 : (collapsed ? '68px' : '220px') }}
      >
        {/* Mobile top bar */}
        {isMobile && (
          <div className="sticky top-0 z-20 h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3 shadow-sm">
            <button
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Open menu"
              className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 rounded-lg shadow">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-gray-800 text-sm">Sales Intelligence</span>
          </div>
        )}
        {children}
      </main>
    </SidebarCtx.Provider>
  );
}
