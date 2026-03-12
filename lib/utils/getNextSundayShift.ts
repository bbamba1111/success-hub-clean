/**
 * Get the next valid Sunday Shift date
 * Rules:
 * - Only 1st, 2nd, or 3rd Sunday of each month
 * - If 4th or 5th Sunday, roll to 1st Sunday of next month
 * - If current Sunday at 1:00 PM ET has passed, move to next valid Sunday
 * - Uses America/New_York timezone
 */

export function getNextSundayShift(): Date {
  const now = new Date()
  const nyTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }))
  
  // Find next Sunday
  let nextSunday = new Date(nyTime)
  const dayOfWeek = nextSunday.getDay()
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek
  nextSunday.setDate(nextSunday.getDate() + daysUntilSunday)
  nextSunday.setHours(13, 0, 0, 0) // 1:00 PM
  
  // If it's Sunday but after 1 PM, move to next Sunday
  if (dayOfWeek === 0 && nyTime.getHours() >= 13) {
    nextSunday.setDate(nextSunday.getDate() + 7)
  }
  
  // Check which Sunday of the month this is
  function getSundayOfMonth(date: Date): number {
    const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
    const firstSunday = new Date(firstOfMonth)
    const dayOfWeekFirst = firstOfMonth.getDay()
    const daysUntilFirstSunday = dayOfWeekFirst === 0 ? 0 : 7 - dayOfWeekFirst
    firstSunday.setDate(firstOfMonth.getDate() + daysUntilFirstSunday)
    
    const weeksDiff = Math.floor((date.getDate() - firstSunday.getDate()) / 7)
    return weeksDiff + 1
  }
  
  let sundayOfMonth = getSundayOfMonth(nextSunday)
  
  // If 4th or 5th Sunday, roll to 1st Sunday of next month
  while (sundayOfMonth > 3) {
    // Move to first day of next month
    nextSunday = new Date(nextSunday.getFullYear(), nextSunday.getMonth() + 1, 1)
    const dayOfWeekNew = nextSunday.getDay()
    const daysUntilSundayNew = dayOfWeekNew === 0 ? 0 : 7 - dayOfWeekNew
    nextSunday.setDate(nextSunday.getDate() + daysUntilSundayNew)
    nextSunday.setHours(13, 0, 0, 0)
    sundayOfMonth = getSundayOfMonth(nextSunday)
  }
  
  return nextSunday
}

export function getSundayOrdinal(date: Date): string {
  const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
  const firstSunday = new Date(firstOfMonth)
  const dayOfWeekFirst = firstOfMonth.getDay()
  const daysUntilFirstSunday = dayOfWeekFirst === 0 ? 0 : 7 - dayOfWeekFirst
  firstSunday.setDate(firstOfMonth.getDate() + daysUntilFirstSunday)
  
  const weeksDiff = Math.floor((date.getDate() - firstSunday.getDate()) / 7)
  const sundayNumber = weeksDiff + 1
  
  const ordinals = ["1st", "2nd", "3rd"]
  return ordinals[sundayNumber - 1] || "1st"
}

export function getRotatingMessage(sundayNumber: number): string {
  const messages = [
    "Disrupt the grind. Reclaim your rhythm.",
    "No more survival Mondays. Lead from alignment.",
    "Hustle ends here. Harmony begins now."
  ]
  return messages[(sundayNumber - 1) % 3]
}

export function getMonthName(date: Date): string {
  return date.toLocaleString("en-US", { month: "long" })
}
