import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * SECURITY: This route intentionally no longer contains a self-service
 * "create an account" form. Every account is created exclusively through
 * the token-gated /welcome flow after a verified SamCart purchase (see
 * app/api/auth/send-confirmation/route.ts) — a public form here would
 * either be rejected by that API for lacking a purchase token, or worse,
 * give visitors the impression they can access the product without paying.
 *
 * Anyone who lands on this URL (old bookmark, old link, etc.) is routed to
 * checkout or login instead.
 */
export const metadata = {
  title: "Get Started | Make Time For More",
}

export default function SignupPage() {
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
              <CardTitle className="text-2xl text-[#7FB069]">Let&apos;s Get You Started</CardTitle>
              <CardDescription>
                Accounts are created automatically after your purchase — there&apos;s no separate sign-up form.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-[#7FB069] to-[#E26C73] hover:from-[#6FA055] hover:to-[#D55A60] text-white font-semibold"
              >
                <Link href="/monday">Go to Checkout</Link>
              </Button>
              <p className="text-xs text-center text-gray-500">
                Already purchased and just need to log in?{" "}
                <Link href="/auth/login" className="text-[#7FB069] hover:text-[#6FA055] hover:underline font-medium">
                  Log in here
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
