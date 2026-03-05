export default function SundayShiftLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      {/* Blur overlay to cover the main navigation */}
      <div 
        className="fixed top-0 left-0 right-0 h-16 bg-white backdrop-blur-xl z-[100]"
      />
      {/* Spacer to push content below the blur overlay */}
      <div className="h-16" />
      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
