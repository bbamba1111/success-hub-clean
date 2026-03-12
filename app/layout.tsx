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

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
})

const montserrat = Montserrat({
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
      <body className={`${greatVibes.variable} ${playfair.variable} ${poppins.variable} ${montserrat.variable}`}>
        <ConditionalNav />
        {children}
      </body>
    </html>
  )
}
