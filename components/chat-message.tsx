import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  message: {
    role: "user" | "assistant" | "system"
    content: string
  }
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-lg",
        message.role === "user"
          ? "bg-gray-100"
          : message.role === "system"
            ? "bg-blue-50 border border-blue-100"
            : "bg-white border border-gray-100",
      )}
    >
      <Avatar
        className={cn(
          "h-8 w-8",
          message.role === "user" ? "bg-gray-300" : message.role === "system" ? "bg-blue-500" : "bg-[#00adb5]",
        )}
      >
        <AvatarFallback>{message.role === "user" ? "U" : message.role === "system" ? "S" : "AI"}</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="font-medium">
          {message.role === "user" ? "You" : message.role === "system" ? "System" : "AI Assistant"}
        </div>
        <div className="mt-1 text-sm whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  )
}
