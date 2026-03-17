import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, Mail } from "lucide-react"

export default function GardenConfirmationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] to-[#F8C8C8]/20 flex items-center justify-center px-6">
      <div className="max-w-lg mx-auto text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-[#7FB069]/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-10 h-10 text-[#7FB069]" />
        </div>

        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#2F4F4F] mb-4">
          Welcome to the Cherry Blossom Garden
        </h1>

        <p className="text-lg text-[#4A5568] mb-6">
          Your seat for The Sunday Shift™ has been reserved.
        </p>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#F8C8C8]/30 mb-8">
          <div className="flex items-center justify-center gap-3 text-[#E26C73] mb-4">
            <Mail className="w-5 h-5" />
            <span className="font-semibold">Check Your Email</span>
          </div>
          <p className="text-[#4A5568]">
            We've sent you access details for The Sunday Shift. Check your inbox for your confirmation and next steps.
          </p>
        </div>

        <p className="text-[#6B7280] text-sm italic mb-8">
          Cherry blossoms remind us that time is fleeting. The moments that matter most are not meant to be postponed.
        </p>

        <Link href="/">
          <Button 
            variant="outline"
            className="border-2 border-[#7FB069] text-[#7FB069] hover:bg-[#7FB069] hover:text-white px-8 py-6 text-lg font-semibold rounded-full transition-all"
          >
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}

