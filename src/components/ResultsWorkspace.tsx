'use client';

import React, { useState, useCallback } from 'react';
import {
  CheckCircle2, Circle, ExternalLink, AlertTriangle, Info, Shield, Copy,
  Printer, RotateCcw, ChevronDown, ChevronUp, Clock, FileText, HelpCircle,
  AlertCircle, BookOpen, MessageSquare,
} from 'lucide-react';
import { useLanguage } from '@/lib/providers';
import type { AssistantResponse, ActionItem, Source } from '@/lib/types';
import LiveGeminiChat from '@/components/LiveGeminiChat';

interface ResultsWorkspaceProps {
  response: AssistantResponse;
  completedActions: string[];
  onToggleAction: (actionId: string) => void;
  onStartNew: () => void;
  isDemo?: boolean;
}

export default function ResultsWorkspace({
  response,
  completedActions,
  onToggleAction,
  onStartNew,
  isDemo = false,
}: ResultsWorkspaceProps) {
  const { t } = useLanguage();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    summary: true,
    priority: true,
    actions: true,
    sources: true,
    missing: true,
    chat: true,
    safety: true,
  });
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = completedActions.length;
  const totalActions = response.actions.length;
  const progress = totalActions > 0 ? Math.round((completedCount / totalActions) * 100) : 0;

  const urgencyConfig = {
    routine: { label: t.assistant.routine, className: 'badge-teal', icon: Clock },
    time_sensitive: { label: t.assistant.timeSensitive, className: 'badge-amber', icon: AlertTriangle },
    urgent: { label: t.assistant.urgent, className: 'badge-red', icon: AlertCircle },
  };

  const priorityConfig = {
    low: { label: 'Low', color: 'var(--text-tertiary)' },
    normal: { label: 'Normal', color: 'var(--accent-700)' },
    high: { label: 'High', color: 'var(--warning-700)' },
    critical: { label: 'Critical', color: 'var(--danger-700)' },
  };

  const copyPlan = useCallback(async () => {
    const text = response.actions
      .map((a, i) => `${i + 1}. ${a.title}\n   ${a.description}`)
      .join('\n\n');
    const fullText = `CivicBridge AI - Action Plan\n\n${response.summary}\n\n${text}\n\nDisclaimer: ${response.disclaimer}`;
    try {
      await navigator.clipboard.writeText(fullText);
      alert(t.common.copiedToClipboard);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = fullText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  }, [response, t]);

  const printPlan = useCallback(() => {
    window.print();
  }, []);

  const UrgencyIcon = urgencyConfig[response.urgency]?.icon || Clock;

  return (
    <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Demo Banner */}
      {isDemo && (
        <div className="demo-banner">
          <Info size={16} />
          <span>{t.assistant.demoBanner}</span>
        </div>
      )}

      {/* Progress Bar */}
      {totalActions > 0 && (
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
            <span style={{ fontWeight: 500 }}>{t.assistant.actionPlan}</span>
            <span style={{ color: 'var(--text-secondary)' }}>
              {completedCount}/{totalActions} {t.actionPlans.completed} ({progress}%)
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* ── Section: Situation Summary ── */}
      <CollapsibleSection
        title={t.assistant.situationSummary}
        icon={<BookOpen size={18} />}
        isOpen={expandedSections.summary}
        onToggle={() => toggleSection('summary')}
      >
        <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 16 }}>
          {response.summary}
        </p>

        {/* Extracted Facts */}
        {response.extractedFacts.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>
              {t.assistant.extractedFacts}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {response.extractedFacts.map((fact, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8,
                    padding: '8px 12px',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 14,
                  }}
                >
                  <CheckCircle2 size={14} style={{ color: 'var(--accent-600)', marginTop: 3, flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>{fact.fact}</span>
                  <span
                    className="badge badge-gray"
                    style={{ fontSize: 11 }}
                    title={`Source: ${fact.source}, Confidence: ${Math.round(fact.confidence * 100)}%`}
                  >
                    {fact.source === 'user_input' ? 'User' : fact.source === 'document' ? 'Doc' : fact.source === 'image' ? 'Image' : 'AI'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Uncertainties */}
        {response.uncertainties.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>
              {t.assistant.uncertainties}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {response.uncertainties.map((u, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8,
                    fontSize: 14,
                    color: 'var(--text-secondary)',
                    padding: '4px 0',
                  }}
                >
                  <HelpCircle size={14} style={{ color: 'var(--warning-500)', marginTop: 3, flexShrink: 0 }} />
                  {u}
                </div>
              ))}
            </div>
          </div>
        )}
      </CollapsibleSection>

      {/* ── Section: Priority Assessment ── */}
      <CollapsibleSection
        title={t.assistant.priorityAssessment}
        icon={<UrgencyIcon size={18} />}
        isOpen={expandedSections.priority}
        onToggle={() => toggleSection('priority')}
        badge={
          <span className={`badge ${urgencyConfig[response.urgency]?.className || 'badge-teal'}`}>
            {urgencyConfig[response.urgency]?.label || response.urgency}
          </span>
        }
      >
        <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
          {response.urgencyExplanation}
        </p>
      </CollapsibleSection>

      {/* ── Section: Action Plan ── */}
      <CollapsibleSection
        title={t.assistant.actionPlan}
        icon={<FileText size={18} />}
        isOpen={expandedSections.actions}
        onToggle={() => toggleSection('actions')}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {response.actions.map((action) => (
            <ActionCard
              key={action.id}
              action={action}
              isCompleted={completedActions.includes(action.id)}
              onToggle={() => onToggleAction(action.id)}
              sources={response.sources}
              priorityConfig={priorityConfig}
            />
          ))}
        </div>
      </CollapsibleSection>

      {/* ── Section: Follow-up Questions ── */}
      {response.followUpQuestions.length > 0 && (
        <CollapsibleSection
          title={t.assistant.missingInfo}
          icon={<HelpCircle size={18} />}
          isOpen={expandedSections.missing}
          onToggle={() => toggleSection('missing')}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {response.followUpQuestions.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setSelectedQuestion(q);
                  setExpandedSections((prev) => ({ ...prev, chat: true }));
                }}
                className="card-interactive"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  padding: '12px 14px',
                  background: 'var(--info-50)',
                  border: '1px solid var(--info-100)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 14,
                  color: '#1E40AF',
                  textAlign: 'left',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <Info size={16} style={{ flexShrink: 0 }} />
                  <span>{q}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-600)', whiteSpace: 'nowrap' }}>
                  Ask Gemini &rarr;
                </span>
              </button>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* ── Section: Evidence & Sources ── */}
      {response.sources.length > 0 && (
        <CollapsibleSection
          title={t.assistant.evidence}
          icon={<BookOpen size={18} />}
          isOpen={expandedSections.sources}
          onToggle={() => toggleSection('sources')}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {response.sources.map((source) => (
              <SourceCard key={source.id} source={source} t={t} />
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* ── Section: Live Gemini Interactive Chat ── */}
      <CollapsibleSection
        title="Live Gemini AI Conversation"
        icon={<MessageSquare size={18} />}
        isOpen={expandedSections.chat}
        onToggle={() => toggleSection('chat')}
      >
        <LiveGeminiChat
          contextSummary={response.summary}
          initialQuestion={selectedQuestion}
          onClearInitialQuestion={() => setSelectedQuestion(null)}
        />
      </CollapsibleSection>

      {/* ── Section: Safety Notice ── */}
      <CollapsibleSection
        title={t.assistant.safetyNotice}
        icon={<Shield size={18} />}
        isOpen={expandedSections.safety}
        onToggle={() => toggleSection('safety')}
      >
        <div className="alert alert-warning">
          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
          <p style={{ fontSize: 13, lineHeight: 1.6 }}>{response.disclaimer}</p>
        </div>
      </CollapsibleSection>

      {/* ── Action Buttons ── */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          paddingTop: 16,
          borderTop: '1px solid var(--border-light)',
        }}
      >
        <button className="btn btn-secondary btn-sm" onClick={copyPlan}>
          <Copy size={14} />
          {t.assistant.copyPlan}
        </button>
        <button className="btn btn-secondary btn-sm" onClick={printPlan}>
          <Printer size={14} />
          {t.assistant.printPlan}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={onStartNew} style={{ marginLeft: 'auto' }}>
          <RotateCcw size={14} />
          {t.assistant.startNew}
        </button>
      </div>
    </div>
  );
}

// ── Collapsible Section ──
function CollapsibleSection({
  title,
  icon,
  badge,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '16px 20px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontSize: 15,
          fontWeight: 600,
          color: 'var(--text-primary)',
        }}
        aria-expanded={isOpen}
      >
        <span style={{ color: 'var(--accent-600)' }}>{icon}</span>
        <span style={{ flex: 1 }}>{title}</span>
        {badge}
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isOpen && (
        <div style={{ padding: '0 20px 20px' }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ── Action Card ──
function ActionCard({
  action,
  isCompleted,
  onToggle,
  sources,
  priorityConfig,
}: {
  action: ActionItem;
  isCompleted: boolean;
  onToggle: () => void;
  sources: Source[];
  priorityConfig: Record<string, { label: string; color: string }>;
}) {
  const [expanded, setExpanded] = useState(false);
  const linkedSources = sources.filter((s) => action.sourceIds?.includes(s.id));
  const pConfig = priorityConfig[action.priority] || priorityConfig.normal;

  return (
    <div
      style={{
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 16px',
        background: isCompleted ? 'var(--accent-50)' : 'var(--bg-secondary)',
        borderColor: isCompleted ? 'var(--accent-200)' : undefined,
        transition: 'all 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        {/* Checkbox */}
        <button
          onClick={onToggle}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            marginTop: 2,
            flexShrink: 0,
          }}
          aria-label={`${isCompleted ? 'Unmark' : 'Mark'} "${action.title}" as complete`}
        >
          {isCompleted ? (
            <CheckCircle2 size={20} style={{ color: 'var(--accent-600)' }} />
          ) : (
            <Circle size={20} style={{ color: 'var(--border-medium)' }} />
          )}
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: 'var(--text-tertiary)',
                background: 'var(--bg-tertiary)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {action.stepNumber}
            </span>
            <h4
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--text-primary)',
                textDecoration: isCompleted ? 'line-through' : 'none',
                opacity: isCompleted ? 0.7 : 1,
                flex: 1,
              }}
            >
              {action.title}
            </h4>
            <span style={{ fontSize: 11, fontWeight: 500, color: pConfig.color }}>
              {pConfig.label}
            </span>
          </div>

          {/* Description */}
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 6 }}>
            {action.description}
          </p>

          {/* Expandable Details */}
          {(action.whyItMatters || (action.requiredDocuments && action.requiredDocuments.length > 0) || linkedSources.length > 0) && (
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                color: 'var(--accent-600)',
                padding: '4px 0',
                marginTop: 6,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              {expanded ? 'Show less' : 'Show more details'}
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          )}

          {expanded && (
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-light)' }}>
              {action.whyItMatters && (
                <div style={{ marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Why it matters: </span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{action.whyItMatters}</span>
                </div>
              )}
              {action.requiredDocuments && action.requiredDocuments.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                    Required documents:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {action.requiredDocuments.map((doc, i) => (
                      <span key={i} className="badge badge-gray" style={{ fontSize: 11 }}>
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {linkedSources.length > 0 && (
                <div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                    Sources:
                  </span>
                  {linkedSources.map((s) => (
                    <a
                      key={s.id}
                      href={s.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 12,
                        color: 'var(--accent-600)',
                        textDecoration: 'none',
                      }}
                    >
                      <ExternalLink size={10} />
                      {s.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Source Card ──
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SourceCard({ source, t }: { source: Source; t: any }) {
  const statusConfig = {
    verified: { label: t.assistant.verified, className: 'badge-emerald' },
    unverified: { label: t.assistant.unverified, className: 'badge-gray' },
    pending: { label: t.assistant.pending, className: 'badge-amber' },
    failed: { label: 'Failed', className: 'badge-red' },
  };
  const sConfig = statusConfig[source.verificationStatus] || statusConfig.unverified;

  return (
    <div
      style={{
        padding: '12px 14px',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)',
        fontSize: 14,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <h5 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
            {source.title}
          </h5>
          {source.publisher && (
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 4 }}>{source.publisher}</p>
          )}
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{source.supports}</p>
        </div>
        <span className={`badge ${sConfig.className}`}>{sConfig.label}</span>
      </div>
      {source.url && (
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            marginTop: 8,
            fontSize: 12,
            color: 'var(--accent-600)',
            textDecoration: 'none',
          }}
        >
          <ExternalLink size={12} />
          {t.assistant.openSource}
        </a>
      )}
    </div>
  );
}
