"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogIn, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function SundayShiftLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    checkUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <>
      {/* Custom Nav for Sunday Shift */}
      <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/sunday-shift" className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Make Time For More Logo"
                width={48}
                height={48}
                className="rounded-full shadow-md"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-[#2F4F4F]">
                  Make Time For More<sup className="text-xs">™</sup> Harmony
                </span>
                <span className="text-xs text-gray-500">
                  The Parallel Lane & Counterpart to Hustle Entrepreneurship
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              {!loading && (
                <>
                  {user ? (
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">{user.email}</span>
                      <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        Log Out
                      </Button>
                    </div>
                  ) : (
                    <Link href="/auth/login">
                      <Button className="flex items-center gap-2 bg-gradient-to-r from-[#5D9D61] to-[#E26C73] text-white hover:opacity-90">
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
      {children}
    </>
  )
}

