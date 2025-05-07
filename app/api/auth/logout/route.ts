import { type NextRequest, NextResponse } from "next/server"
import { createAuth0Client } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const auth0 = await createAuth0Client()

  try {
    const logoutUrl = await auth0.getLogoutUrl({
      returnTo: new URL("/", request.url).toString(),
    })

    const response = NextResponse.redirect(logoutUrl)

    // Clear cookies
    response.cookies.delete("auth_session")

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.redirect(new URL("/", request.url))
  }
}
