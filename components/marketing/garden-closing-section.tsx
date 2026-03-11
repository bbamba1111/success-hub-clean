import { Button } from "@/components/ui/button"
import Link from "next/link"

export function GardenClosingSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#FAF7F2] to-[#F8C8C8]/20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-[#F8C8C8]/20 blur-3xl" />
      <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-[#7FB069]/10 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image placeholder */}
          <div 
            className="w-full h-96 rounded-2xl bg-gradient-to-br from-[#F8C8C8]/40 to-[#7FB069]/20 relative order-2 lg:order-1"
            style={{
              backgroundImage: "url('/images/cherry-garden-placeholder.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <p className="text-sm text-[#6B7280] mb-2">Image Placeholder</p>
                <p className="text-[#2F4F4F] font-medium">/images/cherry-garden-placeholder.jpg</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 order-1 lg:order-2">
            <p className="text-sm font-medium tracking-widest text-[#E26C73] uppercase">
              Your Sanctuary Awaits
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2F4F4F] leading-tight">
              Welcome to the Cherry Blossom Garden
            </h2>

            <div className="space-y-4 text-lg text-[#4A5568] leading-relaxed">
              <p>
                The Cherry Blossom Garden is our virtual studio where women gather to restore rhythm, reconnect with their original entrepreneurial intentions, and Make Time For More.
              </p>

              <p className="text-[#7FB069] italic">
                Cherry blossoms remind us that time is fleeting.
              </p>

              <p>
                Life is transient.
              </p>

              <p className="text-[#E26C73] font-medium">
                The moments that matter most are not meant to be postponed.
              </p>
            </div>

            <div className="pt-4">
              <Link href="#sunday-shift">
                <Button 
                  size="lg"
                  className="bg-[#E26C73] hover:bg-[#D15A61] text-white px-10 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  Enter The Cherry Blossom Garden
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
