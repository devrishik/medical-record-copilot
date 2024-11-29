"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Case } from "@/types/case";
import { fetchCase } from "@/services/api";
import { StepsList } from "@/components/case/steps/list";
import { StatusBar } from "@/components/case/status-bar";
import { CaseHeader } from "@/components/case/case-header";
import { PulseLoader } from "react-spinners";

export default function CasePage() {
  const { case_id } = useParams();
  const [caseData, setCaseData] = useState<Case>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const loadCase = async () => {
      try {
        const data = await fetchCase(case_id as string);
        setCaseData(data);
        console.log('Updated data:', data);
        console.log('Updated caseData:', caseData);
		
        // Continue polling if case is not complete
        if (data.status !== "complete") {
          intervalId = setInterval(async () => {
            try {
              const updatedData = await fetchCase(case_id as string);
              setCaseData(updatedData);
              // Stop polling when complete
              if (updatedData.status === "complete") {
                clearInterval(intervalId);
              }
            } catch (err) {
              console.error('Polling error:', err);
              clearInterval(intervalId);
            }
          }, 5000);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load case");
      }
    };

    loadCase();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [case_id]);

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }
  console.log('Case data:', caseData);
  return (
    <div className="p-8">
      <StatusBar status={caseData.status} isMet={caseData.is_met} />
      <div className="flex-1 overflow-y-auto">
        <CaseHeader caseData={caseData} />
        <StepsList steps={caseData.steps} />
      </div>
      {caseData.status !== "complete" && (
        <div className="flex justify-center items-center p-4 border-t border-gray-200">
          <PulseLoader size={8} color="#3B82F6" margin={4} />
          <span className="ml-3 text-sm text-gray-600">Processing medical records...</span>
        </div>
      )}
    </div>
  );
}
