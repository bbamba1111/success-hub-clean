import type { Metadata } from "next"
import { EventsClient } from "./events-client"

export const metadata: Metadata = {
  title: "Community Events™ | Harmony Lane",
  description:
    "Live Co-Working™, Monday Synchronization™, Founder Office Hours™, Founder Circle™, and more — every event in the Harmony Lane™ community calendar.",
}

export default function EventsPage() {
  return <EventsClient />
}
