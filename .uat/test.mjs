import { createClient } from "@supabase/supabase-js"
import { head } from "@vercel/blob"
import { readFileSync } from "node:fs"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const { getApprovedBusinessFacts, proposeBusinessFactChange } = require("./build/server.js")
const accounts = JSON.parse(readFileSync(new URL("./accounts.json", import.meta.url)))
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const results = []
const check = (name, pass, detail = "") => results.push(`${pass ? "PASS" : "FAIL"} ${name}${detail ? ` (${detail})` : ""}`)

async function signIn(who) {
  const c = createClient(url, anon, { auth: { persistSession: false } })
  const { error } = await c.auth.signInWithPassword({ email: accounts.users[who].email, password: accounts.password })
  if (error) throw error
  return c
}
const a = await signIn("a")
const b = await signIn("b")
const aId = accounts.users.a.id

const { data: aFacts } = await a.from("business_profile_facts").select("id,label,approval_status").eq("user_id", aId)
const location = aFacts.find((f) => f.label === "Retreat location")

const { data: retiredSeed } = await a
  .from("business_profile_facts")
  .insert({ user_id: aId, category_key: "fees", label: "Old workshop fee", value: "$900" })
  .select("id")
  .single()
await a.from("business_profile_facts").update({ approval_status: "approved", approved_label: "Old workshop fee", approved_value: "$900", last_change_actor: "founder", last_change_action: "approved" }).eq("id", retiredSeed.id)
await a.from("business_profile_facts").update({ approval_status: "retired", last_change_actor: "founder", last_change_action: "retired" }).eq("id", retiredSeed.id)

await proposeBusinessFactChange(a, aId, { actor: "cherry_blossom", categoryKey: "fees", label: "Keynote fee", value: "$12,000", note: "Heard in conversation" })

const { data: forged, error: forgeErr } = await a
  .from("business_profile_facts")
  .update({ approval_status: "approved", approved_label: "Keynote fee", approved_value: "$12,000", last_change_actor: "cherry_blossom" })
  .eq("user_id", aId)
  .eq("label", "Keynote fee")
  .select("id")
check("Cherry proposal cannot approve itself", !!forgeErr && !forged, forgeErr?.message)

const approved = await getApprovedBusinessFacts(a, aId)
const labels = approved.map((f) => `${f.label}=${f.value}`)
check("getApprovedBusinessFacts returns only the approved record", approved.length === 1 && labels[0] === "Spring retreat price=$4,800 per person, includes lodging", labels.join(" | "))
check("draft (Retreat location) excluded", !labels.some((l) => l.startsWith("Retreat location")))
check("retired fact excluded", !labels.some((l) => l.startsWith("Old workshop fee")))
check("Cherry proposal (draft) excluded", !labels.some((l) => l.startsWith("Keynote fee")))
check("custom category label resolved", approved[0]?.categoryLabel === "UAT Retreats", approved[0]?.categoryLabel)
const filtered = await getApprovedBusinessFacts(a, aId, { categoryKeys: ["fees"] })
check("category filter honoured", filtered.length === 0)

const { data: springRow } = await a.from("business_profile_facts").select("id").eq("user_id", aId).eq("label", "Spring retreat price").single()
await a.from("business_profile_facts").update({ value: "$9,999", last_change_actor: "founder", last_change_action: "edited" }).eq("id", springRow.id)
const duringReview = await getApprovedBusinessFacts(a, aId)
check("needs-review fact excluded", duringReview.length === 0, `${duringReview.length} returned`)
await a.from("business_profile_facts").update({ label: "Spring retreat price", value: "$4,800 per person, includes lodging", approval_status: "approved", last_change_actor: "founder", last_change_action: "rejected" }).eq("id", springRow.id)

const { data: hist } = await a.from("business_profile_fact_history").select("action,actor,new_status").eq("fact_id", springRow.id).order("created_at")
check("history recorded every step", hist.length >= 6, hist.map((h) => `${h.action}/${h.actor}->${h.new_status}`).join(", "))

for (const t of ["business_profile_facts", "business_profile_categories", "business_profile_documents", "business_profile_fact_history"]) {
  const { data } = await b.from(t).select("id").eq("user_id", aId)
  check(`Member B cannot read A's ${t}`, (data ?? []).length === 0, `${(data ?? []).length} rows`)
}
const { data: bUpd } = await b.from("business_profile_facts").update({ value: "hijack" }).eq("id", location.id).select("id")
check("Member B cannot edit A's fact", (bUpd ?? []).length === 0)
const { error: bIns } = await b.from("business_profile_facts").insert({ user_id: aId, category_key: "fees", label: "x", value: "y" })
check("Member B cannot insert into A's profile", !!bIns, bIns?.message)
const bApproved = await getApprovedBusinessFacts(b, aId)
check("getApprovedBusinessFacts as B for A's id returns nothing", bApproved.length === 0)

const admin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const { data: doc } = await admin.from("business_profile_documents").select("blob_pathname,extraction_status").eq("user_id", aId).single()
check("document saved as awaiting extraction", doc.extraction_status === "awaiting_extraction")
check("blob stored under A's own folder", doc.blob_pathname.includes(aId), doc.blob_pathname)
const meta = await head(doc.blob_pathname, { token: process.env.BLOB_READ_WRITE_TOKEN })
check("blob is in the private store", meta.url.includes(".private.blob."), new URL(meta.url).host)
const anonFetch = await fetch(meta.url)
check("blob URL refuses unauthenticated download", anonFetch.status === 403 || anonFetch.status === 401, `HTTP ${anonFetch.status}`)
const { count: docFacts } = await admin.from("business_profile_facts").select("id", { count: "exact", head: true }).eq("user_id", aId).eq("source_type", "document")
check("upload created no facts", docFacts === 0)

console.log(results.join("\n"))
