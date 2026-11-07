import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { DOCUMENT_TYPES } from "@/lib/business-profile/definitions"

const MAX_BYTES = 4 * 1024 * 1024
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/markdown",
]

/**
 * Stores a business document privately for later extraction. Uploading never
 * creates or approves business facts; extraction (a later phase) may only
 * propose drafts for founder review.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Please sign in to upload documents." }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get("file")
    const documentType = String(formData.get("documentType") ?? "")
    if (!(file instanceof File)) return NextResponse.json({ error: "Choose a file to upload." }, { status: 400 })
    if (!DOCUMENT_TYPES.some((t) => t.value === documentType)) {
      return NextResponse.json({ error: "Choose what kind of document this is." }, { status: 400 })
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Please upload a PDF, Word document, or text file." }, { status: 415 })
    }
    if (file.size > MAX_BYTES) return NextResponse.json({ error: "Documents must be under 4MB." }, { status: 413 })

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-120)
    const blob = await put(`business-profile/${user.id}/${Date.now()}-${safeName}`, file, {
      access: "private",
      contentType: file.type,
    })

    const { error } = await supabase.from("business_profile_documents").insert({
      user_id: user.id,
      file_name: file.name.slice(0, 200),
      document_type: documentType,
      blob_pathname: blob.pathname,
      content_type: file.type,
      size_bytes: file.size,
    })
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[v0] business profile document upload error:", error)
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 })
  }
}
