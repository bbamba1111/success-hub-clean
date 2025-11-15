import ChatShell from "@/components/chat-shell"
import { getExecutive } from "@/lib/executives-config"

export default function StagePresencePage() {
  const executive = getExecutive("stage-presence")!
  
  return (
    <div className="min-h-screen bg-background p-6">
      <ChatShell executive={executive} />
    </div>
  )
}
