import Image from "next/image"
import Link from "next/link"

export default function SundayShiftLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      {/* Custom Sunday Shift Navigation - covers main nav */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-[100]">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/sunday-shift" className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-lg font-semibold text-gray-800">Make The Sunday Shift</span>
          </Link>
        </div>
      </div>
      {/* Spacer to push content below the nav */}
      <div className="h-16" />
      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
