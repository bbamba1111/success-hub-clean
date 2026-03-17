import Link from "next/link"

export default function CherryBlossomIntentionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1E8] to-white">
      {/* Minimal header for restricted funnel - no main app navigation */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/sunday-shift" className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Make Time For More Logo"
                width={40}
                height={40}
                className="rounded-full shadow-md"
              />
              <span className="text-lg font-semibold text-gray-800">
                Make Time For More
              </span>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main>
        {children}
      </main>
      
      {/* Simple footer for free funnel */}
      <footer className="bg-gray-50 border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm">
            Make Time For More | Cherry Blossom Intentions
          </p>
        </div>
      </footer>
    </div>
  )
}
