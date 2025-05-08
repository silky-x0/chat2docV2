import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createAuth0Client } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const auth0 = await createAuth0Client()
    const { user, accessToken } = await auth0.handleCallback(request)
    const cookieStore = cookies()
    const returnTo = request.nextUrl.searchParams.get("returnTo") || "/chat"

    // Create session with user info
    const session = {
      user: {
        id: user.sub,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
      accessToken,
    }

    // Set session cookie
    cookieStore.set({
      name: "session",
      value: encodeURIComponent(JSON.stringify(session)),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: "lax",
    })

    // Create a dedicated auth cookie that's accessible to client-side JavaScript
    cookieStore.set({
      name: "auth-status",
      value: "authenticated",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: "lax",
    })

    console.log("User authenticated:", user.email);
    
    // Redirect to the return path or /chat
    return NextResponse.redirect(new URL(returnTo, request.url))
  } catch (error) {
    console.error("Callback error:", error)
    return NextResponse.redirect(new URL("/?error=callback_failed", request.url))
  }
}
