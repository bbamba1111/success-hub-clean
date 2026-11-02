import { createClient } from "@supabase/supabase-js"
import { writeFileSync } from "node:fs"

const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})
const password = "UatTest!" + Math.random().toString(36).slice(2, 10)
const out = { password, users: {} }
for (const who of ["a", "b"]) {
  const email = `v0-uat-bp-${who}-${Date.now()}@example.com`
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true })
  if (error) throw error
  const id = data.user.id
  const { error: pErr } = await admin.from("user_profiles").upsert({ id, email, membership_tier: "premium_member" })
  if (pErr) console.log("profile upsert error", who, pErr.message)
  out.users[who] = { id, email }
}
writeFileSync(new URL("./accounts.json", import.meta.url), JSON.stringify(out))
console.log("created", out.users.a.email, out.users.b.email)
