import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-[#0A0B0E] text-[#F9FAFB] border-t-8 border-[#3B82F6] selection:bg-[#3B82F6]/30 selection:text-white font-sans antialiased">
    <Navbar />
    <main>{children}</main>
    <Footer />
  </div>
);
