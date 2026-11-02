import { createClient } from "@supabase/supabase-js"
import { del } from "@vercel/blob"
import { readFileSync } from "node:fs"

const accounts = JSON.parse(readFileSync(new URL("./accounts.json", import.meta.url)))
const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const ids = Object.values(accounts.users).map((u) => u.id)

const { data: docs } = await admin.from("business_profile_documents").select("blob_pathname").in("user_id", ids)
for (const d of docs ?? []) await del(d.blob_pathname, { token: process.env.BLOB_READ_WRITE_TOKEN })
await admin.from("user_profiles").delete().in("id", ids)
for (const id of ids) {
  const { error } = await admin.auth.admin.deleteUser(id)
  if (error) console.log("delete user error", id, error.message)
}
const left = {}
for (const t of ["business_profile_facts", "business_profile_categories", "business_profile_documents", "business_profile_fact_history", "user_profiles"]) {
  const col = t === "user_profiles" ? "id" : "user_id"
  const { count } = await admin.from(t).select("*", { count: "exact", head: true }).in(col, ids)
  left[t] = count
}
console.log("blobs deleted:", (docs ?? []).length, "remaining rows:", JSON.stringify(left))
