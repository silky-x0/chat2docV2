import { NextResponse } from "next/server"
import { validateConfig } from "@/lib/auth"

export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ message: "Not available in production" }, { status: 403 })
  }

  try {
    // Validate Auth0 config
    validateConfig()

    // Return config data (without sensitive values)
    return NextResponse.json({
      auth0Domain: process.env.AUTH0_DOMAIN || 'missing',
      clientIdExists: !!process.env.AUTH0_CLIENT_ID,
      clientSecretExists: !!process.env.AUTH0_CLIENT_SECRET,
      redirectUri: process.env.AUTH0_REDIRECT_URI,
      baseUrl: process.env.AUTH0_BASE_URL,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      status: "Configuration looks valid"
    })
  } catch (error) {
    return NextResponse.json({
      status: "Configuration error",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
} 