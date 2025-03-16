import type React from "react"
import { Avatar } from "./message"

const MessageLoading: React.FC = () => {
  return (
    <article className="mb-4 flex gap-4">
      <Avatar />

      <div className="message-bubble-bot flex items-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-3 h-3 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-3 h-3 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      </div>
    </article>
  )
}

export default MessageLoading

