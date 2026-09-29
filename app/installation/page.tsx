import type { Metadata } from "next"
import { InstallationClient } from "./installation-client"

export const metadata: Metadata = {
  title: "Install Your Founder Operating System™ | Harmony Lane™",
  description:
    "A 5-minute guided setup that calibrates your entire Harmony Lane™ environment to your business, your goals, and the life you are building.",
}

export default function InstallationPage() {
  return <InstallationClient />
}
