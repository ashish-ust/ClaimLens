// Types mirror the ClaimLens API contract. Field names and enum values must match exactly.

export type AnalysisStatus = 'PENDING_DECISION' | 'APPROVED' | 'REJECTED';
export type DecisionValue = 'APPROVED' | 'REJECTED';

export type DuplicateVerdict = 'UNIQUE' | 'POSSIBLE_DUPLICATE' | 'DUPLICATE' | 'UNAVAILABLE';
export type AiVerdict = 'LIKELY_AUTHENTIC' | 'POSSIBLY_EDITED' | 'LIKELY_AI_GENERATED' | 'UNAVAILABLE';
export type ConsistencyVerdict = 'CONSISTENT' | 'PARTIALLY_CONSISTENT' | 'INCONSISTENT' | 'UNAVAILABLE';

export type MatchType = 'EXACT' | 'NEAR' | 'POSSIBLE';
export type MatchSource = 'EXISTING_CLAIM' | 'OTHER_UPLOADED_IMAGE';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type Recommendation = 'PROCEED' | 'REVIEW' | 'ESCALATE';

export interface AnalysisImage {
  index: number;
  filename: string;
  /** Relative API path, e.g. /api/analyses/{id}/images/0 */
  url: string;
}

export interface DuplicateMatch {
  image_index: number;
  match_type: MatchType;
  hamming_distance: number | null;
  matched_claim_id: string | null;
  matched_source: MatchSource;
  matched_image_url: string | null;
}

export interface DuplicateDetector {
  verdict: DuplicateVerdict;
  confidence: number;
  summary: string;
  matches: DuplicateMatch[];
}

export interface AiImageResult {
  image_index: number;
  verdict: AiVerdict;
  confidence: number;
  indicators: string[];
  exif_findings: string[];
  explanation: string;
}

export interface AiGeneratedDetector {
  verdict: AiVerdict;
  confidence: number;
  summary: string;
  per_image: AiImageResult[];
}

export interface ConsistencyDetector {
  verdict: ConsistencyVerdict;
  confidence: number;
  summary: string;
  matched_details: string[];
  contradictions: string[];
  missing_or_unverifiable: string[];
}

export interface Detectors {
  duplicate: DuplicateDetector;
  ai_generated: AiGeneratedDetector;
  consistency: ConsistencyDetector;
}

export interface Overall {
  risk_level: RiskLevel;
  /** 0-100 */
  risk_score: number;
  recommendation: Recommendation;
  brief: string;
  follow_up_questions: string[];
}

export interface AnalysisResult {
  analysis_id: string;
  created_at: string;
  status: AnalysisStatus;
  narrative: string;
  images: AnalysisImage[];
  detectors: Detectors;
  overall: Overall;
}

export interface DecisionRequest {
  decision: DecisionValue;
  reviewer_note: string | null;
}

export interface DecisionResponse {
  analysis_id: string;
  decision: DecisionValue;
  claim_id: string | null;
  message: string;
}

export interface ClaimImage {
  index: number;
  url: string;
}

export interface ApprovedClaim {
  claim_id: string;
  created_at: string;
  narrative: string;
  risk_level: RiskLevel;
  images: ClaimImage[];
}
