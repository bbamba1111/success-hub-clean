import type { Result } from "@/components/work-life-balance-audit"

// Define the type for personalized feedback
interface PersonalizedFeedback {
  category: string
  feedback: string
}

// Function to check if the user has completed the audit
export const hasCompletedAudit = (): boolean => {
  try {
    const savedResults = localStorage.getItem("workLifeBalanceAuditResults")
    return savedResults !== null
  } catch (error) {
    console.error("Error checking audit completion:", error)
    return false
  }
}

// Function to save audit results to localStorage
export const saveAuditResults = (
  name: string,
  email: string,
  overallScore: number,
  results: Result[],
  feedback: PersonalizedFeedback[],
) => {
  try {
    // Create a results object to store
    const auditResults = {
      name,
      email,
      overallScore,
      results,
      feedback,
      timestamp: new Date().toISOString(),
    }

    // Save to localStorage
    localStorage.setItem("workLifeBalanceAuditResults", JSON.stringify(auditResults))
    return true
  } catch (error) {
    console.error("Error saving audit results:", error)
    return false
  }
}

// Function to get saved audit results from localStorage
export const getSavedAuditResults = () => {
  try {
    const savedResults = localStorage.getItem("workLifeBalanceAuditResults")
    if (savedResults) {
      return JSON.parse(savedResults)
    }
    return null
  } catch (error) {
    console.error("Error retrieving audit results:", error)
    return null
  }
}

// Type for stored audit data
export interface StoredAuditData {
  name: string
  email: string
  overallScore: number
  results: any[]
  feedback: any[]
  timestamp: string
}

// Alias for backwards compatibility
export const getAuditResults = getSavedAuditResults

// Function to clear saved audit results from localStorage
export const clearSavedAuditResults = () => {
  try {
    localStorage.removeItem("workLifeBalanceAuditResults")
    return true
  } catch (error) {
    console.error("Error clearing audit results:", error)
    return false
  }
}
