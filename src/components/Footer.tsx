'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, Shield, Accessibility, Heart } from 'lucide-react';
import { useLanguage } from '@/lib/providers';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer
      style={{
        background: 'var(--text-primary)',
        color: 'var(--text-inverse)',
        padding: '60px 24px 32px',
      }}
      className="no-print"
    >
      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
            marginBottom: '40px',
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '14px',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  background: 'linear-gradient(135deg, var(--accent-500), var(--emerald-500))',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Building2 size={16} />
              </div>
              <span style={{ fontSize: 16, fontWeight: 700 }}>
                CivicBridge AI
              </span>
            </div>
            <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.6, maxWidth: 280 }}>
              {t.footer.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16, color: '#64748B' }}>
              Navigation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link href="/" style={{ fontSize: 14, color: '#CBD5E1', textDecoration: 'none' }}>
                {t.nav.home}
              </Link>
              <Link href="/assistant" style={{ fontSize: 14, color: '#CBD5E1', textDecoration: 'none' }}>
                {t.nav.assistant}
              </Link>
              <Link href="/services" style={{ fontSize: 14, color: '#CBD5E1', textDecoration: 'none' }}>
                {t.nav.services}
              </Link>
              <Link href="/action-plans" style={{ fontSize: 14, color: '#CBD5E1', textDecoration: 'none' }}>
                {t.nav.actionPlans}
              </Link>
            </div>
          </div>

          {/* Info Links */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16, color: '#64748B' }}>
              Information
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link href="/about" style={{ fontSize: 14, color: '#CBD5E1', textDecoration: 'none' }}>
                {t.nav.about}
              </Link>
              <Link href="/privacy" style={{ fontSize: 14, color: '#CBD5E1', textDecoration: 'none' }}>
                {t.nav.privacy}
              </Link>
            </div>
          </div>

          {/* Trust Badges */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16, color: '#64748B' }}>
              Commitments
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#94A3B8' }}>
                <Shield size={14} style={{ color: 'var(--accent-400)' }} />
                Privacy-first
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#94A3B8' }}>
                <Accessibility size={14} style={{ color: 'var(--accent-400)' }} />
                {t.footer.accessibility}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#94A3B8' }}>
                <Heart size={14} style={{ color: 'var(--accent-400)' }} />
                {t.footer.madeWith}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            borderTop: '1px solid #1E293B',
            paddingTop: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            alignItems: 'center',
          }}
        >
          <p style={{ fontSize: 12, color: '#64748B', textAlign: 'center', maxWidth: 700, lineHeight: 1.6 }}>
            {t.footer.disclaimer}
          </p>
          <p style={{ fontSize: 12, color: '#475569' }}>
            © 2026 CivicBridge AI
          </p>
        </div>
      </div>
    </footer>
  );
}
