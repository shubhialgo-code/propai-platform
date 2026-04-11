import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import ChatBot from './ChatBot';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <ChatBot />
    </div>
  );
};

export default Layout;
