'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  GraduationCap, FileSearch, CloudRain, Stethoscope, Building, TrafficCone,
  ArrowRight, CheckCircle2, Sparkles, Search, Shield, AlertTriangle, UserCheck,
  MessageSquare, Brain, ClipboardCheck, Zap,
} from 'lucide-react';
import InputComposer from '@/components/InputComposer';
import { useLanguage } from '@/lib/providers';
import type { UploadedFile } from '@/lib/types';

const exampleIcons = {
  schemes: GraduationCap,
  document: FileSearch,
  disaster: CloudRain,
  medical: Stethoscope,
  publicServices: Building,
  traffic: TrafficCone,
};

const exampleSampleInputs: Record<string, string> = {
  schemes: "I'm a college student in Maharashtra. My family income is around ₹4 lakh per year. I want to know which scholarships I may qualify for.",
  document: "I received a notice from the municipal corporation about property tax reassessment. I don't understand what it means or what I need to do.",
  disaster: "There is heavy flooding in my area. Water levels are rising and I need to know what to do. How can I stay safe and who should I contact for help?",
  medical: "I have a blood test report from my recent health checkup. I want to understand what the results mean in simple language and organize the information.",
  publicServices: "I need to get my driving license renewed. My current license expires next month. What is the process and what documents do I need?",
  traffic: "There are reports of landslides on the Mumbai-Pune Expressway. I need to travel tomorrow. What are the alternative routes and safety precautions?",
};

export default function HomePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = (text: string, files: UploadedFile[]) => {
    setIsSubmitting(true);
    // Store in sessionStorage and navigate to assistant with auto=true to immediately trigger Gemini
    sessionStorage.setItem('civicbridge_input', JSON.stringify({ text, fileCount: files.length }));
    router.push(`/assistant?input=${encodeURIComponent(text)}&auto=true`);
  };

  const handleExampleClick = (key: string) => {
    const input = exampleSampleInputs[key];
    if (input) {
      setIsSubmitting(true);
      sessionStorage.setItem('civicbridge_input', JSON.stringify({ text: input, fileCount: 0 }));
      router.push(`/assistant?input=${encodeURIComponent(input)}&auto=true`);
    }
  };

  const examples = [
    { key: 'schemes', title: t.examples.schemes, desc: t.examples.schemesDesc },
    { key: 'document', title: t.examples.document, desc: t.examples.documentDesc },
    { key: 'disaster', title: t.examples.disaster, desc: t.examples.disasterDesc },
    { key: 'medical', title: t.examples.medical, desc: t.examples.medicalDesc },
    { key: 'publicServices', title: t.examples.publicServices, desc: t.examples.publicServicesDesc },
    { key: 'traffic', title: t.examples.traffic, desc: t.examples.trafficDesc },
  ];

  const steps = [
    { icon: MessageSquare, title: t.howItWorks.step1, desc: t.howItWorks.step1Desc, color: 'var(--accent-600)' },
    { icon: Brain, title: t.howItWorks.step2, desc: t.howItWorks.step2Desc, color: 'var(--info-600)' },
    { icon: ClipboardCheck, title: t.howItWorks.step3, desc: t.howItWorks.step3Desc, color: 'var(--emerald-600)' },
    { icon: Zap, title: t.howItWorks.step4, desc: t.howItWorks.step4Desc, color: 'var(--warning-600)' },
  ];

  const trustItems = [
    { icon: AlertTriangle, text: t.trust.aiDisclaimer },
    { icon: Search, text: t.trust.sourcesProvided },
    { icon: Shield, text: t.trust.officialPriority },
    { icon: UserCheck, text: t.trust.humanSupport },
    { icon: CheckCircle2, text: t.trust.userControl },
  ];

  return (
    <div>
      {/* ── Hero Section ── */}
      <section
        style={{
          padding: '80px 24px 60px',
          background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-tertiary) 100%)',
        }}
      >
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
            <Sparkles size={16} style={{ color: 'var(--accent-600)' }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--accent-700)', letterSpacing: '0.02em' }}>
              AI-Powered Civic Assistance
            </span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: 'var(--text-primary)',
              marginBottom: 16,
            }}
          >
            {t.hero.headline}
          </h1>
          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 19px)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: 600,
              margin: '0 auto 36px',
            }}
          >
            {t.hero.subheadline}
          </p>

          {/* Input Composer */}
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <InputComposer
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
              size="large"
              showPrivacyNote
            />
          </div>
        </div>
      </section>

      {/* ── Examples Section ── */}
      <section className="section" style={{ paddingTop: 60 }}>
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">{t.examples.title}</h2>
            <p className="section-subtitle">{t.examples.subtitle}</p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 16,
            }}
          >
            {examples.map((ex) => {
              const Icon = exampleIcons[ex.key as keyof typeof exampleIcons];
              return (
                <button
                  key={ex.key}
                  className="card card-interactive"
                  style={{
                    textAlign: 'left',
                    padding: '20px 22px',
                    display: 'flex',
                    gap: 14,
                    alignItems: 'flex-start',
                    width: '100%',
                    border: '1px solid var(--border-light)',
                    background: 'var(--bg-secondary)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                  onClick={() => handleExampleClick(ex.key)}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--accent-50)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} style={{ color: 'var(--accent-600)' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                      {ex.title}
                    </h3>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {ex.desc}
                    </p>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        marginTop: 8,
                        fontSize: 12,
                        color: 'var(--accent-600)',
                        fontWeight: 500,
                      }}
                    >
                      Try this example <ArrowRight size={12} />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section" style={{ background: 'var(--bg-tertiary)' }}>
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">{t.howItWorks.title}</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 24,
            }}
          >
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="card"
                  style={{
                    textAlign: 'center',
                    padding: '32px 24px',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 'var(--radius-lg)',
                      background: `${step.color}12`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}
                  >
                    <Icon size={22} style={{ color: step.color }} />
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: 'var(--text-tertiary)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Step {i + 1}
                  </span>
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      margin: '8px 0',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Trust Section ── */}
      <section className="section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">{t.trust.title}</h2>
          </div>

          <div
            style={{
              maxWidth: 700,
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            {trustItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 14,
                    padding: '16px 20px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <Icon size={18} style={{ color: 'var(--accent-600)', marginTop: 2, flexShrink: 0 }} />
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
