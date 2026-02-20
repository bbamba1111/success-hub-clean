"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { hasCompletedAudit } from "@/utils/audit-storage"
import { Menu, RefreshCw, X, ExternalLink, Home } from "lucide-react"

export default function NavHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hasResults, setHasResults] = useState(false)

  useEffect(() => {
    setHasResults(hasCompletedAudit())
  }, [])

  const navigateTo = (path: string) => {
    router.push(path)
    setIsMenuOpen(false)
  }

  const openApplyNow = () => {
    window.open(
      "https://docs.google.com/forms/d/e/1FAIpQLSeYa2yNmiIOXykp3Kd5Xts0jDPe96NJ4adWhFYEwi5GXZ3Ilw/viewform?usp=header",
      "_blank",
    )
    setIsMenuOpen(false)
  }

  const handleRetakeAudit = () => {
    // Clear the "don't show again" setting so welcome popup shows
    localStorage.removeItem("dontShowAuditWelcome")
    navigateTo("/")
  }

  const handleBackHome = () => {
    // Clear the "don't show again" setting so welcome popup shows
    localStorage.removeItem("dontShowAuditWelcome")
    navigateTo("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-brand-tan shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Make Time For More Logo"
            width={40}
            height={40}
            className="rounded-full cursor-pointer"
            onClick={handleBackHome}
          />
          <span className="brand-title text-brand-pink hidden md:inline-block">Make Time For More™</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleBackHome}
            className={`text-black hover:bg-brand-tan ${pathname === "/" ? "bg-brand-tan" : ""}`}
          >
            <Home className="h-4 w-4 mr-2" />
            Back Home
          </Button>

          <Button variant="ghost" onClick={handleRetakeAudit} className="text-black hover:bg-brand-tan">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retake Audit
          </Button>

          <Button variant="ghost" onClick={openApplyNow} className="bg-brand-green text-white hover:bg-green-600">
            <ExternalLink className="h-4 w-4 mr-2" />
            APPLY NOW!
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigateTo("/about")}
            className={`text-black hover:bg-brand-tan ${pathname === "/about" ? "bg-brand-tan" : ""}`}
          >
            About
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigateTo("/learn-more")}
            className={`text-black hover:bg-brand-tan ${pathname === "/learn-more" ? "bg-brand-tan" : ""}`}
          >
            Learn More
          </Button>

          <Button
            variant="ghost"
            onClick={() => navigateTo("/join-us")}
            className={`text-black hover:bg-brand-tan ${pathname === "/join-us" ? "bg-brand-tan" : ""}`}
          >
            Join Us
          </Button>

          <Button
            variant="ghost"
            onClick={() => window.open("https://www.maketimeformore.com", "_blank")}
            className="text-black hover:bg-brand-tan"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit Website
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-brand-tan shadow-md">
          <nav className="flex flex-col p-4">
            <Button
              variant="ghost"
              onClick={handleBackHome}
              className={`justify-start text-black hover:bg-brand-tan ${pathname === "/" ? "bg-brand-tan" : ""} mb-2`}
            >
              <Home className="h-4 w-4 mr-2" />
              Back Home
            </Button>

            <Button
              variant="ghost"
              onClick={handleRetakeAudit}
              className="justify-start text-black hover:bg-brand-tan mb-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retake Audit
            </Button>

            <Button
              variant="ghost"
              onClick={openApplyNow}
              className="justify-start bg-brand-green text-white hover:bg-green-600 mb-2"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              APPLY NOW!
            </Button>

            <Button
              variant="ghost"
              onClick={() => navigateTo("/about")}
              className={`justify-start text-black hover:bg-brand-tan ${pathname === "/about" ? "bg-brand-tan" : ""} mb-2`}
            >
              About
            </Button>

            <Button
              variant="ghost"
              onClick={() => navigateTo("/learn-more")}
              className={`justify-start text-black hover:bg-brand-tan ${pathname === "/learn-more" ? "bg-brand-tan" : ""} mb-2`}
            >
              Learn More
            </Button>

            <Button
              variant="ghost"
              onClick={() => navigateTo("/join-us")}
              className={`justify-start text-black hover:bg-brand-tan ${pathname === "/join-us" ? "bg-brand-tan" : ""} mb-2`}
            >
              Join Us
            </Button>

            <Button
              variant="ghost"
              onClick={() => window.open("https://www.maketimeformore.com", "_blank")}
              className="justify-start text-black hover:bg-brand-tan mb-2"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Website
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
