import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getUserQuestionCount, incrementUserQuestionCount } from "@/lib/user"
import { queryDocument } from "@/lib/document-processor"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    const isAuthenticated = !!session?.user

    // Get request body
    const { message, userId, fileName } = await request.json()

    if (!message || !userId || !fileName) {
      return NextResponse.json({ error: "Message, userId, and fileName are required" }, { status: 400 })
    }

    // If not authenticated, check if they've used their 5 free questions
    if (!isAuthenticated) {
      const anonymousId = userId
      const questionCount = await getUserQuestionCount(anonymousId)

      // If they've used all 5 questions, return an error
      if (questionCount >= 5) {
        return NextResponse.json(
          { error: "Question limit reached. Please sign up or log in to continue." },
          { status: 403 },
        )
      }

      // Increment question count
      await incrementUserQuestionCount(anonymousId)
    }

    // Query the document using Gemini API
    const response = await queryDocument(message, userId, fileName)

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
