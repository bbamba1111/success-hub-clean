"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function ConfirmEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const confirmEmail = async () => {
      const token = searchParams.get("token")

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

        if (response.ok) {
          setStatus("success")
          setMessage("Your email has been confirmed successfully!")
          setTimeout(() => router.push("/hub"), 2000)
        } else {
          setStatus("error")
          setMessage(data.error || "Failed to confirm email")
        }
      } catch (error) {
        setStatus("error")
        setMessage("An error occurred while confirming your email")
      }
    }

    confirmEmail()
  }, [searchParams, router])

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
                {status === "loading" && <Loader2 className="w-16 h-16 text-[#7FB069] animate-spin" />}
                {status === "success" && (
                  <div className="w-16 h-16 bg-gradient-to-br from-[#7FB069] to-[#E26C73] rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                )}
                {status === "error" && (
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="w-10 h-10 text-red-600" />
                  </div>
                )}
              </div>
              <CardTitle className="text-2xl text-[#7FB069]">
                {status === "loading" && "Confirming Your Email..."}
                {status === "success" && "Email Confirmed!"}
                {status === "error" && "Confirmation Failed"}
              </CardTitle>
              <CardDescription>{message}</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              {status === "success" && (
                <>
                  <p className="text-sm text-gray-600">Taking you to the Success Hub...</p>
                  <Link href="/hub">
                    <Button className="w-full bg-gradient-to-r from-[#7FB069] to-[#E26C73] hover:from-[#6FA055] hover:to-[#D55A60] text-white font-semibold">
                      Go to Hub Now
                    </Button>
                  </Link>
                </>
              )}
              {status === "error" && (
                <Link href="/auth/login">
                  <Button className="w-full bg-gradient-to-r from-[#7FB069] to-[#E26C73] hover:from-[#6FA055] hover:to-[#D55A60] text-white font-semibold">
                    Go to Login
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
