"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"

export default function WelcomePage() {
  const [signupPassword, setSignupPassword] = useState("")
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [productName, setProductName] = useState("")
  const [activeTab, setActiveTab] = useState<"signup" | "login">("signup")
  const [accountStatus, setAccountStatus] = useState<"processing" | "ready">("processing")
  const [timeElapsed, setTimeElapsed] = useState(0)

  const router = useRouter()
  const searchParams = useSearchParams()
  const emailParam = searchParams.get("email")
  const productParam = searchParams.get("product") || searchParams.get("product_name")
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
      checkAccountExists(emailParam!)
    }

    if (firstNameParam && !firstNameParam.includes("{{") && !firstNameParam.includes("[")) {
      setUserName(firstNameParam)
    }

    if (productParam && !productParam.includes("{{") && !productParam.includes("[")) {
      setProductName(productParam)
    }
  }, [emailParam, productParam, firstNameParam])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => {
        const newTime = prev + 1
        // After 120 seconds (2 minutes), switch to login tab and mark account as ready
        if (newTime >= 120 && accountStatus === "processing") {
          setAccountStatus("ready")
          setActiveTab("login")
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [accountStatus])

  const checkAccountExists = async (email: string) => {
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        const data = await response.json()
        setAccountStatus("ready")
        setActiveTab("login")
        if (data.firstName && !userName) {
          setUserName(data.firstName)
        }
        if (data.productName && !productName) {
          setProductName(data.productName)
        }
      }
    } catch (err) {
      console.error("[v0] Error checking account:", err)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!userEmail || !userEmail.includes("@")) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    if (signupPassword !== signupConfirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (signupPassword.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      // Call signup API
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          password: signupPassword,
          firstName: userName,
          product: productName,
          fromSamCart: true,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account")
      }

      // Log in after successful signup
      const supabase = createClient()
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: signupPassword,
      })

      if (loginError) throw loginError

      router.push("/hub")
    } catch (err) {
      console.error("[v0] Signup error:", err)
      setError(err instanceof Error ? err.message : "Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!userEmail || !userEmail.includes("@")) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    if (loginPassword.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: loginPassword,
      })

      if (loginError) throw loginError

      router.push("/hub")
    } catch (err) {
      console.error("[v0] Login error:", err)
      setError(err instanceof Error ? err.message : "Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img
              src="/images/logo.png"
              alt="Make Time For More Logo"
              width={80}
              height={80}
              className="rounded-full shadow-lg"
            />
          </div>

          <Card className="border-2 border-blue-200 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl text-blue-900">
                {userName ? `Welcome, ${userName}!` : userEmail ? `Welcome!` : "Welcome!"}
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                {productName ? (
                  <>
                    Thank you for purchasing <span className="font-semibold text-blue-700">{productName}</span>
                  </>
                ) : (
                  "Thank you for your purchase!"
                )}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Status Indicator */}
              <div
                className={`mb-6 p-5 rounded-lg border ${
                  accountStatus === "ready" ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex items-center mb-2">
                  {accountStatus === "processing" ? (
                    <>
                      <Loader2 className="h-5 w-5 text-blue-600 mr-2 animate-spin" />
                      <span className="text-base text-blue-800 font-medium">Account setup in progress...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-base text-green-800 font-medium">Account ready!</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {accountStatus === "processing"
                    ? `Processing your order... (${Math.floor(timeElapsed / 60)}:${String(timeElapsed % 60).padStart(2, "0")})`
                    : "Your account has been created. Please log in below."}
                </p>
              </div>

              {/* Tabs for Signup/Login */}
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "signup" | "login")}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signup" className="text-base">
                    Create Account
                  </TabsTrigger>
                  <TabsTrigger value="login" className="text-base">
                    Login
                  </TabsTrigger>
                </TabsList>

                {/* Signup Tab */}
                <TabsContent value="signup">
                  <form onSubmit={handleSignup}>
                    <div className="flex flex-col gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="signup-email" className="text-base">
                          Email
                        </Label>
                        <Input
                          id="signup-email"
                          type="email"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          disabled={isValidEmail(emailParam)}
                          className="bg-gray-50 text-base"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="signup-password" className="text-base">
                          Create Password
                        </Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="At least 6 characters"
                          required
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className="text-base"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="signup-confirm-password" className="text-base">
                          Confirm Password
                        </Label>
                        <Input
                          id="signup-confirm-password"
                          type="password"
                          placeholder="Re-enter your password"
                          required
                          value={signupConfirmPassword}
                          onChange={(e) => setSignupConfirmPassword(e.target.value)}
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
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-base"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Creating Account...
                          </div>
                        ) : (
                          "Create My Account"
                        )}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                {/* Login Tab */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin}>
                    <div className="flex flex-col gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="login-email" className="text-base">
                          Email
                        </Label>
                        <Input
                          id="login-email"
                          type="email"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          disabled={isValidEmail(emailParam)}
                          className="bg-gray-50 text-base"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="login-password" className="text-base">
                          Password
                        </Label>
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="Enter your password"
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
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
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-base"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Logging In...
                          </div>
                        ) : (
                          "Log In"
                        )}
                      </Button>
                      <p className="text-sm text-center text-gray-500">
                        <a href="/auth/forgot-password" className="text-blue-600 hover:underline">
                          Forgot your password?
                        </a>
                      </p>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
