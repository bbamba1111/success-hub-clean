import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

// Free app URL - update this when deployed
const FREE_APP_URL = process.env.FREE_APP_URL || "https://sunday-shift.vercel.app"

// Routes that should only exist on the free app, not the paid hub
const FREE_ONLY_ROUTES = ["/marketing", "/garden", "/sunday-shift"]

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Redirect free-only routes to the separate free app domain
  const isFreeOnlyRoute = FREE_ONLY_ROUTES.some(route => 
    request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route + "/")
  )
  
  if (isFreeOnlyRoute) {
    // Redirect to the free app at the same path
    const redirectUrl = new URL(request.nextUrl.pathname, FREE_APP_URL)
    redirectUrl.search = request.nextUrl.search
    return NextResponse.redirect(redirectUrl)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase env vars are not available, skip auth check (development mode)
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
      },
    },
  })

  // IMPORTANT: Do not run code between createServerClient and supabase.auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect all routes except home page, auth pages, welcome page, API routes, and public assets
  // Note: audit, focus-areas, my-results are kept on hub for paid users but require auth
  if (
    !user &&
    request.nextUrl.pathname !== "/" &&
    !request.nextUrl.pathname.startsWith("/auth") &&
    !request.nextUrl.pathname.startsWith("/welcome") &&
    !request.nextUrl.pathname.startsWith("/human-zone-of-genius-team") &&
    !request.nextUrl.pathname.startsWith("/ai-executive-team") &&
    !request.nextUrl.pathname.startsWith("/api") &&
    !request.nextUrl.pathname.startsWith("/_next") &&
    !request.nextUrl.pathname.startsWith("/images")
  ) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
