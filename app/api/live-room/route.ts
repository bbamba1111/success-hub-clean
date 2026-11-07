import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

/**
 * Signed-in members' "Join Us Live™" buttons point here so the Zoom room URL
 * never ships in client bundles or the public repo. The room is read from a
 * server env var and only revealed to an authenticated session.
 */
function liveRoomUrl(): string | null {
  const raw = (process.env.MEMBER_LIVE_ROOM_URL || process.env.REALITY_CHECK_ZOOM_URL)?.trim()
  if (!raw) return null
  try {
    const url = new URL(raw)
    return url.protocol === "https:" && url.hostname.endsWith("zoom.us") ? url.toString() : null
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const login = new URL("/auth/login", request.url)
    login.searchParams.set("redirect", "/api/live-room")
    return NextResponse.redirect(login)
  }

  const destination = liveRoomUrl()
  if (!destination) {
    return new NextResponse("The live room link is not configured yet.", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    })
  }

  const response = NextResponse.redirect(destination)
  response.headers.set("Cache-Control", "no-store")
  response.headers.set("Referrer-Policy", "no-referrer")
  return response
}
