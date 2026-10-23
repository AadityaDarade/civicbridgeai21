'use client';

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { translations, type Language, type TranslationStrings } from '@/lib/i18n';
import type { ActionPlan } from '@/lib/types';

// ── Language Context ──
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationStrings;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: translations.en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const t = translations[language];
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

// ── Action Plans Context ──
interface ActionPlansContextType {
  plans: ActionPlan[];
  addPlan: (plan: ActionPlan) => void;
  updatePlan: (id: string, updates: Partial<ActionPlan>) => void;
  deletePlan: (id: string) => void;
  toggleAction: (planId: string, actionId: string) => void;
  getPlan: (id: string) => ActionPlan | undefined;
}

const ActionPlansContext = createContext<ActionPlansContextType>({
  plans: [],
  addPlan: () => {},
  updatePlan: () => {},
  deletePlan: () => {},
  toggleAction: () => {},
  getPlan: () => undefined,
});

export function ActionPlansProvider({ children }: { children: ReactNode }) {
  const [plans, setPlans] = useState<ActionPlan[]>([]);

  const addPlan = useCallback((plan: ActionPlan) => {
    setPlans((prev) => [plan, ...prev]);
  }, []);

  const updatePlan = useCallback((id: string, updates: Partial<ActionPlan>) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
    );
  }, []);

  const deletePlan = useCallback((id: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const toggleAction = useCallback((planId: string, actionId: string) => {
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id !== planId) return p;
        const completed = p.completedActions.includes(actionId)
          ? p.completedActions.filter((a) => a !== actionId)
          : [...p.completedActions, actionId];
        return { ...p, completedActions: completed, updatedAt: new Date().toISOString() };
      })
    );
  }, []);

  const getPlan = useCallback((id: string) => plans.find((p) => p.id === id), [plans]);

  return (
    <ActionPlansContext.Provider value={{ plans, addPlan, updatePlan, deletePlan, toggleAction, getPlan }}>
      {children}
    </ActionPlansContext.Provider>
  );
}

export function useActionPlans() {
  return useContext(ActionPlansContext);
}
