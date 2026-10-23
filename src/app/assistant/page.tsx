'use client';

import React, { useState, useCallback, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Bot, Beaker, AlertCircle, GraduationCap, CloudRain, Stethoscope, Key, Check, X } from 'lucide-react';
import InputComposer from '@/components/InputComposer';
import ResultsWorkspace from '@/components/ResultsWorkspace';
import { useLanguage } from '@/lib/providers';
import { useActionPlans } from '@/lib/providers';
import { demoScenarios } from '@/lib/demo-data';
import type { AssistantResponse, UploadedFile } from '@/lib/types';
import { ALLOWED_IMAGE_TYPES } from '@/lib/types';

type ViewState = 'input' | 'loading' | 'result' | 'error';

const demoIcons = {
  'scheme-navigator': GraduationCap,
  'disaster-assistance': CloudRain,
  'medical-organizer': Stethoscope,
};

function AssistantContent() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const { addPlan, toggleAction } = useActionPlans();

  const [viewState, setViewState] = useState<ViewState>('input');
  const [response, setResponse] = useState<AssistantResponse | null>(null);
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDemo, setIsDemo] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [customKeyInput, setCustomKeyInput] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('civicbridge_gemini_key') || '' : ''));
  const [hasCustomKey, setHasCustomKey] = useState(() => (typeof window !== 'undefined' ? !!localStorage.getItem('civicbridge_gemini_key') : false));

  const saveCustomKey = () => {
    if (typeof window !== 'undefined') {
      if (customKeyInput.trim()) {
        localStorage.setItem('civicbridge_gemini_key', customKeyInput.trim());
        setHasCustomKey(true);
      } else {
        localStorage.removeItem('civicbridge_gemini_key');
        setHasCustomKey(false);
      }
      setShowKeyModal(false);
    }
  };

  // Derive initial input from URL params
  const urlInput = searchParams.get('input') || '';
  const [initialInput, setInitialInput] = useState(urlInput);
  const autoSubmittedRef = useRef(false);

  const handleSubmit = useCallback(async (text: string, files: UploadedFile[] = []) => {
    setViewState('loading');
    setErrorMessage('');
    setIsDemo(false);
    // Explicitly reset existing response and actions so prior results never leak
    setResponse(null);
    setCompletedActions([]);

    try {
      // Prepare request body
      const body: Record<string, unknown> = {
        text,
        language: language || 'en',
      };

      // Handle image or PDF document upload - convert to base64 for Gemini multimodal
      const visualOrPdfFile = files.find(f => ALLOWED_IMAGE_TYPES.includes(f.type) || f.type === 'application/pdf');
      if (visualOrPdfFile) {
        const base64 = await fileToBase64(visualOrPdfFile.file);
        body.imageBase64 = base64;
        body.imageMimeType = visualOrPdfFile.type;
        body.documentName = visualOrPdfFile.name;
      }

      // Handle document upload - extract text
      const docFile = files.find(f => f.type === 'text/plain' || f.type === 'text/csv');
      if (docFile) {
        const docText = await docFile.file.text();
        body.documentText = docText;
        body.documentName = docFile.name;
      }

      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const storedKey = typeof window !== 'undefined' ? localStorage.getItem('civicbridge_gemini_key') : null;
      if (storedKey) {
        headers['x-gemini-key'] = storedKey;
      }

      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'API_KEY_MISSING') {
          setErrorMessage(data.message);
          setViewState('error');
          return;
        }
        throw new Error(data.error || 'Request failed');
      }

      setResponse(data);
      setCompletedActions([]);
      setViewState('result');

      // Save as action plan
      const planId = `plan-${Date.now()}`;
      setCurrentPlanId(planId);
      addPlan({
        id: planId,
        title: data.summary?.substring(0, 80) || 'Action Plan',
        category: data.category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        response: data,
        completedActions: [],
      });
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred.');
      setViewState('error');
    }
  }, [addPlan, language]);

  const handleDemoScenario = useCallback(async (scenarioId: string) => {
    setViewState('loading');
    setErrorMessage('');
    setIsDemo(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'demo', scenarioId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');

      setResponse(data);
      setCompletedActions([]);
      setViewState('result');

      const planId = `plan-demo-${Date.now()}`;
      setCurrentPlanId(planId);
      addPlan({
        id: planId,
        title: data.summary?.substring(0, 80) || 'Demo Plan',
        category: data.category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        response: data,
        completedActions: [],
      });
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred.');
      setViewState('error');
    }
  }, [addPlan]);

  const handleToggleAction = useCallback((actionId: string) => {
    setCompletedActions(prev =>
      prev.includes(actionId) ? prev.filter(a => a !== actionId) : [...prev, actionId]
    );
    if (currentPlanId) {
      toggleAction(currentPlanId, actionId);
    }
  }, [currentPlanId, toggleAction]);

  const handleStartNew = useCallback(() => {
    setViewState('input');
    setResponse(null);
    setCompletedActions([]);
    setIsDemo(false);
    setErrorMessage('');
    setInitialInput('');
    setCurrentPlanId(null);
  }, []);

  const handleRetry = useCallback(() => {
    const textToRetry = initialInput || urlInput;
    if (textToRetry) {
      handleSubmit(textToRetry, []);
    } else {
      handleStartNew();
    }
  }, [initialInput, urlInput, handleSubmit, handleStartNew]);

  // Automatically process request if navigated with input query parameter
  useEffect(() => {
    if (urlInput && !autoSubmittedRef.current) {
      autoSubmittedRef.current = true;
      handleSubmit(urlInput, []);
    }
  }, [urlInput, handleSubmit]);

  const getStatusInfo = () => {
    if (isDemo) {
      return {
        dotColor: '#F59E0B',
        label: 'Demo Mode',
        detail: 'Sample Data',
        badgeClass: 'badge-amber',
      };
    }
    if (viewState === 'loading') {
      return {
        dotColor: '#3B82F6',
        label: 'Gemini Live',
        detail: 'Processing...',
        badgeClass: 'badge-teal',
      };
    }
    if (viewState === 'result') {
      return {
        dotColor: '#10B981',
        label: 'Gemini Live AI',
        detail: 'Active Response',
        badgeClass: 'badge-emerald',
      };
    }
    if (viewState === 'error') {
      return {
        dotColor: '#EF4444',
        label: 'API Unavailable',
        detail: 'Error',
        badgeClass: 'badge-red',
      };
    }
    return {
      dotColor: '#14B8A6',
      label: 'Gemini Ready',
      detail: 'Live Engine',
      badgeClass: 'badge-teal',
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40,
            background: 'linear-gradient(135deg, var(--accent-600), var(--emerald-600))',
            borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
          }}>
            <Bot size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {t.assistant.title}
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
              Describe your situation for personalized guidance
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div
            className={`badge ${statusInfo.badgeClass}`}
            style={{
              padding: '6px 12px',
              fontSize: 12,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: statusInfo.dotColor,
                boxShadow: `0 0 0 2px ${statusInfo.dotColor}40`,
              }}
            />
            <span style={{ fontWeight: 600 }}>{statusInfo.label}</span>
            <span style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>{statusInfo.detail}</span>
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setShowKeyModal(true)}
            title="Configure Gemini API Key"
            style={{ fontSize: 12, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 5 }}
          >
            <Key size={13} style={{ color: hasCustomKey ? 'var(--accent-600)' : 'var(--text-tertiary)' }} />
            <span>{hasCustomKey ? 'Custom Key Active' : 'API Key Settings'}</span>
          </button>

          {viewState === 'result' && (
            <button className="btn btn-secondary btn-sm" onClick={handleStartNew}>
              {t.assistant.newAssessment}
            </button>
          )}
        </div>
      </div>

      {/* API Key Modal */}
      {showKeyModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20,
          }}
          onClick={() => setShowKeyModal(false)}
        >
          <div
            className="card"
            style={{ maxWidth: 480, width: '100%', padding: 24, boxShadow: 'var(--shadow-xl)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Key size={18} style={{ color: 'var(--accent-600)' }} />
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Gemini AI API Key Configuration</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
              CivicBridge AI is configured with a live server-side Gemini key. If you want to use your personal key for higher quotas or custom models, you can enter it below (stored securely in your local browser storage).
            </p>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                Google Gemini API Key
              </label>
              <input
                type="password"
                value={customKeyInput}
                onChange={(e) => setCustomKeyInput(e.target.value)}
                placeholder="AQ.Ab8RN6... or AIzaSy..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                  background: 'var(--bg-primary)',
                  fontSize: 13,
                  fontFamily: 'monospace',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {hasCustomKey ? (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--danger-600)', fontSize: 12 }}
                  onClick={() => {
                    setCustomKeyInput('');
                    if (typeof window !== 'undefined') localStorage.removeItem('civicbridge_gemini_key');
                    setHasCustomKey(false);
                    setShowKeyModal(false);
                  }}
                >
                  Reset to Server Key
                </button>
              ) : <div />}

              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowKeyModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary btn-sm" onClick={saveCustomKey} style={{ gap: 5 }}>
                  <Check size={14} />
                  <span>Save Key</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input State */}
      {viewState === 'input' && (
        <div className="fade-in">
          <InputComposer
            onSubmit={handleSubmit}
            initialText={initialInput}
            showPrivacyNote
          />

          {/* Demo Mode Section */}
          <div style={{ marginTop: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Beaker size={16} style={{ color: 'var(--accent-600)' }} />
              <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                {t.assistant.demoMode}
              </h3>
              <span className="badge badge-amber" style={{ fontSize: 11 }}>Sample Data</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
              Try these pre-built examples to see how CivicBridge AI works — no API key required.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
              {demoScenarios.map((scenario) => {
                const Icon = demoIcons[scenario.id as keyof typeof demoIcons] || Beaker;
                return (
                  <button
                    key={scenario.id}
                    className="card card-interactive"
                    style={{
                      textAlign: 'left',
                      padding: '16px 18px',
                      width: '100%',
                      border: '1px solid var(--border-light)',
                      background: 'var(--bg-secondary)',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                    onClick={() => handleDemoScenario(scenario.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <Icon size={18} style={{ color: 'var(--accent-600)' }} />
                      <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                        {scenario.title}
                      </h4>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {scenario.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {viewState === 'loading' && (
        <div className="fade-in" style={{ textAlign: 'center', padding: '60px 0' }}>
          <div className="spinner" style={{ width: 32, height: 32, margin: '0 auto 16px', borderWidth: 3 }} />
          <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>{t.assistant.processing}</p>
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 6 }}>
            This may take a few seconds...
          </p>
        </div>
      )}

      {/* Error State */}
      {viewState === 'error' && (
        <div className="fade-in">
          <div className="alert alert-danger" style={{ marginBottom: 20 }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <div>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>{t.common.error}</p>
              <p style={{ fontSize: 13 }}>{errorMessage}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" onClick={handleRetry}>
              {t.common.retry}
            </button>
            <button className="btn btn-secondary" onClick={() => handleDemoScenario('scheme-navigator')}>
              {t.assistant.tryDemo}
            </button>
          </div>
        </div>
      )}

      {/* Result State */}
      {viewState === 'result' && response && (
        <ResultsWorkspace
          response={response}
          completedActions={completedActions}
          onToggleAction={handleToggleAction}
          onStartNew={handleStartNew}
          isDemo={isDemo}
        />
      )}
    </div>
  );
}

export default function AssistantPage() {
  return (
    <Suspense fallback={
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <div className="spinner" style={{ width: 32, height: 32, margin: '0 auto 16px', borderWidth: 3 }} />
        <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
    }>
      <AssistantContent />
    </Suspense>
  );
}

// Helper: File to Base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix to get just the base64 data
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
