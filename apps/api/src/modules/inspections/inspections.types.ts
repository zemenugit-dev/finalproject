export type QualityGrade = 'A' | 'B' | 'C' | 'rejected';

export type InspectionStatus =
  | 'passed'
  | 'failed'
  | 'needs_review';

export interface Inspection {
  inspection_id: string;
  product_id: string;
  market_id: string;
  inspector_name: string;
  sample_quantity: string;
  quality_grade: QualityGrade;
  status: InspectionStatus;
  notes: string | null;
  inspected_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface InspectionFilters {
  product_id?: number;
  market_id?: number;
  quality_grade?: QualityGrade;
  status?: InspectionStatus;
  limit: number;
  offset: number;
}

export interface CreateInspectionInput {
  product_id: number;
  market_id: number;
  inspector_name: string;
  sample_quantity: number;
  quality_grade: QualityGrade;
  status: InspectionStatus;
  notes?: string | null;
  inspected_at?: string;
}

export type UpdateInspectionInput =
  Partial<CreateInspectionInput>;
