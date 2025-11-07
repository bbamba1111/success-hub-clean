"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

export default function ConfirmEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  useEffect(() => {
    const confirmEmail = async () => {
      if (!token) {
        setStatus("error")
        setMessage("No confirmation token provided")
        return
      }

      try {
        const response = await fetch("/api/auth/confirm-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to confirm email")
        }

        setStatus("success")
        setMessage("Your email has been confirmed successfully!")

        // Redirect to homepage after 2 seconds
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } catch (error) {
        console.error("[v0] Email confirmation error:", error)
        setStatus("error")
        setMessage(error instanceof Error ? error.message : "Failed to confirm email")
      }
    }

    confirmEmail()
  }, [token, router])

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
              <div className="flex justify-center mb-4">
                {status === "loading" && (
                  <div className="w-16 h-16 bg-gradient-to-br from-[#7FB069] to-[#E26C73] rounded-full flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                  </div>
                )}
                {status === "success" && (
                  <div className="w-16 h-16 bg-gradient-to-br from-[#7FB069] to-[#E26C73] rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                )}
                {status === "error" && (
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                    <XCircle className="w-10 h-10 text-white" />
                  </div>
                )}
              </div>
              <CardTitle className="text-2xl text-[#7FB069]">
                {status === "loading" && "Confirming Email..."}
                {status === "success" && "Email Confirmed!"}
                {status === "error" && "Confirmation Failed"}
              </CardTitle>
              <CardDescription>{message || "Please wait while we confirm your email address"}</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              {status === "success" && (
                <>
                  <p className="text-gray-700 leading-relaxed">
                    You'll be redirected to the Success Hub in a moment...
                  </p>
                  <Button
                    onClick={() => router.push("/")}
                    className="w-full bg-gradient-to-r from-[#7FB069] to-[#E26C73] hover:from-[#6FA055] hover:to-[#D55A60] text-white font-semibold"
                  >
                    Go to Hub Now
                  </Button>
                </>
              )}
              {status === "error" && (
                <Button
                  onClick={() => router.push("/auth/login")}
                  className="w-full bg-gradient-to-r from-[#7FB069] to-[#E26C73] hover:from-[#6FA055] hover:to-[#D55A60] text-white font-semibold"
                >
                  Go to Login
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
