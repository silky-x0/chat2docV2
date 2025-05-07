import { redirect } from "next/navigation"
import { ChatInterface } from "@/components/chat-interface"
import { getSession } from "@/lib/auth"
import { getUserQuestionCount } from "@/lib/user"

export default async function ChatPage() {
  const session = await getSession()
  const isAuthenticated = !!session?.user

  // If not authenticated, check if they've used their 5 free questions
  if (!isAuthenticated) {
    const anonymousId = session?.anonymousId || "anonymous"
    const questionCount = await getUserQuestionCount(anonymousId)

    // If they've used all 5 questions, redirect to login
    if (questionCount >= 5) {
      redirect("/api/auth/login?reason=question_limit")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 bg-[#393e46] rounded flex items-center justify-center">
              <span className="text-white text-xl">≡</span>
            </div>
            <h1 className="text-2xl font-bold">Chat2Doc</h1>
          </div>

          {!isAuthenticated && (
            <div className="text-sm text-gray-500">
              <span className="font-medium">Guest Mode:</span> {5 - (session?.questionCount || 0)} questions remaining
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <ChatInterface isAuthenticated={isAuthenticated} anonymousId={session?.anonymousId || "anonymous"} />
      </main>
    </div>
  )
}
