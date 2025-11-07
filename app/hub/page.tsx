import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import HubPageClient from "@/components/hub-page-client"

export default async function HubPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/welcome")
  }

  return <HubPageClient user={user} />
}
