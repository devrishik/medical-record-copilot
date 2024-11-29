"use client";

import { Case } from "@/types/case";

interface CaseHeaderProps {
  caseData: Case;
}

export function CaseHeader({ caseData }: CaseHeaderProps) {
  return (
    <div className="mb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-3 transition-all duration-300">{caseData.procedure_name}</h1>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Status:</span>
            <span className={`
              px-3 py-1 rounded-full text-sm font-medium capitalize
              transition-all duration-500 ease-in-out
              ${caseData.status === 'complete'
                ? 'bg-green-100 text-green-700'
                : caseData.status === 'processing'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700'
              }
            `}>
              {caseData.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">CPT Codes:</span>
            <div className="flex gap-2">
              {caseData.cpt_codes.map((code) => (
                <span
                  key={code}
                  className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700 transition-all duration-300"
                >
                  {code}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {caseData.summary && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 transition-all duration-500 ease-in-out">
          <h2 className="text-lg font-semibold mb-2 text-blue-900 transition-all duration-300">Summary</h2>
          <p className="text-gray-700 leading-relaxed transition-all duration-300">{caseData.summary}</p>
        </div>
      )}
    </div>
  );
}
