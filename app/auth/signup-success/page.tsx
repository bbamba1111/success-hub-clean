import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

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
              <CardTitle className="text-2xl text-[#7FB069]">Check Your Email!</CardTitle>
              <CardDescription>We've sent you a confirmation link</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-700 leading-relaxed">Thank you for joining Make Time For More Success Hub!</p>
              <p className="text-gray-700 leading-relaxed">
                Please check your email and click the confirmation link to activate your account.
              </p>
              <p className="text-sm text-gray-600 italic">
                Once confirmed, you can login and start your work-life balance journey.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
