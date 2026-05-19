'use client';

import { useState, createContext, useContext } from 'react';
import Navigation from './Navigation';

const SidebarCtx = createContext({ collapsed: false, setCollapsed: () => {} });
export const useSidebar = () => useContext(SidebarCtx);

export default function SidebarLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarCtx.Provider value={{ collapsed, setCollapsed }}>
      <Navigation collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className="min-h-screen transition-all duration-300"
        style={{ paddingLeft: collapsed ? '68px' : '220px' }}
      >
        {children}
      </main>
    </SidebarCtx.Provider>
  );
}
