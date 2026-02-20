import type { Result, Category } from "@/components/work-life-balance-audit"

export function generateCherryBlossomPrompt(
  name: string,
  overallScore: number,
  results: Result[],
  categoryLabels: Record<Category, string>,
  lowestCategories: { category: Category; percentage: number }[],
): string {
  // Sort results from lowest to highest score
  const sortedResults = [...results].sort((a, b) => a.percentage - b.percentage)
  
  // Get the current date for more personalized context
  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  // Create the prompt text with more personalization
  let prompt = `Hello Cherry Blossom! I just completed the Work-Life Balance Audit on ${formattedDate}. Here are my results:\n\n`
  prompt += `Name: ${name}\n`
  prompt += `Overall Score: ${overallScore}%\n\n`

  // Add more context based on the overall score
  if (overallScore >= 80) {
    prompt += `I'm doing well with my work-lifestyle balance overall! I'd like to maintain and further improve my balance.\n\n`
  } else if (overallScore >= 60) {
    prompt += `I have a decent work-lifestyle balance, but there's definitely room for improvement in some areas.\n\n`
  } else {
    prompt += `My work-lifestyle balance needs significant improvement. I'm looking for practical strategies to help me create better balance.\n\n`
  }

  prompt += `Here are all my category scores (from lowest to highest):\n`
  sortedResults.forEach((result) => {
    prompt += `- ${categoryLabels[result.category]}: ${Math.round(result.percentage)}%\n`
  })

  prompt += `\nMy 3-5 lowest scoring areas are:\n`
  lowestCategories.forEach((item) => {
    prompt += `- ${categoryLabels[item.category]}: ${Math.round(item.percentage)}%\n`
  })

  // Add more specific context about their situation
  prompt += `\nSome specific challenges I'm facing in these areas include:\n`
  lowestCategories.forEach((item) => {
    switch (item.category) {
      case "spiritual":
        prompt += `- Finding time to connect with my spiritual practice amid business demands\n`
        break
      case "mental":
        prompt += `- Maintaining mental clarity when juggling multiple business priorities\n`
        break
      case "physicalMovement":
        prompt += `- Incorporating regular movement into my busy entrepreneurial schedule\n`
        break
      case "physicalNourishment":
        prompt += `- Nourishing my body properly despite unpredictable business hours\n`
        break
      case "physicalSleep":
        prompt += `- Getting consistent quality sleep while managing business responsibilities\n`
        break
      case "emotional":
        prompt += `- Managing emotional stress that comes with business ownership\n`
        break
      case "personal":
        prompt += `- Making time for personal growth alongside business growth\n`
        break
      case "intellectual":
        prompt += `- Balancing intellectual stimulation with practical business needs\n`
        break
      case "professional":
        prompt += `- Increasing my professional visibility while maintaining work-life balance\n`
        break
      case "financial":
        prompt += `- Creating consistent financial focus without becoming consumed by it\n`
        break
      case "environmental":
        prompt += `- Creating a supportive environment that enhances productivity and wellbeing\n`
        break
      case "relational":
        prompt += `- Being fully present in relationships while managing business demands\n`
        break
      case "social":
        prompt += `- Finding supportive communities that understand entrepreneurial challenges\n`
        break
      case "recreational":
        prompt += `- Making time for joy and play without feeling guilty about work\n`
        break
      case "charitable":
        prompt += `- Contributing to others in meaningful ways that align with my business\n`
        break
      default:
        prompt += `- Finding balance in this area while running my business\n`
    }
  })

  prompt += `\nI'd like your guidance on improving these areas. What specific strategies would you recommend for my situation? Please provide practical, actionable advice that I can implement right away, as well as longer-term strategies for sustainable improvement.`

  return prompt
}
