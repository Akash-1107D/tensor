import React from 'react';
import { TriageResult } from '../types';
import { TRIAGE_COLORS, TRIAGE_ICONS } from '../constants';
import { 
  Home, 
  Stethoscope, 
  Hospital as HospitalIcon, 
  AlertTriangle, 
  ChevronRight, 
  MapPin, 
  Info,
  RefreshCcw
} from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  result: TriageResult;
  onReset: () => void;
}

const Icons = {
  Home,
  Stethoscope,
  Hospital: HospitalIcon,
  AlertTriangle
};

export default function TriageResultView({ result, onReset }: Props) {
  const Icon = Icons[TRIAGE_ICONS[result.level] as keyof typeof Icons];
  const colorClass = TRIAGE_COLORS[result.level];

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`p-6 rounded-3xl border-2 text-center space-y-4 ${colorClass}`}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/50 mb-2">
          <Icon size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-bold">{result.level}</h2>
          <p className="font-medium opacity-80 mt-1">{result.recommendation}</p>
        </div>
      </motion.div>

      <div className="space-y-6">
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Info size={16} className="text-blue-600" />
            Probable Conditions
          </h3>
          <div className="space-y-3">
            {result.conditions.map((condition, idx) => (
              <div key={idx} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-gray-900">{condition.name}</h4>
                  <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded-lg text-gray-600">
                    {Math.round(condition.confidence * 100)}% Match
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{condition.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Activity size={16} className="text-blue-600" />
            First-Aid Guidance
          </h3>
          <ul className="space-y-2">
            {result.firstAid.map((step, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </span>
                {step}
              </li>
            ))}
          </ul>
        </section>

        <section className="p-4 bg-blue-50 rounded-2xl border border-blue-100 space-y-3">
          <div className="flex items-center gap-2 text-blue-800 font-semibold">
            <MapPin size={18} />
            Nearest Facility Recommendation
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h4 className="font-bold text-gray-900">{result.facilityType}</h4>
            <p className="text-sm text-gray-600 mt-1">
              Based on your triage level, we recommend visiting the nearest {result.facilityType.toLowerCase()}.
            </p>
            <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2">
              Find on Maps <ChevronRight size={16} />
            </button>
          </div>
        </section>
      </div>

      <button
        onClick={onReset}
        className="w-full py-4 border-2 border-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
      >
        <RefreshCcw size={18} />
        Start New Triage
      </button>
    </div>
  );
}

function Activity({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
