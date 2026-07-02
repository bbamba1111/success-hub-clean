"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Heart, ImagePlus, Loader2, MessageCircle, Send, Video, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const POST_TYPE = "time_freedom"
const MAX_IMAGE_BYTES = 10 * 1024 * 1024 // 10MB
const MAX_VIDEO_BYTES = 100 * 1024 * 1024 // 100MB
const MAX_VIDEO_SECONDS = 60

interface SocialPost {
  id: string
  user_id: string
  content: string
  media_pathname: string | null
  media_type: "image" | "video" | null
  media_content_type: string | null
  media_duration: number | null
  likes_count: number
  comments_count: number
  created_at: string
  author_name?: string
  liked_by_me?: boolean
}

interface SocialComment {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  author_name?: string
}

function displayName(name: string | null | undefined): string {
  return name?.trim() || "Community Member"
}

/** Resolves author display names by user id via a single profiles lookup. */
async function fetchNames(
  supabase: ReturnType<typeof createClient>,
  userIds: string[],
): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  const unique = Array.from(new Set(userIds)).filter(Boolean)
  if (unique.length === 0) return map
  const { data } = await supabase.from("user_profiles").select("id, name").in("id", unique)
  for (const row of data ?? []) {
    map.set(row.id as string, (row.name as string) ?? "")
  }
  return map
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

function mediaSrc(pathname: string): string {
  return `/api/time-freedom-social/media?pathname=${encodeURIComponent(pathname)}`
}

/**
 * Reads a video file's duration in the browser so we can reject clips longer
 * than 60 seconds before uploading anything.
 */
function readVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const video = document.createElement("video")
    video.preload = "metadata"
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url)
      resolve(video.duration)
    }
    video.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Could not read video"))
    }
    video.src = url
  })
}

export function TimeFreedomSocial({ active }: { active: boolean }) {
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)
  if (!supabaseRef.current) supabaseRef.current = createClient()
  const supabase = supabaseRef.current

  const [userId, setUserId] = useState<string | null>(null)
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [initialized, setInitialized] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const loadPosts = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setUserId(user?.id ?? null)

    const { data, error } = await supabase
      .from("community_posts")
      .select(
        "id, user_id, content, media_pathname, media_type, media_content_type, media_duration, likes_count, comments_count, created_at",
      )
      .eq("post_type", POST_TYPE)
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      console.log("[v0] loadPosts error:", error.message)
      setLoading(false)
      return
    }

    const rows = data ?? []

    // Author names and the current user's likes are fetched separately so we
    // don't depend on a PostgREST foreign-key embed (user_id -> auth.users).
    const nameById = await fetchNames(
      supabase,
      rows.map((p) => p.user_id),
    )

    let likedIds = new Set<string>()
    if (user && rows.length > 0) {
      const { data: likes } = await supabase
        .from("community_post_likes")
        .select("post_id")
        .eq("user_id", user.id)
        .in(
          "post_id",
          rows.map((p) => p.id),
        )
      likedIds = new Set((likes ?? []).map((l) => l.post_id))
    }

    setPosts(
      rows.map((p) => ({
        ...p,
        author_name: nameById.get(p.user_id),
        liked_by_me: likedIds.has(p.id),
      })) as SocialPost[],
    )
    setLoading(false)
  }, [supabase])

  // Lazy first load once the section is opened.
  useEffect(() => {
    if (active && !initialized) {
      setInitialized(true)
      void loadPosts()
    }
  }, [active, initialized, loadPosts])

  // Realtime: new/updated/deleted Time Freedom posts appear live.
  useEffect(() => {
    if (!initialized) return
    const channel = supabase
      .channel("time-freedom-social")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "community_posts", filter: `post_type=eq.${POST_TYPE}` },
        () => {
          void loadPosts()
        },
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [initialized, supabase, loadPosts])

  const clearFile = useCallback(() => {
    setFile(null)
    setUploadError(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [previewUrl])

  const onSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    setUploadError(null)

    const isImage = selected.type.startsWith("image/")
    const isVideo = selected.type.startsWith("video/")

    if (!isImage && !isVideo) {
      setUploadError("Please choose a photo or video.")
      return
    }
    if (isImage && selected.size > MAX_IMAGE_BYTES) {
      setUploadError("Photos must be 10MB or smaller.")
      return
    }
    if (isVideo && selected.size > MAX_VIDEO_BYTES) {
      setUploadError("Videos must be 100MB or smaller.")
      return
    }
    if (isVideo) {
      try {
        const duration = await readVideoDuration(selected)
        if (duration > MAX_VIDEO_SECONDS + 0.5) {
          setUploadError(`Videos must be ${MAX_VIDEO_SECONDS} seconds or less.`)
          return
        }
      } catch {
        setUploadError("Could not read that video. Try another file.")
        return
      }
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(selected)
    setPreviewUrl(URL.createObjectURL(selected))
  }

  const submitPost = async () => {
    if (submitting) return
    if (!content.trim() && !file) {
      setUploadError("Share a photo, video, or a few words.")
      return
    }
    setSubmitting(true)
    setUploadError(null)

    try {
      let media: {
        pathname: string
        mediaType: "image" | "video"
        contentType: string
        duration: number | null
      } | null = null

      if (file) {
        const form = new FormData()
        form.append("file", file)
        const res = await fetch("/api/time-freedom-social/upload", { method: "POST", body: form })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || "Upload failed")
        media = {
          pathname: json.pathname,
          mediaType: json.mediaType,
          contentType: json.contentType,
          duration: json.duration ?? null,
        }
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Please sign in to share.")

      const { error } = await supabase.from("community_posts").insert({
        user_id: user.id,
        content: content.trim(),
        post_type: POST_TYPE,
        media_pathname: media?.pathname ?? null,
        media_type: media?.mediaType ?? null,
        media_content_type: media?.contentType ?? null,
        media_duration: media?.duration ?? null,
      })
      if (error) throw new Error(error.message)

      setContent("")
      clearFile()
      await loadPosts()
    } catch (err) {
      setUploadError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const toggleLike = async (post: SocialPost) => {
    if (!userId) return
    const liked = post.liked_by_me
    // Optimistic update.
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? { ...p, liked_by_me: !liked, likes_count: Math.max(0, p.likes_count + (liked ? -1 : 1)) }
          : p,
      ),
    )

    if (liked) {
      await supabase.from("community_post_likes").delete().eq("post_id", post.id).eq("user_id", userId)
      await supabase
        .from("community_posts")
        .update({ likes_count: Math.max(0, post.likes_count - 1) })
        .eq("id", post.id)
    } else {
      await supabase.from("community_post_likes").insert({ post_id: post.id, user_id: userId })
      await supabase
        .from("community_posts")
        .update({ likes_count: post.likes_count + 1 })
        .eq("id", post.id)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Composer */}
      <div className="rounded-xl border border-[#7FB069]/25 bg-white/80 p-4 shadow-sm">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share a moment from your Time Freedom — a photo, a short clip, or a thought..."
          className="min-h-20 resize-none border-[#7FB069]/25 bg-white text-[#3F3A3C] placeholder:text-[#8A7F84] focus-visible:ring-[#7FB069]"
        />

        {previewUrl && file && (
          <div className="relative mt-3 overflow-hidden rounded-lg border border-[#7FB069]/20 bg-black/5">
            {file.type.startsWith("image/") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl || "/placeholder.svg"} alt="Selected preview" className="max-h-72 w-full object-contain" />
            ) : (
              <video src={previewUrl} controls playsInline className="max-h-72 w-full" />
            )}
            <button
              type="button"
              onClick={clearFile}
              aria-label="Remove attachment"
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {uploadError && <p className="mt-2 text-sm text-[#C4506B]">{uploadError}</p>}

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={onSelectFile}
              className="hidden"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="text-[#4A6B38] hover:bg-[#7FB069]/10 hover:text-[#4A6B38]"
            >
              <ImagePlus className="mr-1.5 h-4 w-4" />
              Photo
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="text-[#4A6B38] hover:bg-[#7FB069]/10 hover:text-[#4A6B38]"
            >
              <Video className="mr-1.5 h-4 w-4" />
              Video
            </Button>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={submitPost}
            disabled={submitting}
            className="bg-[#7FB069] text-white hover:bg-[#6FA058] disabled:opacity-60"
          >
            {submitting ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Send className="mr-1.5 h-4 w-4" />}
            Share
          </Button>
        </div>
        <p className="mt-2 text-xs text-[#8A7F84]">Photos up to 10MB · Videos up to 60 seconds</p>
      </div>

      {/* Feed */}
      {loading ? (
        <div className="flex items-center justify-center py-10 text-[#8A7F84]">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading the community...
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#7FB069]/30 bg-white/60 py-10 text-center">
          <p className="font-medium text-[#3F3A3C]">Be the first to share your Time Freedom</p>
          <p className="mt-1 text-sm text-[#8A7F84]">Post a photo or a short clip of how you&apos;re spending it.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} currentUserId={userId} onToggleLike={() => toggleLike(post)} supabase={supabase} />
          ))}
        </div>
      )}
    </div>
  )
}

function PostCard({
  post,
  currentUserId,
  onToggleLike,
  supabase,
}: {
  post: SocialPost
  currentUserId: string | null
  onToggleLike: () => void
  supabase: ReturnType<typeof createClient>
}) {
  const name = displayName(post.author_name)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<SocialComment[]>([])
  const [commentText, setCommentText] = useState("")
  const [loadingComments, setLoadingComments] = useState(false)
  const [postingComment, setPostingComment] = useState(false)

  const loadComments = useCallback(async () => {
    setLoadingComments(true)
    const { data } = await supabase
      .from("community_comments")
      .select("id, post_id, user_id, content, created_at")
      .eq("post_id", post.id)
      .order("created_at", { ascending: true })
    const rows = data ?? []
    const nameById = await fetchNames(
      supabase,
      rows.map((c) => c.user_id),
    )
    setComments(rows.map((c) => ({ ...c, author_name: nameById.get(c.user_id) })) as SocialComment[])
    setLoadingComments(false)
  }, [supabase, post.id])

  const toggleComments = async () => {
    const next = !showComments
    setShowComments(next)
    if (next && comments.length === 0) await loadComments()
  }

  const submitComment = async () => {
    if (!commentText.trim() || postingComment || !currentUserId) return
    setPostingComment(true)
    const text = commentText.trim()
    const { error } = await supabase
      .from("community_comments")
      .insert({ post_id: post.id, user_id: currentUserId, content: text })
    if (!error) {
      await supabase
        .from("community_posts")
        .update({ comments_count: post.comments_count + 1 })
        .eq("id", post.id)
      setCommentText("")
      await loadComments()
    }
    setPostingComment(false)
  }

  return (
    <article className="overflow-hidden rounded-xl border border-[#7FB069]/20 bg-white/80 shadow-sm">
      <div className="flex items-center gap-3 p-4 pb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7FB069] text-sm font-semibold text-white">
          {initials(name)}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#3F3A3C]">{name}</p>
          <p className="text-xs text-[#8A7F84]">{timeAgo(post.created_at)}</p>
        </div>
      </div>

      {post.content && <p className="whitespace-pre-wrap px-4 pb-3 text-[#3F3A3C]">{post.content}</p>}

      {post.media_pathname && post.media_type === "image" && (
        <div className="relative max-h-[28rem] w-full bg-black/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mediaSrc(post.media_pathname) || "/placeholder.svg"}
            alt={`Shared by ${name}`}
            className="max-h-[28rem] w-full object-contain"
          />
        </div>
      )}
      {post.media_pathname && post.media_type === "video" && (
        <video
          src={mediaSrc(post.media_pathname)}
          controls
          playsInline
          preload="metadata"
          className="max-h-[28rem] w-full bg-black"
        />
      )}

      <div className="flex items-center gap-4 px-4 py-3">
        <button
          type="button"
          onClick={onToggleLike}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            post.liked_by_me ? "text-[#C4506B]" : "text-[#6B6165] hover:text-[#C4506B]"
          }`}
        >
          <Heart className={`h-5 w-5 ${post.liked_by_me ? "fill-[#C4506B]" : ""}`} />
          {post.likes_count > 0 && <span>{post.likes_count}</span>}
        </button>
        <button
          type="button"
          onClick={toggleComments}
          className="flex items-center gap-1.5 text-sm text-[#6B6165] transition-colors hover:text-[#4A6B38]"
        >
          <MessageCircle className="h-5 w-5" />
          {post.comments_count > 0 && <span>{post.comments_count}</span>}
        </button>
      </div>

      {showComments && (
        <div className="border-t border-[#7FB069]/15 bg-[#F7F4EF]/60 px-4 py-3">
          {loadingComments ? (
            <div className="flex items-center py-2 text-sm text-[#8A7F84]">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading comments...
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {comments.map((c) => {
                const cName = displayName(c.author_name)
                return (
                  <div key={c.id} className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#7FB069]/80 text-xs font-semibold text-white">
                      {initials(cName)}
                    </div>
                    <div className="rounded-lg bg-white px-3 py-2 shadow-sm">
                      <p className="text-xs font-semibold text-[#3F3A3C]">{cName}</p>
                      <p className="text-sm text-[#4A4245]">{c.content}</p>
                    </div>
                  </div>
                )
              })}
              {comments.length === 0 && <p className="py-1 text-sm text-[#8A7F84]">No comments yet.</p>}

              {currentUserId && (
                <div className="mt-1 flex items-center gap-2">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                        e.preventDefault()
                        void submitComment()
                      }
                    }}
                    placeholder="Add a comment..."
                    className="flex-1 rounded-full border border-[#7FB069]/25 bg-white px-4 py-2 text-sm text-[#3F3A3C] outline-none focus:ring-2 focus:ring-[#7FB069]/40"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={submitComment}
                    disabled={postingComment || !commentText.trim()}
                    className="bg-[#7FB069] text-white hover:bg-[#6FA058] disabled:opacity-60"
                  >
                    {postingComment ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  )
}
