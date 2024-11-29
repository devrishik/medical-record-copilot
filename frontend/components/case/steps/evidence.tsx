"use client";

import { Evidence } from "@/types/case";
import { Collapsible } from "@/components/common/collapsible";
import { useState } from "react";

type SortField = "page" | "date";
type SortDirection = "asc" | "desc";

interface EvidenceListProps {
  evidence: Evidence[];
}

function SortButton({ active, direction, onClick }: { 
  active: boolean; 
  direction: SortDirection | null;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="ml-2 focus:outline-none"
    >
      <svg 
        className={`w-4 h-4 ${active ? 'text-blue-500' : 'text-gray-400'}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        {direction === 'asc' ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        ) : direction === 'desc' ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        ) : (
          <>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" opacity={0.5} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" opacity={0.5} />
          </>
        )}
      </svg>
    </button>
  );
}

export function EvidenceList({ evidence }: EvidenceListProps) {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  if (evidence.length === 0) return null;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedEvidence = [...evidence].sort((a, b) => {
    if (!sortField) return 0;

    const multiplier = sortDirection === "asc" ? 1 : -1;

    if (sortField === "page") {
      return (a.page_number - b.page_number) * multiplier;
    }

    if (sortField === "date") {
      const dateA = a.event_datetime ? new Date(a.event_datetime).getTime() : 0;
      const dateB = b.event_datetime ? new Date(b.event_datetime).getTime() : 0;
      return (dateA - dateB) * multiplier;
    }

    return 0;
  });

  return (
    <div>
      <Collapsible
        title={
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0012 18.75c-1.03 0-1.96-.434-2.62-1.226l-.549-.547z" 
              />
            </svg>
            <span className="text-base font-medium">
              This decision was made based on citations from the medical record
            </span>
          </div>
        }
        defaultOpen={false}
        buttonText="evidence"
      >
        <div className="space-y-4">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-500">
                  <div className="flex items-center">
                    Page
                    <SortButton 
                      active={sortField === "page"}
                      direction={sortField === "page" ? sortDirection : null}
                      onClick={() => handleSort("page")}
                    />
                  </div>
                </th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-500">Content</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-500">
                  <div className="flex items-center">
                    Date
                    <SortButton 
                      active={sortField === "date"}
                      direction={sortField === "date" ? sortDirection : null}
                      onClick={() => handleSort("date")}
                    />
                  </div>
                </th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedEvidence.map((item, index) => (
                <EvidenceItem key={index} evidence={item} />
              ))}
            </tbody>
          </table>
        </div>
      </Collapsible>
    </div>
  );
}

interface EvidenceItemProps {
  evidence: Evidence;
}

function EvidenceItem({ evidence }: EvidenceItemProps) {
  return (
    <tr className="group hover:bg-gray-50">
      <td className="px-3 py-2 align-top">
        <div className="min-w-[60px] bg-gray-200 text-gray-600 px-2 py-1 rounded text-sm text-center">
          Page {evidence.page_number}
        </div>
      </td>
      <td className="px-3 py-2">
        <p className="text-gray-700">{evidence.content}</p>
      </td>
      <td className="px-3 py-2 text-sm text-gray-500">
        {evidence.event_datetime && (
          new Date(evidence.event_datetime).toLocaleDateString()
        )}
      </td>
      <td className="px-3 py-2">
        <button 
          onClick={() => navigator.clipboard.writeText(evidence.content)}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity"
          title="Copy to clipboard"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" 
            />
          </svg>
        </button>
      </td>
    </tr>
  );
}
