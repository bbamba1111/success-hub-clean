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
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href={user ? "/live-today" : "/"} className="flex items-center gap-2 shrink-0">
            <img
              src="/images/logo.png"
              alt="Make Time For More Logo"
              width={48}
              height={48}
              className="rounded-full shadow-md"
            />
          </Link>

          {/* Primary 4-section navigation (Live Today / Lead / Share / Grow) */}
          {user && (
            <div className="flex items-center gap-1 sm:gap-2">
              {PRIMARY_DESTINATIONS.map(({ id, navLabel, href, icon: Icon }) => {
                const active = isActive(href)
                return (
                  <Link key={id} href={href}>
                    <Button
                      variant="ghost"
                      className={`flex items-center gap-2 ${
                        active
                          ? "bg-[#5D9D61]/10 text-[#3A2E33] font-semibold"
                          : "text-[#5C4F55] hover:text-[#3A2E33]"
                      }`}
                      data-testid={`button-nav-${id}`}
                    >
                      <Icon className={`h-4 w-4 ${active ? "text-[#5D9D61]" : ""}`} />
                      <span className="hidden sm:inline">{navLabel}</span>
                    </Button>
                  </Link>
                )
              })}
            </div>
          )}

          <div className="flex items-center gap-3 shrink-0">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3">
                    <span className="hidden md:inline text-sm text-muted-foreground">
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
                      className="flex items-center gap-2 bg-gradient-to-r from-[#5D9D61] to-[#E26C73] text-white hover:opacity-90"
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
