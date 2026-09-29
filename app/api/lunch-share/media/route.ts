import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
import { get } from "@vercel/blob"
import { createClient } from "@/lib/supabase/server"

/**
 * Streams a private Lunch Share media blob to authenticated members.
 * Forwards the client's Range header so browsers (especially Safari) can
 * seek within videos, and revalidates via ETag to enable browser caching.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const pathname = request.nextUrl.searchParams.get("pathname")
    if (!pathname) {
      return NextResponse.json({ error: "Missing pathname" }, { status: 400 })
    }

    const range = request.headers.get("range") ?? undefined
    const ifNoneMatch = request.headers.get("if-none-match") ?? undefined

    const result = await get(pathname, {
      access: "private",
      ifNoneMatch,
      headers: range ? { range } : undefined,
    })

    if (!result) {
      return new NextResponse("Not found", { status: 404 })
    }

    if (result.statusCode === 304) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: result.blob.etag,
          "Cache-Control": "private, no-cache",
        },
      })
    }

    const headers = new Headers({
      "Content-Type": result.blob.contentType,
      ETag: result.blob.etag,
      "Cache-Control": "private, no-cache",
      "Accept-Ranges": "bytes",
    })

    const contentRange = result.headers.get("content-range")
    const contentLength = result.headers.get("content-length")
    if (contentLength) headers.set("Content-Length", contentLength)

    let status = 200
    if (range && contentRange) {
      headers.set("Content-Range", contentRange)
      status = 206
    }

    return new NextResponse(result.stream, { status, headers })
  } catch (error) {
    console.error("[v0] Lunch Share media serve error:", error)
    return NextResponse.json({ error: "Failed to serve media" }, { status: 500 })
  }
}
