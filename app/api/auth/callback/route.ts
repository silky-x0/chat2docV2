import { type NextRequest, NextResponse } from "next/server"
import { createAuth0Client } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const auth0 = await createAuth0Client()

  try {
    const { user, accessToken } = await auth0.handleCallback(request)

    const response = NextResponse.redirect(new URL("/chat", request.url))

    // Set session cookie
    response.cookies.set({
      name: "auth_session",
      value: JSON.stringify({ user, accessToken }),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Callback error:", error)
    return NextResponse.redirect(new URL("/?error=callback_failed", request.url))
  }
}
