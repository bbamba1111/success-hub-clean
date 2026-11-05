/**
 * Dry-run verification of the two Reality Check™ reminder stages.
 * Calls the real cron route with ?dryRun=1, so nothing is sent or written.
 *
 *   pnpm exec tsx --conditions=react-server --env-file=/vercel/share/.env.project scripts/test-reality-check-reminders.ts
 */
import { randomBytes } from "node:crypto"
import { readFileSync } from "node:fs"

process.env.CRON_SECRET = randomBytes(24).toString("hex")
if (!process.env.REALITY_CHECK_ZOOM_URL) {
  console.log("NOTE  REALITY_CHECK_ZOOM_URL not available here; using a fake stand-in link for rendering checks")
  process.env.REALITY_CHECK_ZOOM_URL = "https://us06web.zoom.us/j/00000000000?pwd=DRYRUN"
}
const auth = { authorization: `Bearer ${process.env.CRON_SECRET}` }
const base = "http://localhost/api/cron/reality-check-reminders"

type Case = { name: string; at: string; stage: string | null; sessionDate?: string }

const windowCases: Case[] = [
  // Daylight saving time (EDT, UTC-4)
  { name: "Sat 2:59 PM EDT, before window", at: "2026-04-11T18:59:00Z", stage: null },
  { name: "Sat 3:00 PM EDT", at: "2026-04-11T19:00:00Z", stage: "saturday", sessionDate: "2026-04-12" },
  { name: "Sat 11:59 PM EDT, catch-up", at: "2026-04-12T03:59:00Z", stage: "saturday", sessionDate: "2026-04-12" },
  { name: "Sun 12:59 PM EDT, before window", at: "2026-04-12T16:59:00Z", stage: null },
  { name: "Sun 1:00 PM EDT", at: "2026-04-12T17:00:00Z", stage: "sunday-1pm", sessionDate: "2026-04-12" },
  { name: "Sun 2:59 PM EDT, catch-up", at: "2026-04-12T18:59:00Z", stage: "sunday-1pm", sessionDate: "2026-04-12" },
  { name: "Sun 2:40 PM EDT, no third reminder", at: "2026-04-12T18:40:00Z", stage: "sunday-1pm", sessionDate: "2026-04-12" },
  { name: "Sun 3:00 PM EDT, session started", at: "2026-04-12T19:00:00Z", stage: null },
  // Standard time (EST, UTC-5)
  { name: "Sat 2:00 PM EST", at: "2026-12-05T19:00:00Z", stage: null },
  { name: "Sat 3:00 PM EST", at: "2026-12-05T20:00:00Z", stage: "saturday", sessionDate: "2026-12-06" },
  { name: "Sun 12:00 PM EST", at: "2026-12-06T17:00:00Z", stage: null },
  { name: "Sun 1:00 PM EST", at: "2026-12-06T18:00:00Z", stage: "sunday-1pm", sessionDate: "2026-12-06" },
  { name: "Sun 2:59 PM EST, catch-up", at: "2026-12-06T19:59:00Z", stage: "sunday-1pm", sessionDate: "2026-12-06" },
  // DST transition weekends
  { name: "Sun Mar 8 1:00 PM EDT (DST starts)", at: "2026-03-08T17:00:00Z", stage: "sunday-1pm", sessionDate: "2026-03-08" },
  { name: "Sat Oct 31 3:00 PM EDT", at: "2026-10-31T19:00:00Z", stage: "saturday", sessionDate: "2026-11-01" },
  { name: "Sun Nov 1 1:00 PM EST (DST ends)", at: "2026-11-01T18:00:00Z", stage: "sunday-1pm", sessionDate: "2026-11-01" },
  // Outside the weekend
  { name: "Mon 3:00 PM EDT", at: "2026-04-13T19:00:00Z", stage: null },
]

// Weekends to simulate every vercel.json cron entry against (Saturday dates, UTC).
const weekends = [
  { label: "EDT", saturday: "2026-04-11" },
  { label: "EST", saturday: "2026-12-05" },
  { label: "DST starts", saturday: "2026-03-07" },
  { label: "DST ends", saturday: "2026-10-31" },
]

async function main() {
  const { GET } = await import("../app/api/cron/reality-check-reminders/route")
  let failures = 0
  const check = (ok: boolean, label: string, detail = "") => {
    if (!ok) failures++
    console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? `  ${detail}` : ""}`)
  }
  const dry = async (at: string) => (await GET(new Request(`${base}?dryRun=1&at=${at}`, { headers: auth }))).json()

  console.log("--- Security ---")
  check((await GET(new Request(`${base}?dryRun=1`))).status === 401, "rejects missing secret")
  check(
    (await GET(new Request(`${base}?dryRun=1`, { headers: { authorization: "Bearer wrong" } }))).status === 401,
    "rejects wrong secret",
  )
  const live = await (await GET(new Request(`${base}?at=2026-04-11T19:00:00Z`, { headers: auth }))).json()
  check(live.dryRun === false && live.stage === undefined, "live mode ignores ?at (no time spoofing)")

  console.log("\n--- Hobby cron schedule ---")
  const crons: { path: string; schedule: string }[] = JSON.parse(readFileSync("vercel.json", "utf8")).crons
  for (const c of crons) {
    const [min, hour, dom, mon, dow] = c.schedule.split(" ")
    const daily = /^\d+$/.test(min) && /^\d+$/.test(hour) && dom === "*" && mon === "*" && /^\d$/.test(dow)
    check(daily && c.path === "/api/cron/reality-check-reminders", `at most once per day: "${c.schedule}"`)
  }

  console.log("\n--- Every cron entry at :00 and :59 of its hour (Hobby ±59 min) ---")
  for (const w of weekends) {
    const sat = new Date(`${w.saturday}T00:00:00Z`)
    const sun = new Date(sat.getTime() + 86_400_000).toISOString().slice(0, 10)
    const fires = new Map<string, number>()
    for (const c of crons) {
      const [, hour, , , dow] = c.schedule.split(" ")
      const day = dow === "6" ? w.saturday : sun
      for (const minute of ["00", "59"]) {
        const at = `${day}T${hour.padStart(2, "0")}:${minute}:00Z`
        const body = await dry(at)
        if (body.stage) {
          fires.set(body.stage, (fires.get(body.stage) ?? 0) + 1)
          if (body.sessionDate !== sun) check(false, `${w.label} ${at} wrong session`, body.sessionDate)
        }
      }
    }
    // Each stage must be reachable from at least two separate cron entries (primary + catch-up).
    const sat2 = (fires.get("saturday") ?? 0) >= 2
    const sun2 = (fires.get("sunday-1pm") ?? 0) >= 2
    check(sat2 && sun2 && fires.size === 2, `${w.label} weekend: both stages covered with catch-up`, JSON.stringify(Object.fromEntries(fires)))
  }

  console.log("\n--- Eastern-time windows ---")
  const subjects = new Set<string>()
  for (const c of windowCases) {
    const body = await dry(c.at)
    const stage = body.stage ?? null
    let ok = stage === c.stage
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
      detail += ` session=${body.sessionDate} eligible=${body.eligibleRecipients}`
    }
    check(ok, c.name, detail)
  }
  check(subjects.size === 2, "two distinct subject lines", Array.from(subjects).join(" | "))

  for (const [label, at] of [["Saturday", "2026-04-11T19:00:00Z"], ["Sunday", "2026-04-12T17:00:00Z"]]) {
    const sample = await dry(at)
    console.log(`\n--- ${label} reminder (Zoom link redacted) ---\nSubject: ${sample.email.subject}\nIdempotency: ${sample.email.idempotencyKey}\n${sample.email.textPreview}`)
  }
  console.log(`\n${failures === 0 ? "ALL PASSED" : `${failures} FAILED`}`)
  process.exit(failures === 0 ? 0 : 1)
}

main()
