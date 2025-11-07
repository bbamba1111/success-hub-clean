import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Mail } from "lucide-react"
import Link from "next/link"

export default function SignupSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-[#F5F1E8] to-white">
      <div className="w-full max-w-md">
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

          <Card className="border-2 border-[#7FB069]/20">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#7FB069] to-[#E26C73] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl text-[#7FB069]">Account Created Successfully!</CardTitle>
              <CardDescription>Welcome to Make Time For More Success Hub</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-center gap-2 text-blue-700">
                  <Mail className="w-5 h-5" />
                  <p className="font-semibold">Check Your Email & SPAM</p>
                </div>
                <p className="text-sm text-blue-600">
                  We've sent a confirmation link to your email. Please check your inbox and SPAM folder.
                </p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600 mb-4">Didn't receive the email? You can try logging in directly:</p>
                <Link href="/auth/login">
                  <Button className="w-full bg-gradient-to-r from-[#7FB069] to-[#E26C73] hover:from-[#6FA055] hover:to-[#D55A60] text-white font-semibold">
                    Go to Login
                  </Button>
                </Link>
              </div>

              <p className="text-xs text-gray-500 italic">If you continue to have issues, please contact support.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
