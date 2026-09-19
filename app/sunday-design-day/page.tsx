import { redirect } from "next/navigation"

/**
 * The Sunday Design Day™ experience now lives at /begin as one unified,
 * page-turning ritual (Phase 5.10). This route permanently redirects there so
 * there is a single canonical URL and no duplicate experience.
 */
export default function SundayDesignDayPage() {
  redirect("/begin")
}
