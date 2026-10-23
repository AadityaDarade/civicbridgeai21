import { z } from 'zod';

// ── Urgency Levels ──
export const UrgencyLevel = z.enum(['routine', 'time_sensitive', 'urgent']);
export type UrgencyLevel = z.infer<typeof UrgencyLevel>;

// ── Verification Status ──
export const VerificationStatus = z.enum(['verified', 'unverified', 'pending', 'failed']);
export type VerificationStatus = z.infer<typeof VerificationStatus>;

// ── Action Priority ──
export const ActionPriority = z.enum(['low', 'normal', 'high', 'critical']);
export type ActionPriority = z.infer<typeof ActionPriority>;

// ── Action Status ──
export const ActionStatus = z.enum(['pending', 'in_progress', 'completed', 'skipped']);
export type ActionStatus = z.infer<typeof ActionStatus>;

// ── Confidence Level ──
export const ConfidenceLevel = z.number().min(0).max(1);

// ── Source Schema ──
export const SourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  publisher: z.string().optional(),
  url: z.string().url().optional(),
  supports: z.string(),
  verificationStatus: VerificationStatus,
  checkedAt: z.string().nullable().optional(),
  publishedAt: z.string().nullable().optional(),
});
export type Source = z.infer<typeof SourceSchema>;

// ── Extracted Fact ──
export const ExtractedFactSchema = z.object({
  fact: z.string(),
  source: z.enum(['user_input', 'document', 'image', 'ai_inference']),
  confidence: ConfidenceLevel,
});
export type ExtractedFact = z.infer<typeof ExtractedFactSchema>;

// ── Action Item ──
export const ActionItemSchema = z.object({
  id: z.string(),
  stepNumber: z.number().int().positive(),
  title: z.string(),
  description: z.string(),
  whyItMatters: z.string().optional(),
  requiredDocuments: z.array(z.string()).optional(),
  priority: ActionPriority,
  status: ActionStatus,
  deadline: z.string().nullable().optional(),
  sourceIds: z.array(z.string()).optional(),
});
export type ActionItem = z.infer<typeof ActionItemSchema>;

// ── Category ──
export const CategoryEnum = z.enum([
  'government_schemes',
  'education_support',
  'disaster_assistance',
  'medical_information',
  'public_services',
  'legal_guidance',
  'transport_disruption',
  'financial_assistance',
  'general_inquiry',
]);
export type Category = z.infer<typeof CategoryEnum>;

// ── Assistant Response Schema ──
export const AssistantResponseSchema = z.object({
  requestId: z.string(),
  language: z.string().default('en'),
  category: CategoryEnum,
  summary: z.string(),
  urgency: UrgencyLevel.default('routine'),
  urgencyExplanation: z.string(),
  extractedFacts: z.array(ExtractedFactSchema),
  uncertainties: z.array(z.string()),
  followUpQuestions: z.array(z.string()),
  actions: z.array(ActionItemSchema),
  sources: z.array(SourceSchema),
  disclaimer: z.string(),
  isDemo: z.boolean().default(false),
});
export type AssistantResponse = z.infer<typeof AssistantResponseSchema>;

// ── API Request ──
export const AssistantRequestSchema = z.object({
  text: z.string().max(5000).optional(),
  language: z.string().default('en'),
  imageBase64: z.string().optional(),
  imageMimeType: z.string().optional(),
  documentText: z.string().max(50000).optional(),
  documentName: z.string().optional(),
  scenarioId: z.string().optional(),
});
export type AssistantRequest = z.infer<typeof AssistantRequestSchema>;

// ── Action Plan (for persistence) ──
export interface ActionPlan {
  id: string;
  title: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
  response: AssistantResponse;
  completedActions: string[];
}

// ── Service Entry ──
export interface ServiceEntry {
  id: string;
  name: string;
  description: string;
  category: string;
  region: string;
  eligibility?: string;
  requiredDocuments?: string[];
  officialUrl: string;
  lastChecked?: string;
  verificationStatus: VerificationStatus;
  isDemo: boolean;
}

// ── File Upload ──
export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
  error?: string;
}

// ── Allowed file types ──
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const ALLOWED_DOC_TYPES = ['application/pdf', 'text/plain', 'text/csv'];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_TEXT_LENGTH = 5000;
