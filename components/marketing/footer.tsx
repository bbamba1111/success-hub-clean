import Link from "next/link"

const footerLinks = {
  main: [
    { label: "Home", href: "/" },
    { label: "The Sunday Shift", href: "#sunday-shift" },
    { label: "Mondays", href: "/mondays" },
    { label: "Experiences", href: "/experiences" },
    { label: "About Barbara", href: "/about" },
  ],
  resources: [
    { label: "Blog", href: "/blog" },
    { label: "Podcast", href: "/podcast" },
    { label: "Live Events", href: "/events" },
  ],
  legal: [
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-[#2F4F4F] text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-serif font-bold mb-4">
              Make Time For More<sup className="text-xs">™</sup>
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              A premium boutique Work-Life Balance installation for women entrepreneurs.
            </p>
          </div>

          {/* Main Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#F8C8C8] mb-4">
              Experience
            </h4>
            <ul className="space-y-3">
              {footerLinks.main.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#F8C8C8] mb-4">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#F8C8C8] mb-4">
              Connect
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} Make Time For More™. All rights reserved.
          </p>
          <p className="text-white/50 text-sm italic">
            Inside the Harmony Lane™, work is intentionally contained so life can expand.
          </p>
        </div>
      </div>
    </footer>
  )
}
