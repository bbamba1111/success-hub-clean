"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogIn, LogOut } from 'lucide-react'
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PRIMARY_DESTINATIONS } from "@/lib/navigation/primary-nav"

export function TopNavigation() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    // Check current user
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <nav className="sticky top-0 z-50 border-b border-black/[0.06] bg-white/95 shadow-ds-sm backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-3 py-4">
        {/* Flex-in-flow layout (no absolute positioning): logo, nav, and auth
            share the row via flex so three nav items can never overlap the
            account email/logout controls, no matter the viewport width. */}
        <div className="flex items-center gap-3">

          {/* Logo — far left */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/images/logo.png"
              alt="Make Time For More Logo"
              width={48}
              height={48}
              className="rounded-full shadow-md"
            />
          </Link>

          {/* Primary navigation — centered in the remaining space, shrinks
              and wraps its own items before it can ever collide with auth. */}
          {user && (
            <div className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-1 sm:gap-2">
              {PRIMARY_DESTINATIONS.map(({ id, navLabel, navBadge, href }) => {
                const active = isActive(href)
                return (
                  <Link key={id} href={href}>
                    <Button
                      variant="ghost"
                      className={`flex items-center gap-1.5 ${
                        active
                          ? "bg-[#5D9D61]/10 text-[#3A2E33] font-semibold"
                          : "text-[#5C4F55] hover:text-[#3A2E33]"
                      }`}
                      data-testid={`button-nav-${id}`}
                    >
                      <span className="hidden lg:inline">{navLabel}</span>
                      {navBadge && (
                        <span className="hidden lg:inline rounded-full bg-[#E8C4A0]/40 px-2 py-0.5 font-montserrat text-[10px] font-bold uppercase tracking-[0.1em] text-[#3A2E33]">
                          {navBadge}
                        </span>
                      )}
                    </Button>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Auth — far right */}
          <div className={`flex items-center gap-3 shrink-0 ${user ? "" : "ml-auto"}`}>
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3">
                    <span className="hidden xl:inline text-sm text-muted-foreground">
                      {user.email}
                    </span>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="flex items-center gap-2"
                      data-testid="button-logout"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="hidden sm:inline">Log Out</span>
                    </Button>
                  </div>
                ) : (
                  <Link href="/auth/login">
                    <Button
                      className="flex items-center gap-2 bg-brand-green text-white hover:bg-brand-green-dark"
                      data-testid="button-login"
                    >
                      <LogIn className="h-4 w-4" />
                      Log In
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  )
}
