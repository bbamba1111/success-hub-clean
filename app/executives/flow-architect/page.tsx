import ChatShell from "@/components/chat-shell"
import { getExecutive } from "@/lib/executives-config"

export default function FlowArchitectPage() {
  const executive = getExecutive("flow-architect")!
  
  return (
    <div className="min-h-screen bg-background p-6">
      <ChatShell executive={executive} />
    </div>
  )
}
