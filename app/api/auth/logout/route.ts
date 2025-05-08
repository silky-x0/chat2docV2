import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createAuth0Client } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const auth0 = await createAuth0Client()
    const cookieStore = cookies()
    const returnTo = request.nextUrl.searchParams.get("returnTo") || "/"

    // Clear session cookies
    cookieStore.delete("session")
    cookieStore.delete("auth-status")
    
    // Get Auth0 logout URL
    const logoutUrl = await auth0.getLogoutUrl({
      returnTo: new URL(returnTo, process.env.AUTH0_BASE_URL).toString(),
    })

    console.log("User logged out, redirecting to:", logoutUrl);
    
    // Redirect to Auth0 logout endpoint
    return NextResponse.redirect(logoutUrl)
  } catch (error) {
    console.error("Logout error:", error)
    
    // Even if there's an error with Auth0, clear cookies and redirect home
    cookies().delete("session")
    cookies().delete("auth-status")
    
    return NextResponse.redirect(new URL("/", request.url))
  }
}
