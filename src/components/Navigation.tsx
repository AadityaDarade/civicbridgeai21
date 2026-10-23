'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, X, Globe, Building2, Bot, Compass, ClipboardList, Info,
} from 'lucide-react';
import { useLanguage } from '@/lib/providers';
import type { Language } from '@/lib/i18n';

const languages: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'mr', label: 'मराठी' },
];

export default function Navigation() {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t.nav.home, icon: Building2 },
    { href: '/assistant', label: t.nav.assistant, icon: Bot },
    { href: '/services', label: t.nav.services, icon: Compass },
    { href: '/action-plans', label: t.nav.actionPlans, icon: ClipboardList },
    { href: '/about', label: t.nav.about, icon: Info },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(12px)',
        background: 'rgba(250, 250, 248, 0.92)',
        borderBottom: '1px solid var(--border-light)',
        height: 'var(--nav-height)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          padding: '0 24px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: 'var(--text-primary)',
          }}
          aria-label="CivicBridge AI Home"
        >
          <div
            style={{
              width: 34,
              height: 34,
              background: 'linear-gradient(135deg, var(--accent-600), var(--emerald-600))',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <Building2 size={18} />
          </div>
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            CivicBridge
            <span style={{ color: 'var(--accent-600)', marginLeft: 3 }}>AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
          className="desktop-nav"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: '7px 14px',
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--accent-700)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--accent-50)' : 'transparent',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--bg-hover)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Language Selector */}
          <div style={{ position: 'relative' }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              aria-label="Select language"
              aria-expanded={langMenuOpen}
              style={{ gap: 4 }}
            >
              <Globe size={16} />
              <span className="desktop-only">{languages.find((l) => l.code === language)?.label}</span>
            </button>
            {langMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: 4,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  minWidth: 140,
                  zIndex: 100,
                  overflow: 'hidden',
                }}
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangMenuOpen(false);
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '8px 14px',
                      textAlign: 'left',
                      fontSize: 14,
                      background: language === lang.code ? 'var(--accent-50)' : 'transparent',
                      color: language === lang.code ? 'var(--accent-700)' : 'var(--text-primary)',
                      fontWeight: language === lang.code ? 600 : 400,
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      if (language !== lang.code) e.currentTarget.style.background = 'var(--bg-hover)';
                    }}
                    onMouseLeave={(e) => {
                      if (language !== lang.code) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CTA */}
          <Link href="/assistant" className="btn btn-primary btn-sm desktop-only">
            {t.nav.getHelp}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="btn btn-ghost btn-icon mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? t.nav.close : t.nav.menu}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'var(--nav-height)',
            left: 0,
            right: 0,
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-lg)',
            padding: '12px 16px',
            zIndex: 40,
          }}
          className="fade-in"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 14px',
                  fontSize: 15,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--accent-700)' : 'var(--text-primary)',
                  textDecoration: 'none',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--accent-50)' : 'transparent',
                }}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
          <div style={{ padding: '8px 14px', marginTop: 8 }}>
            <Link
              href="/assistant"
              className="btn btn-primary"
              onClick={() => setMobileMenuOpen(false)}
              style={{ width: '100%' }}
            >
              {t.nav.getHelp}
            </Link>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-only { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
        }
      `}</style>
    </header>
  );
}
