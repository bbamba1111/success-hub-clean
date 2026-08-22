import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const ACCOUNTS = [
  { email: "phase8-qa-founder-a@maketimeformore.com", password: "Phase8QaTestA!2026" },
  { email: "phase8-qa-founder-b@maketimeformore.com", password: "Phase8QaTestB!2026" },
]

for (const acct of ACCOUNTS) {
  const { data, error } = await supabase.auth.admin.createUser({
    email: acct.email,
    password: acct.password,
    email_confirm: true,
  })
  if (error) {
    console.error(`[qa] failed to create ${acct.email}:`, error.message)
    continue
  }
  console.log(`[qa] created ${acct.email} — id: ${data.user.id}`)

  // Give the account a paid membership tier in user_profiles so it isn't
  // blocked by the paywall check in lib/supabase/middleware.ts, mirroring
  // the Phase 7 QA pattern.
  const { error: updateError } = await supabase
    .from("user_profiles")
    .update({ membership_tier: "monthly" })
    .eq("id", data.user.id)
  if (updateError) {
    console.error(`[qa] failed to set membership for ${acct.email}:`, updateError.message)
  }
}
