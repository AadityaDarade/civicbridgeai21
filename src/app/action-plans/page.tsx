'use client';

import React from 'react';
import Link from 'next/link';
import { ClipboardList, Bot, Trash2, Eye, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/lib/providers';
import { useActionPlans } from '@/lib/providers';

export default function ActionPlansPage() {
  const { t } = useLanguage();
  const { plans, deletePlan } = useActionPlans();

  const categoryLabels: Record<string, string> = {
    government_schemes: 'Government Schemes',
    education_support: 'Education',
    disaster_assistance: 'Disaster Assistance',
    medical_information: 'Medical',
    public_services: 'Public Services',
    legal_guidance: 'Legal',
    transport_disruption: 'Transport',
    financial_assistance: 'Financial',
    general_inquiry: 'General',
  };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <ClipboardList size={22} style={{ color: 'var(--accent-600)' }} />
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {t.actionPlans.title}
          </h1>
        </div>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          {t.actionPlans.subtitle}
        </p>
      </div>

      {/* Session Notice */}
      <div className="alert alert-warning" style={{ marginBottom: 24 }}>
        <AlertTriangle size={16} style={{ flexShrink: 0 }} />
        <p style={{ fontSize: 13 }}>{t.actionPlans.sessionNotice}</p>
      </div>

      {/* Plans List */}
      {plans.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }} className="fade-in">
          <div style={{
            width: 56, height: 56,
            background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <ClipboardList size={24} style={{ color: 'var(--text-tertiary)' }} />
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
            {t.actionPlans.noPlans}
          </h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20, maxWidth: 400, margin: '0 auto 20px' }}>
            {t.actionPlans.noPlansDesc}
          </p>
          <Link href="/assistant" className="btn btn-primary">
            <Bot size={16} />
            {t.nav.assistant}
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {plans.map((plan) => {
            const totalActions = plan.response.actions.length;
            const completedCount = plan.completedActions.length;
            const progress = totalActions > 0 ? Math.round((completedCount / totalActions) * 100) : 0;

            return (
              <div key={plan.id} className="card card-hover fade-in" style={{ padding: '18px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span className={`badge ${plan.response.isDemo ? 'badge-amber' : 'badge-teal'}`} style={{ fontSize: 11 }}>
                        {plan.response.isDemo ? 'Demo' : categoryLabels[plan.category] || plan.category}
                      </span>
                      <span className={`badge ${plan.response.urgency === 'urgent' ? 'badge-red' : plan.response.urgency === 'time_sensitive' ? 'badge-amber' : 'badge-gray'}`} style={{ fontSize: 11 }}>
                        {plan.response.urgency}
                      </span>
                    </div>
                    <h3 style={{
                      fontSize: 15, fontWeight: 600, color: 'var(--text-primary)',
                      marginBottom: 6,
                      overflow: 'hidden', textOverflow: 'ellipsis',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
                    }}>
                      {plan.title}
                    </h3>

                    {/* Progress */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div className="progress-bar" style={{ flex: 1, maxWidth: 200 }}>
                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                        {completedCount}/{totalActions} {t.actionPlans.completed}
                      </span>
                      {progress === 100 && <CheckCircle2 size={14} style={{ color: 'var(--emerald-500)' }} />}
                    </div>

                    <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                      {t.actionPlans.createdAt}: {new Date(plan.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    <Link href={`/assistant?plan=${plan.id}`} className="btn btn-secondary btn-sm btn-icon" title={t.actionPlans.viewPlan}>
                      <Eye size={14} />
                    </Link>
                    <button
                      className="btn btn-ghost btn-sm btn-icon"
                      onClick={() => {
                        if (confirm('Delete this action plan?')) {
                          deletePlan(plan.id);
                        }
                      }}
                      title={t.actionPlans.deletePlan}
                      style={{ color: 'var(--danger-500)' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
