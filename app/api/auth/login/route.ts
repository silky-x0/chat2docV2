import { type NextRequest, NextResponse } from "next/server"
import { createAuth0Client } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const auth0 = await createAuth0Client()
  const searchParams = request.nextUrl.searchParams
  const screenHint = searchParams.get("screen_hint") || undefined
  const returnTo = searchParams.get("returnTo") || "/"

  try {
    const authorizationUrl = await auth0.getAuthorizationUrl({
      returnTo,
      screenHint,
    })

    return NextResponse.redirect(authorizationUrl)
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.redirect(new URL("/?error=login_failed", request.url))
  }
}
