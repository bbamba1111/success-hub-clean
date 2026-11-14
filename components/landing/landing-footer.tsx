import Link from "next/link"

export function LandingFooter() {
  return (
    <footer className="w-full border-t border-[#F2E4E8] bg-white py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <Link href="#top" className="flex items-center gap-2.5">
            <img
              src="/images/logo.png"
              alt="Harmony Lane"
              width={40}
              height={40}
              className="rounded-full shadow-sm"
            />
            <span className="font-playfair text-lg font-bold text-[#4A3A42]">Harmony Lane™</span>
          </Link>

          <p className="font-poppins mt-2 text-xs text-[#8A7A82]">
            © {new Date().getFullYear()} Harmony Lane™. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
