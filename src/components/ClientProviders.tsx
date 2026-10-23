'use client';

import React, { type ReactNode } from 'react';
import { LanguageProvider, ActionPlansProvider } from '@/lib/providers';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <ActionPlansProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navigation />
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <Footer />
        </div>
      </ActionPlansProvider>
    </LanguageProvider>
  );
}
