export interface Evidence {
  content: string;
  page_number: number;
  pdf_id: string;
  event_datetime?: string;
}

export interface LogicRule {
  text: string;
  selected: boolean;
}

export interface StepOption {
  text: string;
  next_step?: string;
  selected: boolean;
  key: string;
}

export interface Step {
  key: string;
  question: string;
  options: StepOption[];
  decision: string;
  reasoning?: string;
  evidence: Evidence[];
  logic?: LogicRule[];
  selected?: string;
  next_step?: string;
}

export type CaseStatus = "submitted" | "processing" | "complete";

export interface Case {
  case_id: string;
  procedure_name: string;
  cpt_codes: string[];
  summary?: string;
  status: CaseStatus;
  is_met: boolean;
  is_complete: boolean;
  steps: Step[];
  created_at: string;
  medical_record_id: string;
  guidelines_id: string;
}
