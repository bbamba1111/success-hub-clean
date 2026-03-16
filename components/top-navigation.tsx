"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Brain, LogIn, LogOut } from 'lucide-react'
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function TopNavigation() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
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
              <Button variant="ghost" className="flex items-center gap-2" data-testid="button-nav-home">
                <Home className="h-4 w-4" />
                Main
              </Button>
            </Link>
            
            <Link href="/human-zone-of-genius-team">
              <Button variant="ghost" className="flex items-center gap-2" data-testid="button-nav-workday">
                <Brain className="h-4 w-4" />
                4-Hour Focused CEO Workday
              </Button>
            </Link>

            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {user.email}
                    </span>
                    <Button 
                      variant="outline" 
                      onClick={handleLogout}
                      className="flex items-center gap-2"
                      data-testid="button-logout"
                    >
                      <LogOut className="h-4 w-4" />
                      Log Out
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
