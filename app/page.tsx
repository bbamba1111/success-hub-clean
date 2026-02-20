"use client"

import { useState, useEffect } from "react"
import WorkLifeBalanceAudit from "@/components/work-life-balance-audit"
import { hasCompletedAudit } from "@/utils/audit-storage"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(false)
  const [showAudit, setShowAudit] = useState(false)
  const [hasCompletedAuditBefore, setHasCompletedAuditBefore] = useState(false)

  useEffect(() => {
    // Check if user has completed the audit before
    const auditCompleted = hasCompletedAudit()
    setHasCompletedAuditBefore(auditCompleted)

    // Check if user has chosen not to see the welcome popup
    const dontShowWelcome = localStorage.getItem("dontShowAuditWelcome") === "true"

    if (dontShowWelcome) {
      setShowAudit(true)
    } else {
      setShowWelcome(true)
    }
  }, [])

  // Function to handle audit completion
  const handleAuditComplete = () => {
    setHasCompletedAuditBefore(true)
    setShowAudit(false)
  }

  // Function to start the audit from welcome popup
  const handleStartAudit = () => {
    setShowWelcome(false)
    setShowAudit(true)
  }

  // Function to handle "don't show again" checkbox
  const handleDontShowAgain = (checked: boolean) => {
    if (checked) {
      localStorage.setItem("dontShowAuditWelcome", "true")
    } else {
      localStorage.removeItem("dontShowAuditWelcome")
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gradient-to-b from-white to-brand-tan">
      {showWelcome && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-[600px] min-h-[700px] relative m-4 w-full p-8">
            <button
              onClick={() => setShowWelcome(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none z-10"
            >
              <X className="h-4 w-4" />
            </button>

            {/* 1 inch whitespace + 25% more = 120px */}
            <div className="h-40"></div>

            <div className="flex justify-center mb-4">
              <Image
                src="/images/logo.png"
                alt="Make Time For More Logo"
                width={120}
                height={120}
                className="rounded-full"
              />
            </div>

            <h1 className="text-4xl brand-title text-center mb-2 text-brand-pink">Make Time For More™</h1>

            <h2 className="text-3xl brand-subtitle text-center mb-8 text-black">Work-Life Balance Audit</h2>

            <p className="text-center text-black mb-6 px-4 text-lg leading-relaxed">
              This is your personal 15-question Work-Life Balance Audit based on the 13 Core Life Value Areas we focus
              on inside the Make Time For More™ Work-Life Balance Experience.
            </p>

            <div className="flex justify-center mb-6">
              <Button
                onClick={handleStartAudit}
                className="bg-brand-green hover:bg-green-600 text-white px-12 py-6 text-xl header-bold rounded-lg"
              >
                Take The FREE Audit Now!
              </Button>
            </div>

            <p className="text-center text-black mb-6 text-lg">This is not about judgment — this is about clarity.</p>

            <div className="flex items-center justify-center mb-8">
              <input
                type="checkbox"
                id="dontShow"
                className="mr-3 w-4 h-4"
                onChange={(e) => handleDontShowAgain(e.target.checked)}
              />
              <label htmlFor="dontShow" className="text-base text-black">
                Don't show this again
              </label>
            </div>

            {/* Add some bottom spacing */}
            <div className="h-8"></div>
          </div>
        </div>
      )}

      {showAudit && <WorkLifeBalanceAudit onClose={() => setShowAudit(false)} onComplete={handleAuditComplete} />}
    </main>
  )
}
