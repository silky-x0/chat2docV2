import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get("session")

  if (!sessionCookie?.value) {
    return NextResponse.json(null)
  }

  try {
    // Parse the session cookie value
    const session = JSON.parse(decodeURIComponent(sessionCookie.value))

    if (!session?.user) {
      return NextResponse.json(null)
    }

    // Return user information
    return NextResponse.json({
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      picture: session.user.picture,
    })
  } catch (error) {
    console.error("Error parsing session cookie:", error)
    return NextResponse.json(null)
  }
}
