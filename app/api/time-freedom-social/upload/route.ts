import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Photos up to 25MB, videos up to 250MB (≈2 minutes at reasonable quality).
const MAX_IMAGE_BYTES = 25 * 1024 * 1024
const MAX_VIDEO_BYTES = 250 * 1024 * 1024
const ALLOWED_IMAGE = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif"]
const ALLOWED_VIDEO = ["video/mp4", "video/quicktime", "video/webm"]

export async function POST(request: NextRequest) {
  try {
    // Only authenticated members may upload Time Freedom media.
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "You must be signed in to share." }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 })
    }

    const isImage = ALLOWED_IMAGE.includes(file.type)
    const isVideo = ALLOWED_VIDEO.includes(file.type)
    if (!isImage && !isVideo) {
      return NextResponse.json({ error: "Only photos and videos can be shared." }, { status: 415 })
    }

    const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: isVideo ? "Videos must be under 250MB." : "Photos must be under 25MB." },
        { status: 413 },
      )
    }

    const ext = file.name.includes(".") ? file.name.split(".").pop() : isVideo ? "mp4" : "jpg"
    const pathname = `time-freedom/${user.id}/${Date.now()}-${crypto.randomUUID()}.${ext}`

    // Private store — the returned URL is not public; we serve via /api/time-freedom-social/media.
    const blob = await put(pathname, file, {
      access: "private",
      contentType: file.type,
    })

    return NextResponse.json({
      pathname: blob.pathname,
      mediaType: isVideo ? "video" : "image",
      contentType: file.type,
    })
  } catch (error) {
    console.error("[v0] Time Freedom upload error:", error)
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 })
  }
}
