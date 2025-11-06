"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"

export default function WelcomePage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [productName, setProductName] = useState("")
  const [accountExists, setAccountExists] = useState(false)
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
        if (newTime >= 120 && accountExists) {
          router.push(`/auth/login?email=${encodeURIComponent(userEmail)}`)
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [accountExists, userEmail, router])

  const checkAccountExists = async (email: string) => {
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        const data = await response.json()
        setAccountExists(true)
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

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          password: password,
          firstName: userName,
          product: productName,
          fromSamCart: true,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account")
      }

      const supabase = createClient()
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: password,
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

  if (accountExists) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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

            <Card className="border-2 border-green-200 shadow-xl">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-3xl text-green-900">
                  {userName ? `Welcome Back, ${userName}!` : "Welcome Back!"}
                </CardTitle>
                <CardDescription className="text-lg text-gray-600">Your account is ready</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="mb-6 p-5 rounded-lg border bg-green-50 border-green-200">
                  <div className="flex items-center mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-base text-green-800 font-medium">Account ready!</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Your account has been created successfully. Please log in to access your Success Hub.
                  </p>
                </div>

                <Link href={`/auth/login${userEmail ? `?email=${encodeURIComponent(userEmail)}` : ""}`}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-base">
                    Go to Login Page
                  </Button>
                </Link>

                <p className="text-sm text-center text-gray-500 mt-4">
                  You'll be automatically redirected in {120 - timeElapsed} seconds
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
              <div className="mb-6 p-5 rounded-lg border bg-blue-50 border-blue-200">
                <div className="flex items-center mb-2">
                  <Loader2 className="h-5 w-5 text-blue-600 mr-2 animate-spin" />
                  <span className="text-base text-blue-800 font-medium">Setting up your account...</span>
                </div>
                <p className="text-sm text-gray-600">Create your password below to complete your account setup.</p>
              </div>

              <form onSubmit={handleSignup}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-base">
                      Email {!isValidEmail(emailParam) && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      disabled={isValidEmail(emailParam)}
                      className={isValidEmail(emailParam) ? "bg-gray-50 text-base" : "text-base"}
                      placeholder="your@email.com"
                      required
                    />
                    {!isValidEmail(emailParam) && (
                      <p className="text-sm text-gray-500">Enter the email you used for your purchase</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="text-base">
                      Create Password
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
                      Confirm Password
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

                  <p className="text-sm text-center text-gray-500 mt-2">
                    Already have an account?{" "}
                    <Link
                      href={`/auth/login${userEmail ? `?email=${encodeURIComponent(userEmail)}` : ""}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Log in here
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
