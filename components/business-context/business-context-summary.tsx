"use client"

import { ChevronRight, Pencil } from "lucide-react"
import { labelFor, labelsFor, STAGE_OPTIONS, MODEL_OPTIONS, ROLE_OPTIONS, TEAM_OPTIONS, REVENUE_OPTIONS, GROWTH_OPTIONS, EXIT_OPTIONS, DELIVERY_MODEL_OPTIONS } from "@/lib/business-context/options"
import type { BusinessStageOption, BusinessModelOption, FounderRoleOption, TeamSizeOption, RevenueStagOption, GrowthVisionOption, ExitVisionOption, DeliveryModelOption } from "@/lib/business-context/types"

export interface BusinessContextSummaryData {
  businessName: string
  businessStage: BusinessStageOption | null
  businessModel: BusinessModelOption[]
  industry: string | null
  founderRole: FounderRoleOption | null
  teamSize: TeamSizeOption | null
  revenueStage: RevenueStagOption | null
  biggestGoalText: string
  successVision: string
  growthVision: GrowthVisionOption | null
  exitVision: ExitVisionOption | null
  offerStatement: string
  deliveryModel: DeliveryModelOption | null
  currentAiToolUse: string
  acquisitionChannel: string
}

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return <div><p className="mb-0.5 font-montserrat text-[11px] font-bold uppercase tracking-[0.14em] text-[#5B835F]">{label}</p><p className="font-montserrat text-sm leading-relaxed text-[#3A2E33]">{value}</p></div>
}
function Section({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return <section className="rounded-3xl border border-[#E8E0D5] bg-white px-6 py-6 shadow-sm sm:px-8">
    <div className="mb-4 flex items-center justify-between"><h3 className="font-playfair text-base font-semibold text-[#3A2E33]">{title}</h3>
      <button type="button" onClick={onEdit} className="inline-flex items-center gap-1.5 rounded-full border border-[#E8E0D5] bg-white px-3.5 py-1.5 font-montserrat text-xs font-semibold text-[#6B5860]"><Pencil className="h-3 w-3" aria-hidden />Edit</button></div>
    <div className="grid gap-3.5 sm:grid-cols-2">{children}</div>
  </section>
}

export function BusinessContextSummary({ data, onEditSection, onContinue, continueLabel = "Continue" }: {
  data: BusinessContextSummaryData
  onEditSection: (step: number) => void
  onContinue?: () => void
  continueLabel?: string
}) {
  return <div className="flex flex-col gap-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><span className="font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-[#5B835F]">Combined Business Context & Current Business™</span><p className="mt-1 font-playfair text-xl font-medium text-[#3A2E33]">Complete · 10 questions</p></div>
      <div className="flex items-center gap-2.5"><button type="button" onClick={() => onEditSection(100)} className="inline-flex items-center gap-1.5 rounded-full border border-[#E8E0D5] bg-white px-4 py-2.5 font-montserrat text-sm font-bold text-[#3A2E33]"><Pencil className="h-3.5 w-3.5" aria-hidden />Edit Full Profile</button>
      {onContinue && <button type="button" onClick={onContinue} className="inline-flex items-center gap-1.5 rounded-full bg-[#5B835F] px-5 py-2.5 font-montserrat text-sm font-bold text-white">{continueLabel}<ChevronRight className="h-3.5 w-3.5" aria-hidden /></button>}</div>
    </div>
    <Section title="1. Business Identity™" onEdit={() => onEditSection(100)}><Field label="Business name" value={data.businessName}/><Field label="Industry" value={data.industry ?? undefined}/><Field label="Primary product or service" value={data.offerStatement}/></Section>
    <Section title="2. Business Stage™" onEdit={() => onEditSection(101)}><Field label="Stage" value={labelFor(STAGE_OPTIONS,data.businessStage)}/></Section>
    <Section title="3. Founder Role & Team™" onEdit={() => onEditSection(102)}><Field label="Founder role" value={labelFor(ROLE_OPTIONS,data.founderRole)}/><Field label="People involved" value={labelFor(TEAM_OPTIONS,data.teamSize)}/></Section>
    <Section title="4. Revenue Model™" onEdit={() => onEditSection(103)}><Field label="Revenue streams" value={labelsFor(MODEL_OPTIONS,data.businessModel)}/><Field label="Approximate annual revenue" value={labelFor(REVENUE_OPTIONS,data.revenueStage)}/></Section>
    <Section title="5. Desired Life & Growth Vision™" onEdit={() => onEditSection(104)}><Field label="Life you want your business to support" value={data.successVision}/><Field label="Growth vision" value={labelFor(GROWTH_OPTIONS,data.growthVision)}/></Section>
    <Section title="6. Long-Term Exit Vision™" onEdit={() => onEditSection(105)}><Field label="Long-term vision" value={labelFor(EXIT_OPTIONS,data.exitVision)}/></Section>
    <Section title="7. Product & Service Delivery™" onEdit={() => onEditSection(106)}><Field label="Delivery model" value={labelFor(DELIVERY_MODEL_OPTIONS,data.deliveryModel)}/></Section>
    <Section title="8. AI Tools & Automation™" onEdit={() => onEditSection(107)}><Field label="Tools and what they help accomplish" value={data.currentAiToolUse}/></Section>
    <Section title="9. Client Connection Experiences™" onEdit={() => onEditSection(108)}><Field label="How prospects find and connect with you" value={data.acquisitionChannel}/></Section>
    <Section title="10. 90-Day Business Goal™" onEdit={() => onEditSection(109)}><Field label="Most important goal" value={data.biggestGoalText}/></Section>
  </div>
}
