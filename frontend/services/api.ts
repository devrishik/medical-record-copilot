import { Case } from '@/types/case';
import { API_BASE_URL } from '@/lib/utils';

export async function fetchCase(caseId: string): Promise<Case> {
  const response = await fetch(`${API_BASE_URL}/cases/${caseId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch case');
  }
  return response.json();
}
