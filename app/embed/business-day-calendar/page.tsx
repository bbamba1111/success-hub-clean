"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const EVENTBRITE_LINK = "https://www.eventbrite.com/e/make-time-for-moretm-tickets-1987139297130?aff=oddtdtcreator"

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export default function BusinessDayCalendar() {
  const [currentMonth, setCurrentMonth] = useState(3) // April (0-indexed)
  const year = 2026

  const daysInMonth = getDaysInMonth(year, currentMonth)
  const firstDay = getFirstDayOfMonth(year, currentMonth)

  const prevMonth = () => {
    if (currentMonth > 3) { // Don't go before April
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth < 11) { // Don't go past December
      setCurrentMonth(currentMonth + 1)
    }
  }

  // Generate calendar days
  const calendarDays = []
  
  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null)
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, currentMonth, day)
    const isMonday = date.getDay() === 1
    calendarDays.push({ day, isMonday })
  }

  return (
    <div 
      style={{
        minHeight: "100vh",
        backgroundImage: "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Mar%2015%2C%202026%2C%2005_46_54%20AM-K3v9T9X0HvemnrdaG6UH81g7uEAHbq.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        padding: "20px",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Title */}
        <h1 style={{
          textAlign: "center",
          fontSize: "28px",
          fontWeight: "bold",
          color: "#333",
          marginBottom: "8px",
          textShadow: "0 1px 2px rgba(255,255,255,0.8)"
        }}>
          Join The Work-Life Balance Business Day™
        </h1>
        <p style={{
          textAlign: "center",
          fontSize: "18px",
          color: "#555",
          marginBottom: "24px",
          textShadow: "0 1px 2px rgba(255,255,255,0.8)"
        }}>
          This Monday from April thru December 2026
        </p>

        {/* Calendar Container */}
        <div style={{
          background: "rgba(255, 255, 255, 0.92)",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          overflow: "hidden"
        }}>
          {/* Month Navigation */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            background: "linear-gradient(to right, #E26C73, #7FB069)",
            color: "white"
          }}>
            <button 
              onClick={prevMonth}
              disabled={currentMonth <= 3}
              style={{
                background: currentMonth <= 3 ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.2)",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                cursor: currentMonth <= 3 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s"
              }}
            >
              <ChevronLeft size={24} color="white" />
            </button>
            
            <h2 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
              {MONTHS[currentMonth]} {year}
            </h2>
            
            <button 
              onClick={nextMonth}
              disabled={currentMonth >= 11}
              style={{
                background: currentMonth >= 11 ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.2)",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                cursor: currentMonth >= 11 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s"
              }}
            >
              <ChevronRight size={24} color="white" />
            </button>
          </div>

          {/* Day Headers */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            background: "#f8f9fa",
            borderBottom: "1px solid #e5e7eb"
          }}>
            {DAYS.map((day, index) => (
              <div 
                key={day}
                style={{
                  padding: "12px 8px",
                  textAlign: "center",
                  fontWeight: "600",
                  fontSize: "14px",
                  color: index === 1 ? "#7FB069" : "#666" // Highlight Monday
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "1px",
            background: "#e5e7eb",
            padding: "1px"
          }}>
            {calendarDays.map((dayInfo, index) => (
              <div 
                key={index}
                style={{
                  background: dayInfo?.isMonday ? "#f0fdf4" : "white",
                  minHeight: "90px",
                  padding: "8px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                {dayInfo && (
                  <>
                    <span style={{
                      fontSize: "16px",
                      fontWeight: dayInfo.isMonday ? "bold" : "normal",
                      color: dayInfo.isMonday ? "#7FB069" : "#333",
                      marginBottom: "6px"
                    }}>
                      {dayInfo.day}
                    </span>
                    
                    {dayInfo.isMonday && (
                      <a 
                        href={EVENTBRITE_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: "linear-gradient(to right, #E26C73, #7FB069)",
                          color: "white",
                          padding: "6px 10px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: "600",
                          textDecoration: "none",
                          textAlign: "center",
                          lineHeight: "1.2",
                          transition: "transform 0.2s, box-shadow 0.2s",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "scale(1.05)"
                          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)"
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "scale(1)"
                          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)"
                        }}
                      >
                        Join This<br/>Monday
                      </a>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            padding: "16px 24px",
            background: "#f8f9fa",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px"
          }}>
            <img 
              src="https://www.eventbrite.com/blog/wp-content/uploads/2022/10/Eventbrite-logo-orange.png" 
              alt="Eventbrite" 
              style={{ height: "24px" }}
            />
            <span style={{ color: "#666", fontSize: "14px" }}>
              Click any Monday to register on Eventbrite
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
