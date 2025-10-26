export interface AuditResult {
  category: string
  score: number
  total: number
  percentage: number
}

export interface AuditData {
  results: AuditResult[]
  overallScore: number
  date: string
}

export function saveAuditResults(data: AuditData): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auditResults', JSON.stringify(data))
  }
}

export function getAuditResults(): AuditData | null {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('auditResults')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Error parsing audit results:', e)
        return null
      }
    }
  }
  return null
}

export function clearAuditResults(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auditResults')
  }
}