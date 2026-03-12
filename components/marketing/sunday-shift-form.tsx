"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export function SundayShiftForm() {
  const [firstName, setFirstName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission - connect to email service later
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Redirect to garden confirmation page
    router.push("/garden")
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
      <div className="bg-white rounded-3xl p-10 shadow-2xl border border-[#F8C8C8]/30">
        <h4 className="font-playfair text-2xl font-bold text-[#2F4F4F] text-center mb-3">
          Reserve Your Seat
        </h4>
        <p className="font-poppins text-lg text-[#6B7280] text-center mb-8">
          Join us in the Cherry Blossom Garden
        </p>

        <div className="space-y-5">
          <div>
            <label htmlFor="firstName" className="block font-poppins text-base font-medium text-[#4A5568] mb-2">
              First Name
            </label>
            <Input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder="Your first name"
              className="w-full border-[#F8C8C8]/50 focus:border-[#E26C73] focus:ring-[#E26C73]/20 rounded-xl py-6 text-lg font-poppins"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-poppins text-base font-medium text-[#4A5568] mb-2">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full border-[#F8C8C8]/50 focus:border-[#E26C73] focus:ring-[#E26C73]/20 rounded-xl py-6 text-lg font-poppins"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#E26C73] hover:bg-[#D15A61] text-white py-7 text-xl font-poppins font-semibold rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Reserving..." : "Enter the Cherry Blossom Garden"}
          </Button>
        </div>

        <p className="font-poppins text-base text-[#6B7280] text-center mt-6 italic">
          Free weekly ritual • Sundays • Live inside the Cherry Blossom Garden
        </p>
      </div>
    </form>
  )
}
