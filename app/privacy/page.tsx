import Link from "next/link"

export const metadata = {
  title: "Privacy Policy | Harmony Lane",
  description: "How Startup & Thrive, LLC handles personal information for Harmony Lane and the Work-Life Balance Reality Check.",
}

const sections = [
  {
    title: "1. Who we are",
    body: "Harmony Lane™ and the Work-Life Balance Reality Check™ are offered by Startup & Thrive, LLC (referred to in this policy as we, us, or our). This policy explains how we collect, use, disclose, and protect personal information when you visit our website, register for the Reality Check, use related assessments, or become a member.",
  },
  {
    title: "2. Information we collect",
    body: "Depending on how you interact with us, we may collect contact and registration information such as your name, email address, and optional mobile number; information you choose to provide in founder profiles, business-context questions, work-life balance assessments, alignment questions, and boundary reports; membership and account information such as your email address, name, membership status, and account setup details; and transaction-related information made available to us by our payment provider. Payment card details are handled by Stripe rather than stored directly by this website. Our systems may also receive technical information such as IP address, browser/device details, and security or server logs when you use the site.",
  },
  {
    title: "3. How we use information",
    body: "We use information to register you for events and send event confirmations and Zoom details; provide assessment results, priority focus areas, and your My Boundary Report; create and administer accounts and memberships; process and confirm payments and membership status; respond to requests and provide service communications; maintain website functionality, prevent abuse, troubleshoot issues, and protect our services; and meet legal, accounting, and compliance obligations. We do not use your assessment responses to make employment, credit, insurance, or other eligibility decisions.",
  },
  {
    title: "4. Service providers and disclosures",
    body: "We use service providers to operate the service. These currently include Supabase for application data and account infrastructure, Stripe for payment processing, and Resend for transactional email delivery. These providers process information as needed to provide their services under their own terms and privacy practices. We may also disclose information when required by law, to protect rights and safety, or in connection with a business transfer. We do not sell personal information for money.",
  },
  {
    title: "5. Assessment and business information",
    body: "Your assessment answers and business-context information may be personal or commercially sensitive. Please provide only information you are comfortable sharing through the service. We use this information to generate and provide the requested assessment experience and related outputs. Do not submit passwords, payment-card details, or information about another person unless you have a lawful basis and permission to do so.",
  },
  {
    title: "6. Communications",
    body: "If you register for a free Reality Check, we use your email address to send registration and event-related messages, including your confirmation and Zoom information. If you become a member, we may send account, billing, membership, and service notices. These operational messages are not optional while you use the related service. We will send promotional email only where permitted by law and will provide an unsubscribe method when required.",
  },
  {
    title: "7. Cookies and similar technologies",
    body: "Our website and hosting infrastructure may use essential cookies or similar technologies needed for site operation, security, or account sessions. This policy does not make a promise that every browser or third-party technology behaves identically. You can manage cookies through your browser settings; disabling some cookies may affect site functionality.",
  },
  {
    title: "8. Retention and security",
    body: "We retain information for as long as reasonably necessary to provide the services, maintain business and accounting records, resolve disputes, enforce agreements, and meet legal obligations. Retention periods can vary by information type and purpose. We use administrative, technical, and organizational measures intended to protect information, but no method of transmission or storage is completely secure and we cannot guarantee absolute security.",
  },
  {
    title: "9. Your choices and privacy rights",
    body: "Depending on where you live, you may have rights to request access to, correction of, deletion of, or a copy of certain personal information, or to object to or restrict certain processing. You may also have the right to withdraw consent where processing is based on consent. We will verify requests and respond as required by applicable law. Some information may need to be retained for legal, security, transaction, or recordkeeping purposes.",
  },
  {
    title: "10. Children",
    body: "The services are intended for adults and are not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us personal information, contact us so we can review the matter.",
  },
  {
    title: "11. Third-party websites",
    body: "Our website or event communications may link to third-party services, including video meeting, payment, or social platforms. Their privacy practices are governed by their own policies, not this one. Review those policies before providing information to them.",
  },
  {
    title: "12. Changes to this policy",
    body: "We may update this policy as our services or legal obligations change. We will post the revised policy on this page and update the effective date. Where required, we will provide additional notice or obtain consent.",
  },
]

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FFF8F4] px-5 py-14 text-[#4A3A42] sm:py-20">
      <article className="mx-auto max-w-4xl">
        <Link href="/landing" className="font-poppins text-sm font-semibold text-[#5A7F46] underline underline-offset-4">← Back to Harmony Lane™</Link>
        <header className="mt-8 border-b border-[#EAD5DC] pb-8">
          <p className="font-poppins text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7F46]">Startup & Thrive, LLC</p>
          <h1 className="mt-3 font-playfair text-4xl font-bold sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 font-poppins text-sm text-[#806F77]">Effective date: November 21, 2026</p>
          <p className="mt-5 font-poppins text-base leading-relaxed text-[#5A4A52]">This policy applies to the Harmony Lane™ website, the Work-Life Balance Reality Check™, related assessments and reports, and membership services.</p>
        </header>
        <div className="mt-9 space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-playfair text-2xl font-bold">{section.title}</h2>
              <p className="mt-3 font-poppins text-base leading-8 text-[#5A4A52]">{section.body}</p>
            </section>
          ))}
          <section>
            <h2 className="font-playfair text-2xl font-bold">13. Contact us about privacy</h2>
            <p className="mt-3 font-poppins text-base leading-8 text-[#5A4A52]">For privacy questions or to submit a rights request, contact Startup & Thrive, LLC using the designated privacy contact address provided in your service or registration communications. We will publish a direct privacy contact address here once designated.</p>
          </section>
        </div>
        <p className="mt-12 border-t border-[#EAD5DC] pt-6 font-poppins text-sm leading-relaxed text-[#806F77]">This policy is a general description of our current practices, not legal advice. It should be reviewed and finalized with qualified counsel before being relied on as a legally complete privacy notice.</p>
      </article>
    </main>
  )
}
