// ── Case types ─────────────────────────────────────────────────────────────
export type CaseType =
  | "profitability"
  | "market_sizing"
  | "growth_strategy";

export type Difficulty = "junior" | "senior" | "partner";

export interface CaseDoc {
  id: string;
  title: string;
  company: string;
  type: CaseType;
  difficulty: Difficulty;
  /** Problem statement shown to the user and injected into AI system prompt */
  prompt: string;
  /** Structured background injected into AI context to anchor facts/numbers */
  background: {
    overview: string;
    keyFacts: string[];
    financials?: Record<string, string>;
    industry?: string;
    correctAnswerRange?: string;
  };
}

// ── Sparring session ────────────────────────────────────────────────────────
export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

export type SessionStatus =
  | "selecting"
  | "active"
  | "awaiting_feedback"
  | "feedback_ready"
  | "ended";

export interface SparringSession {
  id: string;
  caseId: string;
  caseTitle: string;
  caseType: CaseType;
  messages: Message[];
  status: SessionStatus;
  feedback: SessionFeedback | null;
  startedAt: number;
  endedAt: number | null;
}

// ── Structured feedback ─────────────────────────────────────────────────────
export interface FeedbackDimension {
  score: 1 | 2 | 3 | 4 | 5;
  observation: string;
  suggestion: string;
}

export type McKinseyReadiness = "not_ready" | "borderline" | "ready" | "strong";

export interface SessionFeedback {
  overall: string;
  dimensions: {
    mece: FeedbackDimension;
    hypothesis_driven: FeedbackDimension;
    quantitative: FeedbackDimension;
    structure: FeedbackDimension;
    communication: FeedbackDimension;
  };
  strengths: string[];
  improvements: string[];
  mckinsey_readiness: McKinseyReadiness;
}

// ── Model answer ────────────────────────────────────────────────────────────
export interface ModelAnswerStep {
  step: number;
  title: string;
  content: string;
}

// ── localStorage / IndexedDB schema ────────────────────────────────────────
export interface StoredHistory {
  sessions: SparringSession[];
  version: number;
}

// ── API payloads ────────────────────────────────────────────────────────────
export interface ChatRequest {
  messages: { role: "user" | "assistant"; content: string }[];
  caseId: string;
  requestingHint: boolean;
}

export interface FeedbackRequest {
  transcript: { role: string; content: string }[];
  caseId: string;
}

export interface ModelAnswerRequest {
  caseId: string;
  userTranscript?: { role: string; content: string }[];
}
