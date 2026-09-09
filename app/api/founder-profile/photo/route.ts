import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Profile photos are small — cap generously to avoid abuse.
const MAX_BYTES = 8 * 1024 * 1024
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]

/**
 * Uploads the founder's Founder Profile™ photo to private Blob storage and
 * returns its pathname. The pathname (not a public URL) is what gets saved
 * to founder_profiles.photo_url — actual bytes are only ever served back
 * through GET below, to a signed-in owner.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "You must be signed in to upload a photo." }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Please upload a JPEG, PNG, WEBP, or HEIC photo." }, { status: 415 })
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Photo must be under 8MB." }, { status: 413 })
    }

    const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg"
    const pathname = `founder-profile/${user.id}/photo-${Date.now()}.${ext}`

    // Private store — the returned URL is not public; we serve via GET below.
    const blob = await put(pathname, file, {
      access: "private",
      contentType: file.type,
    })

    return NextResponse.json({ pathname: blob.pathname })
  } catch (error) {
    console.error("[v0] Founder Profile photo upload error:", error)
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 })
  }
}
