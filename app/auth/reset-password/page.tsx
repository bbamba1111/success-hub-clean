"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Eye, EyeOff, CheckCircle2, X } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword
  const passwordsDontMatch = confirmPassword.length > 0 && password !== confirmPassword
  const passwordMeetsRequirements = password.length >= 6

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false)
        setError("Invalid or missing reset token")
        return
      }

      try {
        const response = await fetch("/api/auth/verify-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (data.valid && data.userId) {
          setTokenValid(true)
          setUserId(data.userId)
        } else {
          setTokenValid(false)
          setError("This reset link has expired or is invalid")
        }
      } catch (err) {
        setTokenValid(false)
        setError("Failed to validate reset token")
      }
    }

    validateToken()
  }, [token])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

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

    if (!userId || !token) {
      setError("Invalid reset session")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update password")
      }

      router.push("/auth/login?reset=success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (tokenValid === null) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-[#F5F1E8] to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7FB069] mx-auto mb-4"></div>
          <p className="text-gray-600">Validating reset link...</p>
        </div>
      </div>
    )
  }

  if (tokenValid === false) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-[#F5F1E8] to-white">
        <Card className="border-2 border-red-200 max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-600">Invalid Reset Link</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push("/auth/forgot-password")}
              className="w-full bg-gradient-to-r from-[#7FB069] to-[#E26C73] hover:from-[#6FA055] hover:to-[#D55A60] text-white font-semibold"
            >
              Request New Reset Link
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
              <CardTitle className="text-2xl text-[#7FB069]">Create New Password</CardTitle>
              <CardDescription>Enter your new password below</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPassword}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="At least 6 characters"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#7FB069] transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {password.length > 0 && (
                      <div className="flex items-center gap-2 text-xs">
                        {passwordMeetsRequirements ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> At least 6 characters
                          </span>
                        ) : (
                          <span className="text-gray-500">At least 6 characters required</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter your password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`pr-10 ${
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#7FB069] transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#7FB069] to-[#E26C73] hover:from-[#6FA055] hover:to-[#D55A60] text-white font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
