'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Clock, GraduationCap, Calendar, Trophy, Users } from 'lucide-react'

export function TopNavigation() {
  const pathname = usePathname()
  
  const navItems = [
    { href: '/hub', label: 'Success Hub', icon: Home },
    { href: '/4-hour-workday', label: '4-Hour CEO', icon: Clock },
    { href: '/human-zone-of-genius', label: 'Zone of Genius', icon: Users },
    { href: '/ai-executive-team', label: 'AI Team', icon: Users },
    { href: '/my-results', label: 'My Results', icon: Trophy },
  ]
  
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/hub" className="flex items-center space-x-2">
          <img
            src="/images/logo.png"
            alt="Make Time For More Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="font-['Great_Vibes'] text-2xl text-[#E26C73]">
            Make Time For More™
          </span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#E26C73]/10 text-[#E26C73]'
                    : 'text-muted-foreground hover:bg-[#7FB069]/10 hover:text-[#7FB069]'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button className="p-2 text-muted-foreground hover:text-foreground">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}
