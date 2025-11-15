import type React from "react"
import type { Metadata } from "next"
import { Great_Vibes } from 'next/font/google'
import "./globals.css"
import { TopNavigation } from "@/components/top-navigation"

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
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
      <body className={greatVibes.variable}>
        <TopNavigation />
        {children}
      </body>
    </html>
  )
}
