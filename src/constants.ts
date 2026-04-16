import { Language, TriageLevel } from './types';

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
];

export const TRIAGE_COLORS: Record<TriageLevel, string> = {
  'Self-care': 'bg-green-100 text-green-800 border-green-200',
  'Clinic': 'bg-blue-100 text-blue-800 border-blue-200',
  'Hospital': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Emergency': 'bg-red-100 text-red-800 border-red-200',
};

export const TRIAGE_ICONS: Record<TriageLevel, string> = {
  'Self-care': 'Home',
  'Clinic': 'Stethoscope',
  'Hospital': 'Hospital',
  'Emergency': 'AlertTriangle',
};
