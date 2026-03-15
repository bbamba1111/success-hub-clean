interface AuditResult {
  category: string
  percentage: number
  label: string
}

interface AuditData {
  overallScore: number
  results: AuditResult[]
  timestamp: number
}

export function saveAuditResults(data: AuditData): void {
  try {
    localStorage.setItem("workLifeBalanceAuditResults", JSON.stringify(data))
  } catch (error) {
    console.error("Error saving audit results:", error)
  }
}

export function getAuditResults(): AuditData | null {
  try {
    const data = localStorage.getItem("workLifeBalanceAuditResults")
    if (!data) {
      return null
    }
    return JSON.parse(data) as AuditData
  } catch (error) {
    console.error("Error retrieving audit results:", error)
    return null
  }
}

export function clearAuditResults(): void {
  try {
    localStorage.removeItem("workLifeBalanceAuditResults")
  } catch (error) {
    console.error("Error clearing audit results:", error)
  }
}
