"use client"

import type React from "react"
import { setUserPassword } from "./actions"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function WelcomePage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSettingPassword, setIsSettingPassword] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [userId, setUserId] = useState("")
  const [hasToken, setHasToken] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailParam = searchParams.get("email")

  useEffect(() => {
    async function verifyUser() {
      if (!emailParam) {
        setError("Email parameter is missing")
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailParam }),
        })

        const data = await response.json()

        if (!response.ok) {
          if (response.status === 404 && retryCount < 5) {
            console.log(`[v0] User not found, retrying in 2 seconds (attempt ${retryCount + 1}/5)`)
            setTimeout(() => {
              setRetryCount(retryCount + 1)
            }, 2000)
            return
          }
          throw new Error(data.error || "Failed to verify email")
        }

        if (data.tempPassword) {
          // User has token, try auto-login
          const supabase = createClient()
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.tempPassword,
          })

          if (signInError) {
            console.error("[v0] Auto-login failed:", signInError)
            // Auto-login failed, but we can still let them set password
            setHasToken(false)
          } else {
            setHasToken(true)
          }
        }

        setUserEmail(data.email)
        setUserId(data.userId)
        setIsLoading(false)
      } catch (err) {
        console.error("[v0] Email verification error:", err)
        setError(err instanceof Error ? err.message : "Failed to verify email. Please try logging in.")
        setIsLoading(false)
      }
    }

    verifyUser()
  }, [emailParam, retryCount])

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSettingPassword(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsSettingPassword(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsSettingPassword(false)
      return
    }

    try {
      const supabase = createClient()

      if (!hasToken) {
        const result = await setUserPassword(userEmail, password)

        if (result.error) {
          throw new Error(result.error)
        }

        // Now login with new password
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: userEmail,
          password: password,
        })

        if (loginError) throw loginError
      } else {
        // Already logged in, just update password
        const { error: updateError } = await supabase.auth.updateUser({
          password: password,
        })

        if (updateError) throw updateError

        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          await supabase.from("user_profiles").update({ password_set: true }).eq("id", user.id)
        }
      }

      router.push("/hub")
    } catch (err) {
      console.error("[v0] Password set error:", err)
      setError(err instanceof Error ? err.message : "Failed to set password")
    } finally {
      setIsSettingPassword(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-[#F5F1E8] to-white">
        <Card className="w-full max-w-md border-2 border-[#7FB069]/20">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#7FB069] border-t-transparent" />
              <p className="text-center text-gray-600">
                {retryCount > 0 ? "Almost there, setting up your account..." : "Setting up your account..."}
              </p>
              {retryCount > 2 && (
                <p className="text-xs text-center text-gray-500">This is taking longer than usual, please wait...</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error && !userEmail) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-[#F5F1E8] to-white">
        <Card className="w-full max-w-md border-2 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/auth/login")} className="w-full bg-[#7FB069] hover:bg-[#6FA055]">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-[#F5F1E8] to-white">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="flex justify-center mb-4">
            <img
              src="/images/logo.png"
              alt="Make Time For More Logo"
              width={80}
              height={80}
              className="rounded-full shadow-lg"
            />
          </div>

          <Card className="border-2 border-[#7FB069]/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-[#7FB069]">Welcome to Your Success Hub!</CardTitle>
              <CardDescription>Set your password to secure your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSetPassword}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={userEmail} disabled className="bg-gray-50" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Create Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="At least 6 characters"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Re-enter your password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#7FB069] to-[#E26C73] hover:from-[#6FA055] hover:to-[#D55A60] text-white font-semibold"
                    disabled={isSettingPassword}
                  >
                    {isSettingPassword ? "Setting Password..." : "Set Password & Continue"}
                  </Button>
                  <p className="text-xs text-center text-gray-500">You'll use this password to log in next time</p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
