import { redirect } from "next/navigation"

/**
 * The canonical assessments, reports, and business-building history now live
 * in My Work-Life Harmony Blueprint™.
 * Keep this legacy URL as a safe redirect for existing links.
 */
export default function HarmonyBlueprintPage() {
  redirect("/my-blueprint")
}
