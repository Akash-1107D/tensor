export type TriageLevel = 'Self-care' | 'Clinic' | 'Hospital' | 'Emergency';

export interface PatientInfo {
  age: string;
  gender: string;
  vitals: {
    temperature?: string;
    bloodPressure?: string;
    heartRate?: string;
  };
}

export interface TriageResult {
  level: TriageLevel;
  conditions: Array<{
    name: string;
    confidence: number;
    description: string;
  }>;
  firstAid: string[];
  recommendation: string;
  facilityType: string;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
