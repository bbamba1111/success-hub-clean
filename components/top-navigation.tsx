"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Brain, Users } from 'lucide-react'

export function TopNavigation() {
  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/images/logo.png"
              alt="Make Time For More Logo"
              width={48}
              height={48}
              className="rounded-full shadow-md"
            />
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Main
              </Button>
            </Link>
            
            <Link href="/human-zone-of-genius">
              <Button variant="ghost" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Zone of Genius
              </Button>
            </Link>
            
            <Link href="/ai-executive-team">
              <Button variant="ghost" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                AI Team
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
