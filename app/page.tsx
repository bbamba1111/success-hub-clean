import { createClient } from "@/lib/supabase/server"
import { HubPageClient } from "@/components/hub-page-client"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Pass authentication status to client component
  return <HubPageClient isAuthenticated={!!user} />
}
