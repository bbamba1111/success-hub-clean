import ChatShell from "@/components/chat-shell"
import { getExecutive } from "@/lib/executives-config"

export default function PageTurnerPage() {
  const executive = getExecutive("page-turner")!
  
  return (
    <div className="min-h-screen bg-background p-6">
      <ChatShell executive={executive} />
    </div>
  )
}
