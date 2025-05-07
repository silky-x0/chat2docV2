import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { processDocument } from "@/lib/document-processor"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    const isAuthenticated = !!session?.user

    // If not authenticated, check if they've used their 5 free uploads
    if (!isAuthenticated) {
      const anonymousId = session?.anonymousId || "anonymous"
      // You could implement a check here for upload limits
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const userId = formData.get("userId") as string

    if (!file || !userId) {
      return NextResponse.json({ error: "File and userId are required" }, { status: 400 })
    }

    // Process the PDF
    await processDocument(file, userId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PDF processing error:", error)
    return NextResponse.json({ error: "Failed to process PDF" }, { status: 500 })
  }
}
