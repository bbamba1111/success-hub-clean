import { Suspense } from "react"
import { WorkQueue } from "@/components/boss/work-queue"

export default function Page() {
  return (
    <Suspense>
      <WorkQueue />
    </Suspense>
  )
}
