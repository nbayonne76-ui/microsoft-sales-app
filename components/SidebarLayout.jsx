'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import Navigation from './Navigation';
import { Menu, Bot } from 'lucide-react';

const SidebarCtx = createContext({ collapsed: false, setCollapsed: () => {} });
export const useSidebar = () => useContext(SidebarCtx);

export default function SidebarLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  return (
    <SidebarCtx.Provider value={{ collapsed, setCollapsed }}>
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
            <span className="font-semibold text-gray-800 text-sm">Campaign Manager</span>
          </div>
        )}
        {children}
      </main>
    </SidebarCtx.Provider>
  );
}
