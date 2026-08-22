import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const FOUNDER_A_ID = "a079b05b-d257-44eb-a4c5-b28ae3585ea5"

const { data: intentions, error: intentionsError } = await supabase
  .from("segment_intentions")
  .select("*, segment_declarations(*), segment_completions(*)")
  .eq("user_id", FOUNDER_A_ID)

if (intentionsError) console.error("[qa] intentions error:", intentionsError.message)
console.log(JSON.stringify(intentions, null, 2))
