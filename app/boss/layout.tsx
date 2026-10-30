import type { Metadata } from "next"
import type { ReactNode } from "react"
import { BossProvider } from "@/lib/boss/store"
import { BossAppShell } from "@/components/boss/app-shell"

export const metadata: Metadata = {
  title: "The BO$$ · Business Operating System",
  description:
    "The BO$$ helps founders build and operate successful businesses without sacrificing the life they built the business to enjoy.",
}

export default function BossLayout({ children }: { children: ReactNode }) {
  return (
    <BossProvider>
      <BossAppShell>{children}</BossAppShell>
    </BossProvider>
  )
}
