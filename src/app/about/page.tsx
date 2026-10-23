'use client';

import React from 'react';
import {
  Target, Lightbulb, AlertTriangle, Users, Brain, Shield, Scale,
  Heart, Globe, BookOpen,
} from 'lucide-react';
import { useLanguage } from '@/lib/providers';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 80px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 8 }}>
        {t.about.title}
      </h1>
      <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 40 }}>
        A universal bridge between human intent and complex systems — making public services, emergency guidance, and critical information accessible to everyone.
      </p>

      {/* Mission */}
      <Section icon={<Target size={20} />} title={t.about.mission}>
        <p>CivicBridge AI exists to ensure that navigating public services, understanding official documents, responding to emergencies, and accessing government benefits should not require specialized knowledge or digital expertise.</p>
        <p>Too often, critical information is buried in bureaucratic language, spread across multiple agencies, or simply unavailable in a form that ordinary citizens can act upon. We aim to bridge that gap using responsible AI technology.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 20 }}>
          {[
            { icon: Users, label: 'Accessibility', desc: 'Designed for everyone regardless of digital literacy' },
            { icon: Globe, label: 'Multilingual', desc: 'Support for English, Hindi, and Marathi' },
            { icon: Heart, label: 'Public Benefit', desc: 'Built to serve societal needs, not commercial gain' },
            { icon: Shield, label: 'Trust First', desc: 'Transparent about limitations and data handling' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <item.icon size={20} style={{ color: 'var(--accent-600)', margin: '0 auto 8px' }} />
              <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{item.label}</h4>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Approach */}
      <Section icon={<Lightbulb size={20} />} title={t.about.approach}>
        <p>CivicBridge AI transforms natural human input — text, images, documents, or voice — into structured, actionable guidance through a careful multi-step process:</p>
        <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
          <li><strong>Understanding Intent:</strong> We use Google Gemini AI to interpret what the user needs, even when the request is incomplete or informal.</li>
          <li><strong>Extracting Facts:</strong> Key information is identified from user input, uploaded documents, and images, with confidence levels tracked transparently.</li>
          <li><strong>Identifying Gaps:</strong> When critical information is missing, we ask targeted follow-up questions rather than making assumptions.</li>
          <li><strong>Assessing Priority:</strong> Situations are classified with a cautious, conservative approach — defaulting to routine unless clear indicators of urgency exist.</li>
          <li><strong>Generating Action Plans:</strong> Personalized, prioritized steps are created with explanations of why each action matters.</li>
          <li><strong>Citing Sources:</strong> Official sources are referenced with clear verification status indicators. We never present unverified information as confirmed fact.</li>
        </ol>
      </Section>

      {/* Limitations */}
      <Section icon={<AlertTriangle size={20} />} title={t.about.limitations}>
        <p>Honesty about limitations is a core value. Please understand:</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
          {[
            { icon: Brain, text: 'AI can be wrong. Language models generate plausible responses that may contain factual errors, outdated information, or misinterpretations.' },
            { icon: Scale, text: 'This is not legal, medical, or financial advice. Our guidance is informational only and does not replace consultation with qualified professionals.' },
            { icon: Shield, text: 'We cannot verify all sources in real-time. Verification status badges honestly reflect the current state of our verification process.' },
            { icon: BookOpen, text: 'Government schemes and eligibility criteria change. Always verify current information on official government portals before applying.' },
            { icon: AlertTriangle, text: 'We cannot dispatch emergency services. In genuine emergencies, always contact official emergency numbers directly (112 in India).' },
          ].map((item, i) => (
            <div key={i} className="alert alert-warning" style={{ padding: '12px 16px' }}>
              <item.icon size={16} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 13, lineHeight: 1.6 }}>{item.text}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Technology */}
      <Section icon={<Brain size={20} />} title="Technology">
        <p>CivicBridge AI is built with modern, open technologies:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
          {['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Google Gemini AI', 'Zod Validation', 'Lucide Icons'].map(tech => (
            <span key={tech} className="badge badge-gray">{tech}</span>
          ))}
        </div>
        <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-tertiary)' }}>
          The source code prioritizes security, accessibility, and responsible AI use. API keys are kept server-side, user inputs are validated, and safety disclaimers are contextually appropriate.
        </p>
      </Section>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ color: 'var(--accent-600)' }}>{icon}</span>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h2>
      </div>
      <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {children}
      </div>
    </section>
  );
}
