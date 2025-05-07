import { cookies } from "next/headers"
import { Auth0Client } from "@auth0/auth0-spa-js"

interface User {
  email: string
  name: string
  picture: string
}

interface Session {
  user?: User
  accessToken?: string
  anonymousId?: string
  questionCount?: number
}

function validateConfig() {
  const requiredEnvVars = [
    'AUTH0_DOMAIN',
    'AUTH0_CLIENT_ID',
    'AUTH0_CLIENT_SECRET',
    'AUTH0_REDIRECT_URI'
  ]

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }
}

export async function createAuth0Client() {
  validateConfig()

  const auth0 = new Auth0Client({
    domain: process.env.AUTH0_DOMAIN!,
    client_id: process.env.AUTH0_CLIENT_ID!,
    client_secret: process.env.AUTH0_CLIENT_SECRET!,
    redirect_uri: process.env.AUTH0_REDIRECT_URI!,
  })

  return {
    getAuthorizationUrl: async ({ returnTo, screenHint }: { returnTo: string; screenHint?: string }) => {
      const params = new URLSearchParams({
        client_id: process.env.AUTH0_CLIENT_ID!,
        redirect_uri: process.env.AUTH0_REDIRECT_URI!,
        response_type: 'code',
        scope: process.env.AUTH0_SCOPE || 'openid profile email',
        returnTo,
      })

      if (screenHint) {
        params.append('screen_hint', screenHint)
      }

      return `https://${process.env.AUTH0_DOMAIN}/authorize?${params.toString()}`
    },

    handleCallback: async (request: Request) => {
      const url = new URL(request.url)
      const code = url.searchParams.get('code')

      if (!code) {
        throw new Error('No authorization code received')
      }

      try {
        const tokenResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            grant_type: 'authorization_code',
            client_id: process.env.AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            code,
            redirect_uri: process.env.AUTH0_REDIRECT_URI
          })
        })

        const tokens = await tokenResponse.json()

        if (!tokenResponse.ok) {
          throw new Error(tokens.error_description || 'Failed to get tokens')
        }

        // Get user info
        const userInfoResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
          headers: { Authorization: `Bearer ${tokens.access_token}` }
        })

        const user = await userInfoResponse.json()

        if (!userInfoResponse.ok) {
          throw new Error('Failed to get user info')
        }

        return { user, accessToken: tokens.access_token }
      } catch (error) {
        console.error('Token exchange error:', error)
        throw error
      }
    },

    getLogoutUrl: async ({ returnTo }: { returnTo: string }) => {
      const params = new URLSearchParams({
        client_id: process.env.AUTH0_CLIENT_ID!,
        returnTo,
      })

      return `https://${process.env.AUTH0_DOMAIN}/v2/logout?${params.toString()}`
    },
  }
}

export async function getSession(): Promise<Session> {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get('auth_session')

  if (!sessionCookie?.value) {
    // Get or create anonymous ID from cookie
    let anonymousId = cookieStore.get('anonymous_id')?.value

    if (!anonymousId) {
      anonymousId = `anon_${Math.random().toString(36).substring(2, 15)}`
    }

    // Get question count from cookie or default to 0
    const questionCount = Number.parseInt(cookieStore.get('question_count')?.value || '0')

    return { anonymousId, questionCount }
  }

  try {
    const session = JSON.parse(sessionCookie.value) as Session
    return session
  } catch (error) {
    console.error('Session parsing error:', error)
    return {}
  }
}
