export default function SundayShiftLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Blur overlay to cover the main navigation */}
      <div 
        className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-xl z-50"
        style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
      />
      <div className="pt-16">
        {children}
      </div>
    </>
  )
}
