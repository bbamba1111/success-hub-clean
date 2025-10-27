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
    console.log("Saving audit results:", data)
    localStorage.setItem("workLifeBalanceAuditResults", JSON.stringify(data))
    console.log("Audit results saved successfully")
  } catch (error) {
    console.error("Error saving audit results:", error)
  }
}

export function getAuditResults(): AuditData | null {
  try {
    console.log("Retrieving audit results from localStorage...")
    const data = localStorage.getItem("workLifeBalanceAuditResults")
    console.log("Raw localStorage data:", data)

    if (!data) {
      console.log("No audit results found in localStorage")
      return null
    }

    const parsedData = JSON.parse(data) as AuditData
    console.log("Parsed audit data:", parsedData)
    return parsedData
  } catch (error) {
    console.error("Error retrieving audit results:", error)
    return null
  }
}

export function clearAuditResults(): void {
  try {
    localStorage.removeItem("workLifeBalanceAuditResults")
    console.log("Audit results cleared")
  } catch (error) {
    console.error("Error clearing audit results:", error)
  }
}
