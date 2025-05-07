"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { FileUploader } from "./file-uploader"
import { ChatMessage } from "./chat-message"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
}

interface ChatInterfaceProps {
  isAuthenticated: boolean
  anonymousId: string
}

export function ChatInterface({ isAuthenticated, anonymousId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "system",
      content: "Upload a PDF document to start chatting!",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeFile, setActiveFile] = useState<File | null>(null)
  const [fileProcessed, setFileProcessed] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleFileUpload = async (file: File) => {
    setActiveFile(file)
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("userId", isAuthenticated ? "authenticated" : anonymousId)

      const response = await fetch("/api/process-pdf", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to process file")
      }

      setFileProcessed(true)
      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          role: "system",
          content: `File "${file.name}" uploaded successfully! You can now ask questions about it.`,
        },
      ])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process the PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || !fileProcessed) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          userId: isAuthenticated ? "authenticated" : anonymousId,
          fileName: activeFile?.name,
        }),
      })

      if (!response.ok) {
        // Check if we hit the question limit
        if (response.status === 403) {
          toast({
            title: "Question limit reached",
            description: "Please sign up or log in to continue asking questions.",
            variant: "default",
          })
          router.push("/api/auth/login?screen_hint=signup")
          return
        }

        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.response,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 rounded-lg border border-gray-200 bg-white">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChatMessage message={message} />
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center py-2">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {!fileProcessed ? (
        <FileUploader onFileUpload={handleFileUpload} isLoading={isLoading} />
      ) : (
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your document..."
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-[#00adb5] hover:bg-[#00adb5]/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
