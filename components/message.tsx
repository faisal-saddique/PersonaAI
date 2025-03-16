"use client"

import type React from "react"
import { useState } from "react"
import Markdown from "markdown-to-jsx"
import cx from "../utils/cx"
import type { Message as MessageProps } from "ai/react"
import PersonaAILogo from "./personaai-logo"
import { Copy, ThumbsDown, ThumbsUp, User, X } from "lucide-react"

const Message: React.FC<MessageProps> = ({ content, role }) => {
  const isUser = role === "user"
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState<boolean | null>(null)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <article className={cx("mb-4 flex gap-4", isUser ? "flex-row" : "flex-row")}>
      <Avatar isUser={isUser} />

      <div className={cx("flex-1 overflow-hidden", isUser ? "message-bubble-user" : "message-bubble-bot")}>
        <Markdown
          className="prose prose-invert max-w-none"
          options={{
            overrides: {
              ol: ({ children }) => <ol className="list-decimal pl-6 my-2">{children}</ol>,
              ul: ({ children }) => <ul className="list-disc pl-6 my-2">{children}</ul>,
              p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
              code: ({ children }) => <code className="bg-background/30 px-1 py-0.5 rounded text-sm">{children}</code>,
            },
          }}
        >
          {content}
        </Markdown>

        {/* Action buttons - only show for bot messages */}
        {!isUser && (
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/10">
            <button
              onClick={copyToClipboard}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
              aria-label="Copy message"
            >
              <Copy size={16} />
            </button>
            <button
              onClick={() => setLiked(true)}
              className={cx(
                "p-1.5 rounded-full hover:bg-white/10 transition-colors",
                liked === true ? "text-emerald-500" : "text-white/70 hover:text-white",
              )}
              aria-label="Like message"
            >
              <ThumbsUp size={16} />
            </button>
            <button
              onClick={() => setLiked(false)}
              className={cx(
                "p-1.5 rounded-full hover:bg-white/10 transition-colors",
                liked === false ? "text-red-500" : "text-white/70 hover:text-white",
              )}
              aria-label="Dislike message"
            >
              <ThumbsDown size={16} />
            </button>

            {/* Feedback tooltip */}
            {copied && <span className="text-xs text-white/90 ml-auto">Copied!</span>}
            {liked !== null && <span className="text-xs text-white/90 ml-auto">Thanks for your feedback!</span>}
          </div>
        )}
      </div>
    </article>
  )
}

const Avatar: React.FC<{ isUser?: boolean; className?: string }> = ({ isUser = false, className }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Avatar Clickable */}
      <div
        onClick={() => !isUser && setIsOpen(true)}
        className={cx(
          "flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0 transition-transform",
          isUser ? "bg-primary/20 text-primary" : "bg-secondary/20 text-secondary",
          !isUser && "cursor-pointer hover:scale-110",
          className,
        )}
      >
        {isUser ? <User size={18} /> : <PersonaAILogo />}
      </div>

      {/* Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
          <div className="bg-card p-6 rounded-2xl shadow-lg w-80 text-center relative animate-fade-in">
            <button
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-muted transition-colors"
              onClick={() => setIsOpen(false)}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
            <div className="w-full flex items-center justify-center py-5">
              <div className="h-24 w-24 rounded-full overflow-hidden bg-gradient-to-r from-primary to-secondary p-1">
                <div className="h-full w-full rounded-full overflow-hidden bg-muted">
                  <img src="/anime-verse-logo.svg" alt="PersonaAI" className="p-4" />
                </div>
              </div>
            </div>
            <h3 className="mt-2 text-xl font-display font-bold text-foreground">PersonaAI</h3>
            <p className="mt-2 text-muted-foreground text-sm">
              Bringing your favorite anime characters to life through advanced AI technology.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <span className="badge-primary">AI-Powered</span>
              <span className="badge-secondary">Character Chat</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Message
export { Avatar }

