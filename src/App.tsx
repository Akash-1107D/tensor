/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import LanguageSelector from './components/LanguageSelector';
import PatientInfoForm from './components/PatientInfoForm';
import SymptomChat from './components/SymptomChat';
import TriageResultView from './components/TriageResult';
import { PatientInfo, TriageResult, ChatMessage } from './types';
import { performTriage } from './services/geminiService';
import { HeartPulse, ShieldCheck } from 'lucide-react';

type Step = 'language' | 'info' | 'symptoms' | 'result';

export default function App() {
  const [step, setStep] = useState<Step>('language');
  const [language, setLanguage] = useState('en');
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    age: '',
    gender: '',
    vitals: {
      temperature: '',
      bloodPressure: '',
      heartRate: '',
    }
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTriage = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fullSymptoms = chatMessages
        .filter(m => m.role === 'user')
        .map(m => m.content)
        .join('. ');
      
      const result = await performTriage(fullSymptoms, patientInfo, language);
      setTriageResult(result);
      setStep('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setStep('language');
    setChatMessages([]);
    setTriageResult(null);
    setError(null);
  };

  const renderStep = () => {
    switch (step) {
      case 'language':
        return (
          <LanguageSelector
            selectedLanguage={language}
            onSelect={setLanguage}
            onNext={() => setStep('info')}
          />
        );
      case 'info':
        return (
          <PatientInfoForm
            info={patientInfo}
            onChange={setPatientInfo}
            onNext={() => setStep('symptoms')}
            onBack={() => setStep('language')}
          />
        );
      case 'symptoms':
        return (
          <SymptomChat
            messages={chatMessages}
            onAddMessage={(msg) => setChatMessages(prev => [...prev, msg])}
            onSubmit={handleTriage}
            onBack={() => setStep('info')}
            isLoading={isLoading}
            patientInfo={patientInfo}
            language={language}
          />
        );
      case 'result':
        return triageResult ? (
          <TriageResultView result={triageResult} onReset={reset} />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-bottom border-gray-100">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <HeartPulse size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight">RuralHealth AI</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
            <ShieldCheck size={12} />
            <span>Secure & Private</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        {step !== 'result' && (
          <div className="mb-8 flex gap-2">
            {(['language', 'info', 'symptoms'] as Step[]).map((s, idx) => {
              const steps = ['language', 'info', 'symptoms'];
              const currentIdx = steps.indexOf(step);
              return (
                <div 
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                    idx <= currentIdx ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              );
            })}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-xs">!</span>
            {error}
          </div>
        )}

        <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        <footer className="mt-12 text-center space-y-4">
          <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
            Disclaimer: This AI assistant provides triage guidance based on symptoms. 
            It is not a substitute for professional medical advice, diagnosis, or treatment. 
            In case of emergency, please contact local emergency services immediately.
          </p>
          <div className="flex justify-center gap-6 grayscale opacity-30">
             <div className="text-[10px] font-bold tracking-widest uppercase">Tensor '26</div>
             <div className="text-[10px] font-bold tracking-widest uppercase">CodeBrew Team</div>
          </div>
        </footer>
      </main>
    </div>
  );
}

