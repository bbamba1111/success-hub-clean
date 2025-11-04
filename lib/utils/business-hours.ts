/**
 * Success Hub Business Hours Utilities
 * Enforces work-life balance by limiting hub access to 7 AM - 11 PM ET
 */

export interface BusinessHoursStatus {
  isOpen: boolean
  message: string
  hoursUntilChange: number // Hours until hub opens or closes
  minutesUntilChange: number // Minutes until hub opens or closes
}

/**
 * Check if current time is within Success Hub business hours (7 AM - 11 PM ET)
 */
export function isWithinBusinessHours(): boolean {
  const now = new Date()
  const etTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }))
  const hour = etTime.getHours()

  // Business hours: 7 AM (7) to 11 PM (23)
  return hour >= 7 && hour < 23
}

/**
 * Check if Monday Only members have full access (Mon/Tues 7 AM - 10 PM ET)
 */
export function hasMondayTuesdayAccess(): boolean {
  const now = new Date()
  const etTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }))
  const dayOfWeek = etTime.getDay() // 0 = Sunday, 1 = Monday, 2 = Tuesday
  const hour = etTime.getHours()

  // Monday (1) or Tuesday (2), between 7 AM and 10 PM
  const isMonOrTues = dayOfWeek === 1 || dayOfWeek === 2
  const isWithinMonTuesHours = hour >= 7 && hour < 22 // 7 AM to 10 PM

  return isMonOrTues && isWithinMonTuesHours
}

/**
 * Get business hours status with countdown information
 */
export function getBusinessHoursStatus(): BusinessHoursStatus {
  const now = new Date()
  const etTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }))
  const hour = etTime.getHours()
  const minute = etTime.getMinutes()
  const isOpen = isWithinBusinessHours()

  if (isOpen) {
    // Hub is open - calculate time until closing (11 PM)
    const hoursUntilClose = 22 - hour // 23:00 - current hour
    const minutesUntilClose = 60 - minute

    return {
      isOpen: true,
      message: `Success Hub Business Hours: 7 AM - 11 PM ET`,
      hoursUntilChange: hoursUntilClose,
      minutesUntilChange: minutesUntilClose,
    }
  } else {
    // Hub is closed - calculate time until opening (7 AM)
    let hoursUntilOpen: number
    if (hour < 7) {
      // Before 7 AM today
      hoursUntilOpen = 7 - hour
    } else {
      // After 11 PM - opens tomorrow at 7 AM
      hoursUntilOpen = 24 - hour + 7
    }
    const minutesUntilOpen = 60 - minute

    return {
      isOpen: false,
      message: "The Success Hub is closed for the night. We'll see you tomorrow at 7 AM ET.",
      hoursUntilChange: hoursUntilOpen,
      minutesUntilChange: minutesUntilOpen,
    }
  }
}

/**
 * Get Monday/Tuesday access status for Monday Only members
 */
export function getMondayTuesdayStatus(): { hasAccess: boolean; message: string } {
  const now = new Date()
  const etTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }))
  const dayOfWeek = etTime.getDay()
  const hour = etTime.getHours()

  const isMonOrTues = dayOfWeek === 1 || dayOfWeek === 2
  const isWithinMonTuesHours = hour >= 7 && hour < 22

  if (isMonOrTues && isWithinMonTuesHours) {
    const hoursUntilEnd = 21 - hour // 22:00 - current hour
    return {
      hasAccess: true,
      message: `Monday/Tuesday Special: Full access until 10 PM ET (${hoursUntilEnd}h remaining)`,
    }
  } else if (isMonOrTues && hour >= 22) {
    return {
      hasAccess: false,
      message: "Monday/Tuesday access ended at 10 PM ET. Upgrade for access during Success Hub Business Hours.",
    }
  } else {
    return {
      hasAccess: false,
      message:
        "Full access available Monday & Tuesday 7 AM - 10 PM ET. Upgrade for access during Success Hub Business Hours.",
    }
  }
}
