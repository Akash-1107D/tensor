import React from 'react';
import { LANGUAGES } from '../constants';
import { Language } from '../types';
import { motion } from 'motion/react';
import { Globe } from 'lucide-react';

interface Props {
  selectedLanguage: string;
  onSelect: (code: string) => void;
  onNext: () => void;
}

export default function LanguageSelector({ selectedLanguage, onSelect, onNext }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 mb-2">
          <Globe size={24} />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">Select Your Language</h2>
        <p className="text-gray-500">Choose the language you are most comfortable with.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onSelect(lang.code)}
            className={`
              p-4 rounded-xl border-2 text-left transition-all
              ${selectedLanguage === lang.code
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50 text-gray-700'}
            `}
          >
            <div className="font-medium">{lang.nativeName}</div>
            <div className="text-xs opacity-60">{lang.name}</div>
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={!selectedLanguage}
        className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        Continue
      </button>
    </div>
  );
}
