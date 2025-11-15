import ChatShell from "@/components/chat-shell"
import { getExecutive } from "@/lib/executives-config"

export default function BrandBeaconPage() {
  const executive = getExecutive("brand-beacon")!
  
  return (
    <div className="min-h-screen bg-background p-6">
      <ChatShell executive={executive} />
    </div>
  )
}
