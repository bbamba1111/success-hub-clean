"use client"

/**
 * CommunityDiscussions — 7 discussion space cards with topic, reply count,
 * last activity chip, and optional pinned resource link.
 */

import Link from "next/link"
import { STATIC_DISCUSSIONS } from "@/lib/community/community-data"
import { MessageCircle, ExternalLink } from "lucide-react"

export function CommunityDiscussions() {
  return (
    <section aria-labelledby="discussions-heading">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-[#4A7FA5]" aria-hidden="true" />
          <h2
            id="discussions-heading"
            className="font-playfair text-xl font-bold text-[#1C2B2B]"
          >
            Community Discussions
          </h2>
        </div>
        <Link
          href="https://www.facebook.com/groups/maketimeformore"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 font-montserrat text-xs font-semibold uppercase tracking-wider text-[#4A7FA5]"
        >
          Open Community
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-2">
        {STATIC_DISCUSSIONS.map((disc) => (
          <article
            key={disc.id}
            className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 transition-shadow hover:shadow-sm"
            style={{ borderLeft: `4px solid ${disc.accentColor}` }}
          >
            {/* Space + title */}
            <div className="min-w-0 flex-1">
              <span
                className="mb-1.5 inline-block rounded-full px-2 py-0.5 font-montserrat text-[10px] font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: `${disc.accentColor}18`,
                  color: disc.accentColor,
                }}
              >
                {disc.space}
              </span>
              <p className="font-montserrat text-sm font-semibold leading-snug text-[#1C2B2B]">
                {disc.title}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="font-montserrat text-[12px] text-gray-400">
                  {disc.replyCount} replies
                </span>
                <span className="font-montserrat text-[12px] text-gray-400">
                  {disc.lastActivityAt}
                </span>
                {disc.pinnedResource && (
                  <Link
                    href={disc.pinnedResource.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 font-montserrat text-[12px] font-semibold"
                    style={{ color: disc.accentColor }}
                  >
                    {disc.pinnedResource.label}
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </div>

            {/* Reply CTA */}
            <Link
              href="https://www.facebook.com/groups/maketimeformore"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 rounded-xl border px-3 py-1.5 font-montserrat text-xs font-semibold transition-colors hover:text-white"
              style={{
                borderColor: disc.accentColor,
                color: disc.accentColor,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.backgroundColor = disc.accentColor
                el.style.color = "#fff"
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.backgroundColor = "transparent"
                el.style.color = disc.accentColor
              }}
            >
              Reply
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
