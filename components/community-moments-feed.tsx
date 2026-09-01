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

const MAX_IMAGE_BYTES = 10 * 1024 * 1024 // 10MB

/**
 * Positive-only reactions — shared across every Community Moments feed
 * (Time Freedom Moments™, Lunch Share™, ...). Each member expresses exactly
 * one sentiment per post (backed by community_post_likes). Icons (not
 * emojis) keep the feed feeling premium and on-brand.
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

function dayTheme(iso: string): string {
  const day = new Date(iso).getDay()
  const isTimeFreedom = day === 0 || day === 5 || day === 6
  return `${WEEKDAYS[day]} · ${isTimeFreedom ? "Time Freedom™" : "Business Week™"}`
}

/** Reads a video file's duration in the browser so oversize clips are rejected before uploading. */
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

export interface CommunityMomentsFeedConfig {
  /** `community_posts.post_type` value this feed reads/writes. */
  postType: string
  /** Unique Supabase Realtime channel name (must not collide with other feeds). */
  channelName: string
  title: string
  subtitle: string
  composerPlaceholder: string
  shareButtonLabel: string
  /** Base path for this feed's upload route, e.g. `/api/lunch-share/upload`. */
  uploadPath: string
  /** Base path for this feed's media route, e.g. `/api/lunch-share/media`. */
  mediaPath: string
  maxVideoSeconds: number
  maxVideoBytes: number
  emptyStateTitle: string
  emptyStateSubtitle: string
  footerHint: string
  /** Optional fire-and-forget memory endpoint Cherry Blossom listens on. */
  rememberEndpoint?: string
  /** "list" (Lunch Share™ default) or "grid" (Time Freedom Moments™). */
  layout: "list" | "grid"
}

export function CommunityMomentsFeed({ active, config }: { active: boolean; config: CommunityMomentsFeedConfig }) {
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)
  if (!supabaseRef.current) supabaseRef.current = createClient()
  const supabase = supabaseRef.current

  const mediaSrc = useCallback((pathname: string) => `${config.mediaPath}?pathname=${encodeURIComponent(pathname)}`, [config.mediaPath])

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
      .eq("post_type", config.postType)
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      console.log("[v0] loadPosts error:", error.message)
      setLoading(false)
      return
    }

    const rows = data ?? []

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
  }, [supabase, config.postType])

  useEffect(() => {
    if (active && !initialized) {
      setInitialized(true)
      void loadPosts()
    }
  }, [active, initialized, loadPosts])

  useEffect(() => {
    if (!initialized) return
    const channel = supabase
      .channel(config.channelName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "community_posts", filter: `post_type=eq.${config.postType}` },
        () => {
          void loadPosts()
        },
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [initialized, supabase, loadPosts, config.channelName, config.postType])

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
    if (isVideo && selected.size > config.maxVideoBytes) {
      setUploadError(`Videos must be ${Math.round(config.maxVideoBytes / (1024 * 1024))}MB or smaller.`)
      return
    }
    if (isVideo) {
      try {
        const duration = await readVideoDuration(selected)
        if (duration > config.maxVideoSeconds + 0.5) {
          setUploadError(`Videos must be ${config.maxVideoSeconds} seconds or less.`)
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
        const res = await fetch(config.uploadPath, { method: "POST", body: form })
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
        post_type: config.postType,
        media_pathname: media?.pathname ?? null,
        media_type: media?.mediaType ?? null,
        media_content_type: media?.contentType ?? null,
        media_duration: media?.duration ?? null,
      })
      if (error) throw new Error(error.message)

      if (config.rememberEndpoint && caption.length >= 8) {
        void fetch(config.rememberEndpoint, {
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

  const setReaction = async (post: SocialPost, type: ReactionType) => {
    if (!userId) return
    const current = post.my_reaction ?? null
    const removing = current === type

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
        const upd = await supabase
          .from("community_post_likes")
          .update({ reaction_type: type })
          .eq("post_id", post.id)
          .eq("user_id", userId)
        if (upd.error) console.log("[v0] reaction switch (pre-migration):", upd.error.message)
        return
      }

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

  const videoLimitLabel =
    config.maxVideoSeconds >= 60 && config.maxVideoSeconds % 60 === 0
      ? `${config.maxVideoSeconds / 60} minute${config.maxVideoSeconds / 60 > 1 ? "s" : ""}`
      : `${config.maxVideoSeconds} seconds`

  return (
    <div className={`mx-auto flex w-full flex-col gap-6 ${config.layout === "grid" ? "max-w-4xl" : "max-w-xl"}`}>
      <div className="text-center">
        <h3 className="font-playfair text-2xl font-medium italic text-[#3A2E33]">{config.title}</h3>
        <p className="mt-1 text-sm text-[#6B6165] text-pretty">{config.subtitle}</p>
      </div>

      {/* Composer */}
      <div className="rounded-2xl border border-[#7FB069]/25 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={config.composerPlaceholder}
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
            {config.shareButtonLabel}
          </Button>
        </div>
        <p className="mt-2 text-xs text-[#8A7F84]">{config.footerHint}</p>
      </div>

      {/* Feed */}
      {loading ? (
        <div className="flex items-center justify-center py-10 text-[#8A7F84]">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading...
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#7FB069]/30 bg-white/60 py-12 text-center">
          <p className="font-medium text-[#3F3A3C]">{config.emptyStateTitle}</p>
          <p className="mt-1 text-sm text-[#8A7F84]">{config.emptyStateSubtitle}</p>
        </div>
      ) : (
        <div className={config.layout === "grid" ? "grid grid-cols-2 gap-4 sm:grid-cols-4" : "flex flex-col gap-6"}>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={userId}
              onReact={(type) => setReaction(post, type)}
              supabase={supabase}
              mediaSrc={mediaSrc}
              layout={config.layout}
              videoLimitLabel={videoLimitLabel}
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
  mediaSrc,
  layout,
}: {
  post: SocialPost
  currentUserId: string | null
  onReact: (type: ReactionType) => void
  supabase: ReturnType<typeof createClient>
  mediaSrc: (pathname: string) => string
  layout: "list" | "grid"
  videoLimitLabel: string
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
  const [expanded, setExpanded] = useState(false)

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
      await navigator.clipboard.writeText(post.content || "A Community Moment")
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
      a.download = post.media_pathname.split("/").pop() || "community-moment"
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      /* ignore download failure */
    }
    setShareOpen(false)
  }

  // ── Compact grid tile ─────────────────────────────────────────────────
  // Media on top, truncated caption, reactions/comments reachable via a
  // click-to-expand overlay so density stays high while nothing is lost.
  if (layout === "grid" && !expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="group flex flex-col overflow-hidden rounded-xl border border-[#7FB069]/20 bg-white/70 text-left shadow-sm backdrop-blur-sm transition-transform hover:-translate-y-0.5"
      >
        <div className="relative aspect-square w-full bg-black/5">
          {post.media_pathname && post.media_type === "image" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mediaSrc(post.media_pathname) || "/placeholder.svg"}
              alt={`Shared by ${name}`}
              className="h-full w-full object-cover"
            />
          )}
          {post.media_pathname && post.media_type === "video" && (
            <>
              <video src={mediaSrc(post.media_pathname)} preload="metadata" muted playsInline className="h-full w-full object-cover" />
              <span className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1">
                <Video className="h-3 w-3 text-white" />
              </span>
            </>
          )}
          {!post.media_pathname && (
            <div className="flex h-full w-full items-center justify-center p-3 text-center text-xs text-[#6B6165]">
              {post.content}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between gap-1 px-2.5 py-2">
          <span className="truncate text-xs font-medium text-[#3F3A3C]">{name}</span>
          <span className="flex items-center gap-2 text-[11px] text-[#8A7F84]">
            {post.likes_count > 0 && (
              <span className="inline-flex items-center gap-0.5">
                <PartyPopper className="h-3 w-3" /> {post.likes_count}
              </span>
            )}
            {post.comments_count > 0 && (
              <span className="inline-flex items-center gap-0.5">
                <MessageCircle className="h-3 w-3" /> {post.comments_count}
              </span>
            )}
          </span>
        </div>
      </button>
    )
  }

  return (
    <article
      className={`overflow-hidden rounded-2xl border border-[#7FB069]/20 bg-white/70 shadow-sm backdrop-blur-sm ${
        layout === "grid" ? "col-span-2 sm:col-span-2" : ""
      }`}
    >
      {layout === "grid" && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="flex w-full items-center gap-1.5 px-4 pt-3 text-xs font-medium text-[#4A6B38] hover:text-[#3A5A2C]"
        >
          <X className="h-3.5 w-3.5" /> Collapse
        </button>
      )}
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

      <div className="flex items-center gap-1 px-2 py-2">
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
