"use client"

import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  Check,
  Copy,
  Download,
  Facebook,
  HeartHandshake,
  ImagePlus,
  Instagram,
  Linkedin,
  Loader2,
  MessageCircle,
  PartyPopper,
  Send,
  Share2,
  Sparkles,
  Star,
  Video,
  X,
  Youtube,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const POST_TYPE = "time_freedom"
const MAX_IMAGE_BYTES = 10 * 1024 * 1024 // 10MB
const MAX_VIDEO_BYTES = 100 * 1024 * 1024 // 100MB
const MAX_VIDEO_SECONDS = 60

/**
 * Positive-only reactions — Time Freedom Moments™ celebrates the life members
 * are reclaiming, so there is intentionally no negative reaction. Each member
 * expresses exactly one sentiment per Moment (backed by community_post_likes).
 * Icons (not emojis) keep the feed feeling premium and on-brand.
 */
type ReactionType = "appreciate" | "celebrate" | "inspire" | "love_this"

const REACTIONS: {
  type: ReactionType
  label: string
  Icon: typeof Sparkles
  color: string
  fill: string
}[] = [
  { type: "celebrate", label: "Celebrate", Icon: PartyPopper, color: "text-[#C4506B]", fill: "fill-[#C4506B]" },
  { type: "appreciate", label: "Appreciate", Icon: HeartHandshake, color: "text-[#4A6B38]", fill: "fill-[#4A6B38]" },
  { type: "inspire", label: "Inspire", Icon: Sparkles, color: "text-[#B8860B]", fill: "fill-[#B8860B]" },
  { type: "love_this", label: "Love this", Icon: Star, color: "text-[#7A5CC4]", fill: "fill-[#7A5CC4]" },
]

const REACTION_BY_TYPE = new Map(REACTIONS.map((r) => [r.type, r]))
const DEFAULT_REACTION: ReactionType = "celebrate"

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
  my_reaction?: ReactionType | null
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

/**
 * Loads the current user's reaction per post. Tries the typed column first and
 * gracefully falls back to a plain like (treated as 'celebrate') so the feed
 * keeps working before the reactions migration (011) has been applied.
 */
async function fetchMyReactions(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  postIds: string[],
): Promise<Map<string, ReactionType>> {
  const map = new Map<string, ReactionType>()
  if (postIds.length === 0) return map

  const typed = await supabase
    .from("community_post_likes")
    .select("post_id, reaction_type")
    .eq("user_id", userId)
    .in("post_id", postIds)

  if (!typed.error) {
    for (const row of typed.data ?? []) {
      const type = (row.reaction_type as ReactionType) ?? DEFAULT_REACTION
      map.set(row.post_id as string, REACTION_BY_TYPE.has(type) ? type : DEFAULT_REACTION)
    }
    return map
  }

  // Pre-migration fallback: no reaction_type column yet.
  const plain = await supabase
    .from("community_post_likes")
    .select("post_id")
    .eq("user_id", userId)
    .in("post_id", postIds)
  for (const row of plain.data ?? []) {
    map.set(row.post_id as string, DEFAULT_REACTION)
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

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

/**
 * A Moment's day theme — e.g. "Friday · Time Freedom™". Fri/Sat/Sun fall inside
 * the 3-Day Time Freedom™ Weekend; the rest of the week reads as the Business
 * Week™ so the feed always reinforces the operating rhythm.
 */
function dayTheme(iso: string): string {
  const day = new Date(iso).getDay()
  const isTimeFreedom = day === 0 || day === 5 || day === 6
  return `${WEEKDAYS[day]} · ${isTimeFreedom ? "Time Freedom™" : "Business Week™"}`
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

    // Author names and the current user's reactions are fetched separately so we
    // don't depend on a PostgREST foreign-key embed (user_id -> auth.users).
    const nameById = await fetchNames(
      supabase,
      rows.map((p) => p.user_id),
    )

    let reactionByPost = new Map<string, ReactionType>()
    if (user && rows.length > 0) {
      reactionByPost = await fetchMyReactions(
        supabase,
        user.id,
        rows.map((p) => p.id),
      )
    }

    setPosts(
      rows.map((p) => ({
        ...p,
        author_name: nameById.get(p.user_id),
        my_reaction: reactionByPost.get(p.id) ?? null,
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

  // Realtime: new/updated/deleted Time Freedom Moments appear live.
  useEffect(() => {
    if (!initialized) return
    const channel = supabase
      .channel("time-freedom-moments")
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

      const caption = content.trim()

      const { error } = await supabase.from("community_posts").insert({
        user_id: user.id,
        content: caption,
        post_type: POST_TYPE,
        media_pathname: media?.pathname ?? null,
        media_type: media?.mediaType ?? null,
        media_content_type: media?.contentType ?? null,
        media_duration: media?.duration ?? null,
      })
      if (error) throw new Error(error.message)

      // Fire-and-forget: let Cherry Blossom quietly learn meaningful details
      // (favorite activities, the people they love, places, celebrations) from
      // this Moment. Never blocks or fails the share.
      if (caption.length >= 8) {
        void fetch("/api/time-freedom-moments/remember", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ caption, dayTheme: dayTheme(new Date().toISOString()) }),
        }).catch(() => {})
      }

      setContent("")
      clearFile()
      await loadPosts()
    } catch (err) {
      setUploadError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  /**
   * Applies a positive reaction. Clicking the active reaction removes it;
   * choosing a different one switches sentiment without changing the total.
   * Writes are attempted with reaction_type and fall back to a plain like so
   * this works before and after the reactions migration.
   */
  const setReaction = async (post: SocialPost, type: ReactionType) => {
    if (!userId) return
    const current = post.my_reaction ?? null
    const removing = current === type

    // Optimistic update.
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== post.id) return p
        if (removing) return { ...p, my_reaction: null, likes_count: Math.max(0, p.likes_count - 1) }
        const wasReacting = current !== null
        return {
          ...p,
          my_reaction: type,
          likes_count: wasReacting ? p.likes_count : p.likes_count + 1,
        }
      }),
    )

    try {
      if (removing) {
        await supabase.from("community_post_likes").delete().eq("post_id", post.id).eq("user_id", userId)
        await supabase
          .from("community_posts")
          .update({ likes_count: Math.max(0, post.likes_count - 1) })
          .eq("id", post.id)
        return
      }

      if (current !== null) {
        // Switching sentiment — try to update the type; ignore if column missing.
        const upd = await supabase
          .from("community_post_likes")
          .update({ reaction_type: type })
          .eq("post_id", post.id)
          .eq("user_id", userId)
        if (upd.error) console.log("[v0] reaction switch (pre-migration):", upd.error.message)
        return
      }

      // New reaction — insert with type, fall back to a plain like pre-migration.
      const withType = await supabase
        .from("community_post_likes")
        .insert({ post_id: post.id, user_id: userId, reaction_type: type })
      if (withType.error) {
        await supabase.from("community_post_likes").insert({ post_id: post.id, user_id: userId })
      }
      await supabase
        .from("community_posts")
        .update({ likes_count: post.likes_count + 1 })
        .eq("id", post.id)
    } catch (err) {
      console.log("[v0] setReaction error:", (err as Error).message)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      {/* Intro — this is a celebration of reclaimed life, not a feature. */}
      <div className="text-center">
        <h3 className="font-playfair text-2xl font-medium italic text-[#3A2E33]">Time Freedom Moments™</h3>
        <p className="mt-1 text-sm text-[#6B6165] text-pretty">
          Celebrate the life you&apos;re reclaiming. Contained work. Expanded life.
        </p>
      </div>

      {/* Composer */}
      <div className="rounded-2xl border border-[#7FB069]/25 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share a moment from your life — a walk, lunch with someone you love, a quiet afternoon..."
          className="min-h-20 resize-none border-[#7FB069]/25 bg-white/80 text-[#3F3A3C] placeholder:text-[#8A7F84] focus-visible:ring-[#7FB069]"
        />

        {previewUrl && file && (
          <div className="relative mt-3 overflow-hidden rounded-xl border border-[#7FB069]/20 bg-black/5">
            {file.type.startsWith("image/") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl || "/placeholder.svg"} alt="Selected preview" className="max-h-80 w-full object-contain" />
            ) : (
              <video src={previewUrl} controls playsInline className="max-h-80 w-full" />
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
            <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={onSelectFile} className="hidden" />
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
            Share Moment
          </Button>
        </div>
        <p className="mt-2 text-xs text-[#8A7F84]">Photos up to 10MB · Videos up to 60 seconds</p>
      </div>

      {/* Feed */}
      {loading ? (
        <div className="flex items-center justify-center py-10 text-[#8A7F84]">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading Moments...
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#7FB069]/30 bg-white/60 py-12 text-center">
          <p className="font-medium text-[#3F3A3C]">Be the first to share a Time Freedom Moment</p>
          <p className="mt-1 text-sm text-[#8A7F84]">Post a photo or a short clip of the life you&apos;re reclaiming.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={userId}
              onReact={(type) => setReaction(post, type)}
              supabase={supabase}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function PostCard({
  post,
  currentUserId,
  onReact,
  supabase,
}: {
  post: SocialPost
  currentUserId: string | null
  onReact: (type: ReactionType) => void
  supabase: ReturnType<typeof createClient>
}) {
  const name = displayName(post.author_name)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<SocialComment[]>([])
  const [commentText, setCommentText] = useState("")
  const [loadingComments, setLoadingComments] = useState(false)
  const [postingComment, setPostingComment] = useState(false)
  const [showReactions, setShowReactions] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const activeReaction = post.my_reaction ? REACTION_BY_TYPE.get(post.my_reaction) : null

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

  const flashCopied = (label: string) => {
    setCopied(label)
    window.setTimeout(() => setCopied((c) => (c === label ? null : c)), 1600)
  }

  const copyCaption = async () => {
    try {
      await navigator.clipboard.writeText(post.content || "A Time Freedom Moment™")
      flashCopied("caption")
    } catch {
      /* clipboard unavailable */
    }
  }

  const downloadMedia = async () => {
    if (!post.media_pathname) return
    try {
      const res = await fetch(mediaSrc(post.media_pathname))
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = post.media_pathname.split("/").pop() || "time-freedom-moment"
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      /* ignore download failure */
    }
    setShareOpen(false)
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-[#7FB069]/20 bg-white/70 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-3 p-4 pb-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#7FB069] text-sm font-semibold text-white">
          {initials(name)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#3F3A3C]">{name}</p>
          <p className="text-xs text-[#8A7F84]">
            {dayTheme(post.created_at)} · {timeAgo(post.created_at)}
          </p>
        </div>
      </div>

      {post.content && (
        <p className="whitespace-pre-wrap px-4 pb-3 text-[15px] leading-relaxed text-[#3F3A3C]">{post.content}</p>
      )}

      {post.media_pathname && post.media_type === "image" && (
        <div className="relative w-full bg-black/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mediaSrc(post.media_pathname) || "/placeholder.svg"}
            alt={`Shared by ${name}`}
            className="max-h-[34rem] w-full object-cover"
          />
        </div>
      )}
      {post.media_pathname && post.media_type === "video" && (
        <video
          src={mediaSrc(post.media_pathname)}
          controls
          playsInline
          preload="metadata"
          className="max-h-[34rem] w-full bg-black"
        />
      )}

      {/* Reaction summary */}
      {post.likes_count > 0 && (
        <div className="flex items-center gap-1.5 px-4 pt-3 text-xs text-[#8A7F84]">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#C4506B]/10">
            <PartyPopper className="h-3 w-3 text-[#C4506B]" />
          </span>
          <span>
            {post.likes_count} {post.likes_count === 1 ? "celebration" : "celebrations"}
          </span>
        </div>
      )}

      {/* Action bar */}
      <div className="flex items-center gap-1 px-2 py-2">
        {/* Reaction picker */}
        <div className="relative">
          {showReactions && (
            <div
              className="absolute bottom-full left-1 mb-2 flex items-center gap-1 rounded-full border border-[#7FB069]/20 bg-white p-1 shadow-lg"
              onMouseLeave={() => setShowReactions(false)}
            >
              {REACTIONS.map((r) => (
                <button
                  key={r.type}
                  type="button"
                  aria-label={r.label}
                  title={r.label}
                  onClick={() => {
                    onReact(r.type)
                    setShowReactions(false)
                  }}
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-110 hover:bg-[#F3F6EF] ${r.color}`}
                >
                  <r.Icon className="h-5 w-5" />
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => (activeReaction ? onReact(activeReaction.type) : onReact(DEFAULT_REACTION))}
            onMouseEnter={() => setShowReactions(true)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[#F3F6EF] ${
              activeReaction ? activeReaction.color : "text-[#6B6165]"
            }`}
          >
            {activeReaction ? (
              <activeReaction.Icon className={`h-5 w-5 ${activeReaction.fill}`} />
            ) : (
              <PartyPopper className="h-5 w-5" />
            )}
            {activeReaction ? activeReaction.label : "Celebrate"}
          </button>
        </div>

        <button
          type="button"
          onClick={toggleComments}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[#6B6165] transition-colors hover:bg-[#F3F6EF] hover:text-[#4A6B38]"
        >
          <MessageCircle className="h-5 w-5" />
          {post.comments_count > 0 ? post.comments_count : "Comment"}
        </button>

        {/* Share menu — internal actions work today; social platforms are
            prepared for a future phase. */}
        <div className="relative ml-auto">
          <button
            type="button"
            onClick={() => setShareOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={shareOpen}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[#6B6165] transition-colors hover:bg-[#F3F6EF] hover:text-[#4A6B38]"
          >
            <Share2 className="h-5 w-5" />
            Share
          </button>
          {shareOpen && (
            <div
              role="menu"
              className="absolute bottom-full right-0 mb-2 w-60 overflow-hidden rounded-xl border border-[#7FB069]/20 bg-white p-1 shadow-lg"
              onMouseLeave={() => setShareOpen(false)}
            >
              <button
                type="button"
                role="menuitem"
                onClick={copyCaption}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-[#3F3A3C] hover:bg-[#F3F6EF]"
              >
                {copied === "caption" ? (
                  <Check className="h-4 w-4 text-[#4A6B38]" />
                ) : (
                  <Copy className="h-4 w-4 text-[#6B6165]" />
                )}
                {copied === "caption" ? "Caption copied" : "Copy caption"}
              </button>
              {post.media_pathname && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={downloadMedia}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-[#3F3A3C] hover:bg-[#F3F6EF]"
                >
                  <Download className="h-4 w-4 text-[#6B6165]" />
                  Download {post.media_type === "video" ? "video" : "image"}
                </button>
              )}

              <div className="my-1 border-t border-[#7FB069]/15" />
              <p className="px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-[#A79DA1]">
                External sharing · coming soon
              </p>
              {[
                { label: "Share to LinkedIn", Icon: Linkedin },
                { label: "Share to Facebook", Icon: Facebook },
                { label: "Share to Instagram", Icon: Instagram },
                { label: "Share to YouTube", Icon: Youtube },
              ].map(({ label, Icon }) => (
                <button
                  key={label}
                  type="button"
                  role="menuitem"
                  disabled
                  aria-disabled="true"
                  className="flex w-full cursor-not-allowed items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-[#B4ABAF]"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
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
                    placeholder="Add an encouraging word..."
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
