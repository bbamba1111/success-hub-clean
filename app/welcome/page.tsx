"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { CheckCircle2, Eye, EyeOff, X } from "lucide-react"
import Link from "next/link"

export default function WelcomePage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [productName, setProductName] = useState("")

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

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword
  const passwordsDontMatch = confirmPassword.length > 0 && password !== confirmPassword
  const passwordMeetsRequirements = password.length >= 6
  const canSubmit = passwordsMatch && passwordMeetsRequirements && userEmail.includes("@")

  useEffect(() => {
    if (isValidEmail(emailParam)) {
      setUserEmail(emailParam!)
    }

    if (firstNameParam && !firstNameParam.includes("{{") && !firstNameParam.includes("[")) {
      setUserName(firstNameParam)
    }

    if (productParam && !productParam.includes("{{") && !productParam.includes("[")) {
      setProductName(productParam)
    }
  }, [emailParam, productParam, firstNameParam])

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
          product: productName || "Make Time For More Experience",
          fromSamCart: true,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setPassword("")
        setConfirmPassword("")
        throw new Error(data.details || data.error || "Failed to create account")
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
      setPassword("")
      setConfirmPassword("")
      setError(err instanceof Error ? err.message : "Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-5 bg-gradient-to-br from-[#F5F1E8] to-white">
      <div className="w-full max-w-xl">
        <div className="flex flex-col gap-5">
          <div className="flex justify-center mb-3">
            <img
              src="/images/logo.png"
              alt="Make Time For More Logo"
              width={68}
              height={68}
              className="rounded-full shadow-lg"
            />
          </div>

          <Card className="border-2 border-[#7FB069]/20 shadow-xl">
            <CardHeader className="text-center pb-3">
              <CardTitle className="text-2xl text-[#7FB069]">
                {userName ? `Welcome, ${userName}!` : "Welcome!"}
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                {productName ? (
                  <>
                    Complete your <span className="font-semibold text-[#7FB069]">{productName}</span> account setup
                    below
                  </>
                ) : (
                  "Complete your account setup below"
                )}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSignup}>
                <div className="flex flex-col gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-sm">
                      Email {!isValidEmail(emailParam) && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      disabled={isValidEmail(emailParam)}
                      className={isValidEmail(emailParam) ? "bg-gray-50 text-sm" : "text-sm"}
                      placeholder="your@email.com"
                      required
                    />
                    {!isValidEmail(emailParam) && (
                      <p className="text-xs text-gray-500">Enter the email you used for your purchase</p>
                    )}
                  </div>

                  {userName && (
                    <div className="grid gap-2">
                      <Label htmlFor="firstName" className="text-sm">
                        First Name
                      </Label>
                      <Input id="firstName" type="text" value={userName} disabled className="bg-gray-50 text-sm" />
                    </div>
                  )}

                  {productName && (
                    <div className="grid gap-2">
                      <Label htmlFor="product" className="text-sm">
                        Product
                      </Label>
                      <Input id="product" type="text" value={productName} disabled className="bg-gray-50 text-sm" />
                    </div>
                  )}

                  <div className="grid gap-2">
                    <Label htmlFor="password" className="text-sm">
                      Create Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="At least 6 characters"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="text-sm pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {passwordMeetsRequirements ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> At least 6 characters
                        </span>
                      ) : (
                        <span className="text-gray-500">At least 6 characters required</span>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password" className="text-sm">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter your password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`text-sm pr-10 ${
                          passwordsMatch
                            ? "border-green-500 focus-visible:ring-green-500"
                            : passwordsDontMatch
                              ? "border-red-500 focus-visible:ring-red-500"
                              : ""
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {confirmPassword.length > 0 && (
                      <div className="flex items-center gap-2 text-xs">
                        {passwordsMatch ? (
                          <span className="text-green-600 flex items-center gap-1 font-medium">
                            <CheckCircle2 className="h-3 w-3" /> Passwords match
                          </span>
                        ) : (
                          <span className="text-red-600 flex items-center gap-1 font-medium">
                            <X className="h-3 w-3" /> Passwords don't match
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#7FB069] to-[#E26C73] hover:from-[#6FA055] hover:to-[#D55A60] text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading || !canSubmit}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating Account...
                      </div>
                    ) : (
                      "Create My Account"
                    )}
                  </Button>

                  <p className="text-xs text-center text-gray-500 mt-2">
                    Already have an account?{" "}
                    <Link
                      href={`/auth/login${userEmail ? `?email=${encodeURIComponent(userEmail)}` : ""}`}
                      className="text-[#7FB069] hover:text-[#6FA055] hover:underline font-medium"
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
