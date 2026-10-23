'use client';

import React from 'react';
import { Shield, Eye, Database, Lock, Trash2, FileText, AlertTriangle } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 80px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 8 }}>
        Privacy & Data Handling
      </h1>
      <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 40 }}>
        Understanding how CivicBridge AI handles your information.
      </p>

      <Section icon={<Eye size={20} />} title="What We Collect">
        <p>CivicBridge AI processes the information you provide voluntarily — text descriptions, uploaded images, and documents — solely to generate assistance and action plans.</p>
        <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <li><strong>Text input:</strong> The description you type or dictate is sent to Google Gemini AI for analysis.</li>
          <li><strong>Uploaded files:</strong> Images and documents are processed during your session to extract relevant information. They are not stored permanently by default.</li>
          <li><strong>Voice input:</strong> Speech-to-text processing happens locally in your browser. Audio is not transmitted to our servers.</li>
          <li><strong>Action plans:</strong> Plans generated during your session are stored in your browser&apos;s memory. They are lost when you close the tab unless persistent storage is configured.</li>
        </ul>
      </Section>

      <Section icon={<Database size={20} />} title="How Data Is Processed">
        <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <li>Your input text is sent to Google&apos;s Gemini API through our secure server-side endpoint. We do not log the content of your requests.</li>
          <li>Uploaded images are converted to base64 and sent to Gemini for multimodal analysis. They are not saved to disk on our servers.</li>
          <li>API keys and configuration are kept exclusively on the server side. They are never exposed to your browser.</li>
          <li>No cookies or tracking scripts are used beyond basic functionality.</li>
        </ul>
      </Section>

      <Section icon={<Lock size={20} />} title="Data Security">
        <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <li>All server communication uses HTTPS encryption.</li>
          <li>File uploads are validated for type and size on both client and server.</li>
          <li>Rate limiting protects against abuse.</li>
          <li>Input validation prevents injection attacks.</li>
          <li>Uploaded document content is treated as untrusted data — instructions found in documents are never executed.</li>
        </ul>
      </Section>

      <Section icon={<Shield size={20} />} title="What We Don't Do">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            'We do not require account creation or login for basic assistance.',
            'We do not sell, share, or monetize your personal information.',
            'We do not store raw uploaded files after your session ends.',
            'We do not use your data to train AI models.',
            'We do not track your browsing behavior across websites.',
            'We do not store sensitive medical documents unless you explicitly configure secure storage.',
            'We do not put secrets, tokens, or API keys in browser local storage.',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, fontSize: 14, color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--accent-600)', flexShrink: 0 }}>✓</span>
              {item}
            </div>
          ))}
        </div>
      </Section>

      <Section icon={<Trash2 size={20} />} title="Your Controls">
        <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <li><strong>Session data:</strong> Close the browser tab to clear all session-stored action plans.</li>
          <li><strong>Delete plans:</strong> Use the delete button on any action plan to remove it immediately.</li>
          <li><strong>File uploads:</strong> Remove uploaded files at any time before submission using the × button.</li>
          <li><strong>New assessment:</strong> Start a fresh session at any time to clear previous results.</li>
        </ul>
      </Section>

      <Section icon={<FileText size={20} />} title="Third-Party Services">
        <p>CivicBridge AI uses the following third-party services:</p>
        <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <li><strong>Google Gemini AI:</strong> Processes your text and file inputs to generate structured assistance. Subject to <a href="https://ai.google.dev/terms" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-600)' }}>Google&apos;s AI terms of service</a>.</li>
          <li><strong>Google Fonts:</strong> Loads the Inter typeface for display purposes.</li>
        </ul>
      </Section>

      <div className="alert alert-warning" style={{ marginTop: 32 }}>
        <AlertTriangle size={18} style={{ flexShrink: 0 }} />
        <div>
          <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>Important Recommendation</p>
          <p style={{ fontSize: 13, lineHeight: 1.6 }}>
            Avoid sharing passwords, government identity numbers (Aadhaar, PAN), bank account details, or other unnecessary sensitive information in your queries. Share only the context needed to get helpful guidance.
          </p>
        </div>
      </div>

      <p style={{ marginTop: 32, fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'center' }}>
        This privacy notice describes current practices. CivicBridge AI does not claim specific regulatory compliance without independent verification.
      </p>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{ color: 'var(--accent-600)' }}>{icon}</span>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h2>
      </div>
      <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {children}
      </div>
    </section>
  );
}
