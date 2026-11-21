import Link from "next/link"

export const metadata = {
  title: "Terms of Service | Harmony Lane",
  description: "Terms governing use of Harmony Lane, the Work-Life Balance Reality Check, and related membership services.",
}

const sections = [
  {
    title: "1. Agreement and eligibility",
    body: "These Terms of Service govern your access to and use of the Harmony Lane™ website, the Work-Life Balance Reality Check™, related assessments and reports, and membership services offered by Startup & Thrive, LLC (referred to in these Terms as we, us, or our). By accessing or using the services, you agree to these Terms. The services are intended for adults aged 18 or older.",
  },
  {
    title: "2. The free Reality Check",
    body: "The Work-Life Balance Reality Check is offered as a free introductory experience. Registration may require you to provide contact information and answer questions about your personal priorities and business. The Reality Check is not a paid membership, does not automatically enroll you in a membership, and does not obligate you to make a purchase.",
  },
  {
    title: "3. Harmony Lane Basic Membership",
    body: "Harmony Lane Basic Membership is a recurring Work-Life Balance Co-Working experience. The current published founding-member offer is $1,997 per month for eligible enrollments completed by December 31, 2026. The founding rate is retained while the membership remains continuously active, as described in the offer. The membership includes the experience and features described on the applicable membership or pricing page at the time of enrollment. We may update service features, schedules, or delivery methods as reasonably necessary; material changes will be communicated where required by law.",
  },
  {
    title: "4. Billing, renewal, and cancellation",
    body: "Membership is a recurring paid subscription. The amount, billing interval, renewal terms, and payment details are presented in Stripe checkout before you complete enrollment. By subscribing, you authorize the applicable recurring charges to your selected payment method until the subscription is canceled. You are responsible for keeping payment information current. You may cancel using the cancellation method made available for your subscription or by contacting us through the service communications associated with your account. Cancellation stops future renewals; access generally continues through the paid billing period unless the checkout terms or applicable law require otherwise. Membership fees are non-refundable except where required by law or expressly stated otherwise. If a payment fails, we may suspend or restrict access until the issue is resolved.",
  },
  {
    title: "5. Your account and responsibilities",
    body: "You agree to provide accurate registration and account information, keep your login credentials confidential, and promptly notify us of suspected unauthorized access. You are responsible for activity under your account. You may not misuse the services, interfere with their operation, attempt unauthorized access, or use the services in violation of applicable law.",
  },
  {
    title: "6. Community participation",
    body: "Harmony Lane is intended to provide a constructive, respectful environment. You agree to treat other participants respectfully and not to harass, threaten, impersonate, exploit, or unlawfully disclose another participant's information. We may remove content, restrict participation, or suspend or terminate access when we reasonably believe these Terms or community standards have been violated, or when necessary to protect participants or the services.",
  },
  {
    title: "7. Your content and our intellectual property",
    body: "You retain ownership of the information and materials you submit, subject to the permissions needed for us and our service providers to operate the services and provide your requested outputs. You grant us a limited, non-exclusive permission to host, process, display, and use submitted content for those purposes. The Harmony Lane and Make Time For More names, marks, materials, frameworks, written content, designs, and other service materials are owned by or licensed to Startup & Thrive, LLC and are protected by applicable intellectual-property laws. You may use them only as permitted by us in writing or by law. You may not copy, distribute, sell, modify, or create derivative commercial products from our materials without prior written permission.",
  },
  {
    title: "8. Educational and informational nature",
    body: "The Reality Check, assessments, reports, co-working experience, and related materials are for general educational, reflective, and informational purposes. They are not medical, mental-health, legal, tax, accounting, financial, cybersecurity, or other professional advice, and they do not create a professional-client relationship. You are responsible for your own business, technology, security, and personal decisions. Consult qualified professionals for advice specific to your circumstances.",
  },
  {
    title: "9. Third-party services",
    body: "Some service features rely on third parties, including payment, hosting, database, email, and video-meeting providers. Your use of those third-party services may be subject to their own terms and privacy policies. We are not responsible for third-party services that we do not control.",
  },
  {
    title: "10. Availability and changes",
    body: "We aim to provide reliable access but do not guarantee that the website or services will always be available, uninterrupted, error-free, or compatible with every device. We may maintain, update, suspend, or discontinue parts of the services. Nothing in these Terms limits rights that cannot legally be limited.",
  },
  {
    title: "11. Disclaimers and limitation of liability",
    body: "To the maximum extent permitted by applicable law, the services are provided on an as-is and as-available basis, without warranties of any kind, whether express or implied. To the maximum extent permitted by law, Startup & Thrive, LLC will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for loss of profits, revenue, data, goodwill, or business opportunity arising from or related to your use of the services. To the maximum extent permitted by law, our total liability for claims relating to the services will not exceed the amount you paid us for the service giving rise to the claim during the three months before the event giving rise to the claim. These limitations do not apply where prohibited by law.",
  },
  {
    title: "12. Indemnification",
    body: "To the extent permitted by applicable law, you agree to be responsible for claims, losses, liabilities, and expenses arising from your misuse of the services, your violation of these Terms, or your infringement of another person's rights. This section does not require you to indemnify us for our own conduct where prohibited by law.",
  },
  {
    title: "13. Suspension and termination",
    body: "You may stop using the free services at any time. Paid membership cancellation is addressed in Section 4. We may suspend or terminate access for a material breach of these Terms, unlawful activity, security risks, nonpayment, or conduct that threatens the services or other participants. Provisions that by their nature should survive termination will continue to apply.",
  },
  {
    title: "14. Changes to these Terms",
    body: "We may update these Terms from time to time. We will post the revised Terms on this page and update the effective date. Where required by law, we will provide additional notice or obtain your consent. Continued use after updated Terms take effect constitutes acceptance to the extent permitted by law.",
  },
]

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-[#FFF8F4] px-5 py-14 text-[#4A3A42] sm:py-20">
      <article className="mx-auto max-w-4xl">
        <Link href="/landing" className="font-poppins text-sm font-semibold text-[#5A7F46] underline underline-offset-4">← Back to Harmony Lane™</Link>
        <header className="mt-8 border-b border-[#EAD5DC] pb-8">
          <p className="font-poppins text-sm font-semibold uppercase tracking-[0.2em] text-[#5A7F46]">Startup & Thrive, LLC</p>
          <h1 className="mt-3 font-playfair text-4xl font-bold sm:text-5xl">Terms of Service</h1>
          <p className="mt-4 font-poppins text-sm text-[#806F77]">Effective date: November 21, 2026</p>
          <p className="mt-5 font-poppins text-base leading-relaxed text-[#5A4A52]">Please read these Terms before using Harmony Lane™, registering for the Work-Life Balance Reality Check™, or purchasing a membership.</p>
        </header>
        <div className="mt-9 space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-playfair text-2xl font-bold">{section.title}</h2>
              <p className="mt-3 font-poppins text-base leading-8 text-[#5A4A52]">{section.body}</p>
            </section>
          ))}
          <section>
            <h2 className="font-playfair text-2xl font-bold">15. Contact</h2>
            <p className="mt-3 font-poppins text-base leading-8 text-[#5A4A52]">For questions about these Terms, contact Startup & Thrive, LLC using the designated contact address provided in your service or registration communications.</p>
          </section>
        </div>
        <p className="mt-12 border-t border-[#EAD5DC] pt-6 font-poppins text-sm leading-relaxed text-[#806F77]">These Terms are a working legal notice and are not a substitute for advice from qualified counsel. Please have them reviewed for the laws that apply to your business and customers before relying on them as final legal terms.</p>
      </article>
    </main>
  )
}
