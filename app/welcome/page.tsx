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
  const [isSettingPassword, setIsSettingPassword] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [productName, setProductName] = useState("")
  const [emailFromUrl, setEmailFromUrl] = useState(false)
  const [isLoadingUserData, setIsLoadingUserData] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailParam = searchParams.get("email")
  const productParam = searchParams.get("product")
  const firstNameParam = searchParams.get("first_name")

  const isValidEmail = (email: string | null): boolean => {
    if (!email) return false
    if (email.includes("{{") || email.includes("}}") || email.includes("[") || email.includes("]")) {
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  useEffect(() => {
    if (isValidEmail(emailParam)) {
      setUserEmail(emailParam!)
      setEmailFromUrl(true)
      fetchUserData(emailParam!)
    }

    if (firstNameParam && !firstNameParam.includes("{{") && !firstNameParam.includes("[")) {
      setUserName(firstNameParam)
    }

    if (productParam && !productParam.includes("{{") && !productParam.includes("[")) {
      setProductName(productParam)
    }
  }, [emailParam, productParam, firstNameParam])

  const fetchUserData = async (email: string) => {
    setIsLoadingUserData(true)
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.firstName && !userName) {
          setUserName(data.firstName)
        }
        if (data.productName) {
          setProductName(data.productName)
        }
      }
    } catch (err) {
      console.error("[v0] Error fetching user data:", err)
    } finally {
      setIsLoadingUserData(false)
    }
  }

  const waitForAccountCreation = async (email: string, maxRetries = 15): Promise<boolean> => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        console.log(`[v0] Checking if account exists, attempt ${i + 1}/${maxRetries}`)
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        })

        if (response.ok) {
          console.log("[v0] Account found!")
          return true
        }

        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, 2000))
        }
      } catch (err) {
        console.error("[v0] Error checking account:", err)
      }
    }
    return false
  }

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSettingPassword(true)
    setError(null)

    if (!userEmail || !userEmail.includes("@")) {
      setError("Please enter a valid email address")
      setIsSettingPassword(false)
      return
    }

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
      console.log("[v0] Waiting for account creation...")
      const accountExists = await waitForAccountCreation(userEmail)

      if (!accountExists) {
        throw new Error(
          "Account creation is taking longer than expected. Please try logging in with your email in 1-2 minutes.",
        )
      }

      console.log("[v0] Setting password...")
      const result = await setUserPassword(userEmail, password)

      if (result.error) {
        throw new Error(result.error)
      }

      const supabase = createClient()
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: password,
      })

      if (loginError) throw loginError

      console.log("[v0] Login successful, redirecting to hub...")
      router.push("/hub")
    } catch (err) {
      console.error("[v0] Password set error:", err)
      setError(err instanceof Error ? err.message : "Failed to set password")
    } finally {
      setIsSettingPassword(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-[#F5F1E8] to-white">
      <div className="w-full max-w-2xl">
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
              <CardTitle className="text-3xl text-[#7FB069]">
                {userName ? `Welcome, ${userName}!` : userEmail ? `Welcome!` : "Welcome!"}
              </CardTitle>
              <CardDescription className="text-lg">
                {productName ? (
                  <>
                    Your <span className="font-semibold">{productName}</span> is being set up.
                  </>
                ) : (
                  "Your account is being set up."
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-5 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center mb-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-base text-blue-800 font-medium">Account setup in progress...</span>
                </div>
                <p className="text-sm text-blue-600">
                  {emailFromUrl
                    ? "This typically takes 1-2 minutes. Create your password now while we work!"
                    : "Please enter your email and create a password to complete your account setup."}
                </p>
              </div>

              <form onSubmit={handleSetPassword}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-base">
                      Email {!emailFromUrl && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      disabled={emailFromUrl}
                      className={emailFromUrl ? "bg-gray-50 text-base" : "text-base"}
                      placeholder="Enter your email address"
                      required
                    />
                    {!emailFromUrl && (
                      <p className="text-sm text-gray-600 font-medium">Enter the email you used for your purchase</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="text-base">
                      Create Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="At least 6 characters"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="text-base"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password" className="text-base">
                      Confirm Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Re-enter your password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="text-base"
                    />
                  </div>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-base">
                      {error}
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#7FB069] to-[#E26C73] hover:from-[#6FA055] hover:to-[#D55A60] text-white font-semibold text-base"
                    disabled={isSettingPassword}
                  >
                    {isSettingPassword ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {isSettingPassword && "Creating Your Account..."}
                      </div>
                    ) : (
                      "Create My Account"
                    )}
                  </Button>
                  <p className="text-sm text-center text-gray-500">You'll use this password to log in next time</p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
