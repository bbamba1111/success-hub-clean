import ChatShell from "@/components/chat-shell"
import { getExecutive } from "@/lib/executives-config"

export default function VisualNarratorPage() {
  const executive = getExecutive("visual-narrator")!
  
  return (
    <div className="min-h-screen bg-background p-6">
      <ChatShell executive={executive} />
    </div>
  )
}
