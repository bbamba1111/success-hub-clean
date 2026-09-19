import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
import { get } from "@vercel/blob"
import { createClient } from "@/lib/supabase/server"

/**
 * Streams the signed-in founder's own Founder Profile™ photo from private
 * Blob storage. The path segment must fall under that founder's own
 * `founder-profile/<user.id>/...` prefix — this is what actually protects
 * the photo, since Blob access itself has no per-owner concept.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ pathname: string[] }> }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { pathname: segments } = await params
    const pathname = segments.join("/")

    if (!pathname.startsWith(`founder-profile/${user.id}/`)) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const ifNoneMatch = request.headers.get("if-none-match") ?? undefined
    const result = await get(pathname, { access: "private", ifNoneMatch })

    if (!result) {
      return new NextResponse("Not found", { status: 404 })
    }

    if (result.statusCode === 304) {
      return new NextResponse(null, {
        status: 304,
        headers: { ETag: result.blob.etag, "Cache-Control": "private, no-cache" },
      })
    }

    return new NextResponse(result.stream, {
      status: 200,
      headers: {
        "Content-Type": result.blob.contentType,
        ETag: result.blob.etag,
        "Cache-Control": "private, no-cache",
      },
    })
  } catch (error) {
    console.error("[v0] Founder Profile photo serve error:", error)
    return NextResponse.json({ error: "Failed to serve photo" }, { status: 500 })
  }
}
