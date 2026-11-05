/**
 * Dry-run verification of the three Reality Check™ reminder stages.
 * Calls the real cron route with ?dryRun=1, so nothing is sent or written.
 *
 *   pnpm exec tsx --conditions=react-server --env-file=/vercel/share/.env.project scripts/test-reality-check-reminders.ts
 */
import { randomBytes } from "node:crypto"

process.env.CRON_SECRET = randomBytes(24).toString("hex")
if (!process.env.REALITY_CHECK_ZOOM_URL) {
  console.log("NOTE  REALITY_CHECK_ZOOM_URL not available here; using a fake stand-in link for rendering checks")
  process.env.REALITY_CHECK_ZOOM_URL = "https://us06web.zoom.us/j/00000000000?pwd=DRYRUN"
}
const auth = { authorization: `Bearer ${process.env.CRON_SECRET}` }

type Case = { name: string; at: string; stage: string | null; sessionDate?: string }

const cases: Case[] = [
  // Daylight saving time (EDT, UTC-4)
  { name: "Sat 2:59 PM EDT, before window", at: "2026-04-11T18:59:00Z", stage: null },
  { name: "Sat 3:00 PM EDT", at: "2026-04-11T19:00:00Z", stage: "saturday", sessionDate: "2026-04-12" },
  { name: "Sat 11:59 PM EDT, catch-up", at: "2026-04-12T03:59:00Z", stage: "saturday", sessionDate: "2026-04-12" },
  { name: "Sun 12:59 PM EDT, gap", at: "2026-04-12T16:59:00Z", stage: null },
  { name: "Sun 1:00 PM EDT", at: "2026-04-12T17:00:00Z", stage: "sunday-1pm", sessionDate: "2026-04-12" },
  { name: "Sun 2:39 PM EDT, catch-up", at: "2026-04-12T18:39:00Z", stage: "sunday-1pm", sessionDate: "2026-04-12" },
  { name: "Sun 2:40 PM EDT", at: "2026-04-12T18:40:00Z", stage: "sunday-final", sessionDate: "2026-04-12" },
  { name: "Sun 2:57 PM EDT, catch-up", at: "2026-04-12T18:57:00Z", stage: "sunday-final", sessionDate: "2026-04-12" },
  { name: "Sun 2:58 PM EDT, too late", at: "2026-04-12T18:58:00Z", stage: null },
  // Standard time (EST, UTC-5)
  { name: "Sat 2:00 PM EST (19:00Z)", at: "2026-12-05T19:00:00Z", stage: null },
  { name: "Sat 3:00 PM EST", at: "2026-12-05T20:00:00Z", stage: "saturday", sessionDate: "2026-12-06" },
  { name: "Sun 1:00 PM EST", at: "2026-12-06T18:00:00Z", stage: "sunday-1pm", sessionDate: "2026-12-06" },
  { name: "Sun 2:40 PM EST", at: "2026-12-06T19:40:00Z", stage: "sunday-final", sessionDate: "2026-12-06" },
  // DST transition weekends
  { name: "Sun Mar 8 2:40 PM EDT (DST starts)", at: "2026-03-08T18:40:00Z", stage: "sunday-final", sessionDate: "2026-03-08" },
  { name: "Sat Oct 31 3:00 PM EDT", at: "2026-10-31T19:00:00Z", stage: "saturday", sessionDate: "2026-11-01" },
  { name: "Sun Nov 1 1:40 PM EST (DST ends)", at: "2026-11-01T18:40:00Z", stage: "sunday-1pm", sessionDate: "2026-11-01" },
  { name: "Sun Nov 1 2:40 PM EST (DST ends)", at: "2026-11-01T19:40:00Z", stage: "sunday-final", sessionDate: "2026-11-01" },
  // Outside the weekend
  { name: "Mon 3:00 PM EDT", at: "2026-04-13T19:00:00Z", stage: null },
]

async function main() {
  const { GET } = await import("../app/api/cron/reality-check-reminders/route")
  const base = "http://localhost/api/cron/reality-check-reminders"
  let failures = 0
  const check = (ok: boolean, label: string, detail = "") => {
    if (!ok) failures++
    console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? `  ${detail}` : ""}`)
  }

  const noAuth = await GET(new Request(`${base}?dryRun=1`))
  check(noAuth.status === 401, "rejects missing secret")
  const badAuth = await GET(new Request(`${base}?dryRun=1`, { headers: { authorization: "Bearer wrong" } }))
  check(badAuth.status === 401, "rejects wrong secret")

  const live = await GET(new Request(`${base}?at=2026-04-11T19:00:00Z`, { headers: auth }))
  const liveBody = await live.json()
  check(liveBody.skipped === "Outside reminder window" && !liveBody.dryRun, "live mode ignores ?at (no time spoofing)")

  const subjects = new Set<string>()
  for (const c of cases) {
    const res = await GET(new Request(`${base}?dryRun=1&at=${c.at}`, { headers: auth }))
    const body = await res.json()
    const stage = body.stage ?? null
    let ok = res.status === 200 && stage === c.stage
    let detail = `stage=${stage}`
    if (ok && c.stage) {
      const e = body.email
      ok =
        body.sessionDate === c.sessionDate &&
        e.startTimeInEmail &&
        e.zoomLinkInHtml &&
        e.zoomLinkInText &&
        e.textPreview.includes(e.sessionDateLabel) &&
        !e.textPreview.includes("zoom.us/")
      subjects.add(e.subject)
      detail += ` session=${body.sessionDate} (${e.sessionDateLabel}) eligible=${body.eligibleRecipients} zoom=${e.zoomConfigured}`
    }
    check(ok, c.name, detail)
  }
  check(subjects.size === 3, "three distinct subject lines", [...subjects].join(" | "))

  const sample = await (await GET(new Request(`${base}?dryRun=1&at=2026-04-12T18:40:00Z`, { headers: auth }))).json()
  console.log("\n--- Final reminder text (Zoom link redacted) ---\n" + sample.email.textPreview)
  console.log(`\n${failures === 0 ? "ALL PASSED" : `${failures} FAILED`}`)
  process.exit(failures === 0 ? 0 : 1)
}

main()
