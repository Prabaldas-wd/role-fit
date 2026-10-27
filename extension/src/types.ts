// Mirrors backend/analysis/serializers.py. Keep the two in sync.

export type Importance = "required" | "preferred";

export type EvidenceStatus =
  | "clearly_supported"
  | "possibly_supported"
  | "not_found"
  | "ambiguous";

export type RecommendationAction =
  | "keep"
  | "rewrite"
  | "de_emphasize"
  | "remove"
  | "add_detail";

export interface Requirement {
  name: string;
  importance: Importance;
  evidence_status: EvidenceStatus;
  resume_evidence: string[];
}

export interface Recommendation {
  id: string;
  section: string;
  action: RecommendationAction;
  original_bullet: string;
  suggested_bullet: string | null;
  reason: string;
  related_requirement: string | null;
  supporting_evidence: string[];
  requires_confirmation: boolean;
}

export interface GapToConfirm {
  requirement: string;
  reason: string;
}

export interface AnalyzeRequest {
  job_description: string;
  resume_text: string;
  target_role?: string;
}

export interface AnalyzeResponse {
  requirements: Requirement[];
  recommendations: Recommendation[];
  gaps_to_confirm: GapToConfirm[];
}

export interface ExtractedJob {
  title: string | null;
  company: string | null;
  description: string;
  url: string;
}

export type Decision = "pending" | "accepted" | "rejected";
