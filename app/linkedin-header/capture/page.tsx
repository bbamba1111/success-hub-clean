import { LinkedInHeader } from "@/components/linkedin/linkedin-header"

// Clean, chrome-free render of the banner at LinkedIn's exact 1584×396 pixels,
// used to export a static PNG. Freezes on a single phase image (no animation).
export default function LinkedInHeaderCapturePage() {
  return (
    <main className="bg-white">
      <div style={{ width: 1584, height: 396 }}>
        <LinkedInHeader capture captureIndex={0} />
      </div>
    </main>
  )
}
