import type React from "react"
import type { Metadata } from "next"
import { Great_Vibes, Playfair_Display, Poppins, Montserrat } from 'next/font/google'
import "./globals.css"
import { ConditionalNav } from "@/components/conditional-nav"

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
})

// Playfair Display — reserved for hero + major page titles only.
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
})

// Montserrat — the workhorse UI font: nav, cards, buttons, body, metrics.
const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-montserrat",
})

export const metadata: Metadata = {
  title: "Success Hub - Make Time For More",
  description: "Your work-life balance success hub",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${greatVibes.variable} ${playfair.variable} ${poppins.variable} ${montserrat.variable} font-montserrat`}>
        <ConditionalNav />
        {children}
      </body>
    </html>
  )
}
