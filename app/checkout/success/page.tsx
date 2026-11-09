import { CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Payment Successful | Make Time For More",
}

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-5 bg-gradient-to-br from-[#F5F1E8] to-white">
      <div className="w-full max-w-xl">
        <Card className="border-2 border-[#7FB069]/20 shadow-xl">
          <CardHeader className="text-center pb-3">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-14 w-14 text-[#7FB069]" aria-hidden="true" />
            </div>
            <CardTitle className="text-2xl text-[#7FB069]">Payment Successful</CardTitle>
            <CardDescription className="text-base text-gray-600">
              Thank you for your purchase. We&apos;re setting up your account now — check your inbox in the next few
              minutes for an email with a link to create your password and get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-center text-gray-500">
              Didn&apos;t get the email? Check your spam folder, or contact support for help.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
