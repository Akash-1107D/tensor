import React from 'react';
import { PatientInfo } from '../types';
import { User, Thermometer, Activity, Heart } from 'lucide-react';

interface Props {
  info: PatientInfo;
  onChange: (info: PatientInfo) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PatientInfoForm({ info, onChange, onNext, onBack }: Props) {
  const handleChange = (field: string, value: string) => {
    if (field === 'age' || field === 'gender') {
      onChange({ ...info, [field]: value });
    } else {
      onChange({
        ...info,
        vitals: { ...info.vitals, [field]: value }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 mb-2">
          <User size={24} />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">Basic Information</h2>
        <p className="text-gray-500">Please provide some basic details to help us triage better.</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              value={info.age}
              onChange={(e) => handleChange('age', e.target.value)}
              placeholder="Years"
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Gender</label>
            <select
              value={info.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity size={16} className="text-blue-600" />
            Vitals (Optional)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <Thermometer size={12} /> Temp (°F)
              </label>
              <input
                type="text"
                value={info.vitals.temperature}
                onChange={(e) => handleChange('temperature', e.target.value)}
                placeholder="98.6"
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <Heart size={12} /> Heart Rate
              </label>
              <input
                type="text"
                value={info.vitals.heartRate}
                onChange={(e) => handleChange('heartRate', e.target.value)}
                placeholder="72 bpm"
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <Activity size={12} /> Blood Pressure
              </label>
              <input
                type="text"
                value={info.vitals.bloodPressure}
                onChange={(e) => handleChange('bloodPressure', e.target.value)}
                placeholder="120/80"
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="flex-1 py-4 border-2 border-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!info.age || !info.gender}
          className="flex-[2] py-4 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
