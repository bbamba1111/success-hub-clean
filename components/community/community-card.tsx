"use client"

/**
 * CommunityCard — base reusable card with accent left-border and optional
 * Cherry Blossom quote slot.
 */

import type { ReactNode } from "react"
import Link from "next/link"

interface CommunityCardProps {
  accentColor: string
  title?: string
  subtitle?: string
  cherryBlossomQuote?: string
  ctaLabel?: string
  ctaHref?: string
  children?: ReactNode
  className?: string
}

export function CommunityCard({
  accentColor,
  title,
  subtitle,
  cherryBlossomQuote,
  ctaLabel,
  ctaHref,
  children,
  className = "",
}: CommunityCardProps) {
  return (
    <article
      className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-white ${className}`}
      style={{ borderLeft: `4px solid ${accentColor}` }}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className="px-5 pt-5">
          {title && (
            <h3 className="font-playfair text-base font-semibold text-[#1C2B2B]">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="mt-0.5 font-montserrat text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
      )}

      {/* Content slot */}
      {children && <div className="px-5 pb-5 pt-3">{children}</div>}

      {/* Cherry Blossom quote */}
      {cherryBlossomQuote && (
        <div
          className="mx-5 mb-5 rounded-xl px-4 py-3"
          style={{ backgroundColor: `${accentColor}14` }}
        >
          <p className="font-playfair text-[13px] italic leading-relaxed text-[#3D4F4F]">
            &ldquo;{cherryBlossomQuote}&rdquo;
          </p>
          <p className="mt-1 font-montserrat text-[11px] uppercase tracking-wider text-gray-400">
            Cherry Blossom
          </p>
        </div>
      )}

      {/* CTA */}
      {ctaLabel && ctaHref && (
        <div className="px-5 pb-5">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-1.5 font-montserrat text-xs font-semibold uppercase tracking-wider"
            style={{ color: accentColor }}
          >
            {ctaLabel}
            <span aria-hidden="true">&#8594;</span>
          </Link>
        </div>
      )}
    </article>
  )
}
