import { LinkedInHeader } from "@/components/linkedin/linkedin-header"

// Clean, chrome-free render of the banner at LinkedIn's exact 1584×396 pixels,
// with the crossfade animation running — used to record a motion (WebM) export.
export default function LinkedInHeaderMotionCapturePage() {
  return (
    <main className="bg-white">
      <div style={{ width: 1584, height: 396 }}>
        <LinkedInHeader chromeless />
      </div>
    </main>
  )
}
