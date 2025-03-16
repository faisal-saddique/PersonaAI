"use client"

import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { type Message as MessageProps, useChat } from "@ai-sdk/react"
import Form from "../components/form"
import Message from "../components/message"
import cx from "../utils/cx"
import PoweredBy from "../components/powered-by"
import MessageLoading from "../components/message-loading"
import { INITIAL_QUESTIONS } from "../utils/const"
import { useCharacter } from "../contexts/CharacterContext"
import { Sparkles } from "lucide-react"
import type { UserRole } from "../utils/users"

interface HomeProps {
  selectedCharacterName?: string
  isSidebarOpen?: boolean
  isLoggedIn?: boolean
  userRole?: UserRole
}

export default function Home({
  selectedCharacterName,
  isSidebarOpen = false,
  isLoggedIn = false,
  userRole,
}: HomeProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { selectedCharacter } = useCharacter()
  const initialQuestions = selectedCharacter?.conversation_starters.starters || INITIAL_QUESTIONS

  const [streaming, setStreaming] = useState<boolean>(false)
  const [showWelcome, setShowWelcome] = useState<boolean>(true)

  const { messages, input, handleInputChange, handleSubmit, setInput } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "0",
        role: "system",
        content: `**Welcome to PersonaAI**

PersonaAI is an advanced AI-powered platform that brings your favorite anime characters to life through immersive, dynamic role-playing interactions. Using cutting-edge AI models, PersonaAI generates detailed Character Persona Cards, complete with unique backgrounds, personalities, and conversation starters, allowing users to engage in authentic, in-character dialogues. Whether you're looking to chat with Naruto, Luffy, or any anime hero, our AI ensures a realistic and engaging experience, staying true to each character's personality and universe. Dive into the world of anime like never before with PersonaAI—where AI meets anime fandom!`,
      },
    ],
    onResponse: () => {
      setStreaming(false)
      setShowWelcome(false)
    },
  })

  const onClickQuestion = (value: string) => {
    setInput(value)
    setTimeout(() => {
      formRef.current?.dispatchEvent(
        new Event("submit", {
          cancelable: true,
          bubbles: true,
        }),
      )
    }, 1)
  }

  useEffect(() => {
    console.log(messages)
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      handleSubmit(e)
      setStreaming(true)
    },
    [handleSubmit],
  )

  return (
    <main
      className={cx(
        "relative bg-background max-w-4xl w-full p-4 md:p-6 mx-auto flex flex-col min-h-svh pt-10 md:pt-6",
        "transition-all duration-300 ease-in-out",
        isSidebarOpen ? "lg:mr-6" : "",
      )}
    >
      {/* Welcome Header - Show only when no messages */}
      {showWelcome && (
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="gradient-text mb-3">Welcome to PersonaAI</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Chat with your favorite anime characters powered by advanced AI. Select a character from the sidebar or
            start with a question below.
          </p>
        </div>
      )}

      <div className="w-full flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 space-y-4 mt-4">
          {messages.length > 1 &&
            messages.slice(1).map((message: MessageProps) => {
              return <Message key={message.id} {...message} />
            })}

          {/* Loading */}
          {streaming && <MessageLoading />}
        </div>

        {/* Bottom ref */}
        <div ref={messagesEndRef} />
      </div>

      {/* Initial Questions - Shown when no messages */}
      {messages.length === 1 && (
        <div className="mt-auto mb-6 grid md:grid-cols-2 gap-3 animate-fade-in">
          {initialQuestions.map((message) => (
            <button
              key={message.content}
              type="button"
              className="cursor-pointer select-none text-left w-full
                bg-muted text-foreground
                font-normal border border-border rounded-xl p-4
                hover:border-primary hover:bg-primary/5 transition-all
                flex items-start gap-2 group"
              onClick={() => onClickQuestion(message.content)}
            >
              <Sparkles size={16} className="text-primary mt-0.5 flex-shrink-0 group-hover:animate-pulse-slow" />
              <span>{message.content}</span>
            </button>
          ))}
        </div>
      )}

      {/* Bottom Input Box */}
      <div
        className={cx(
          "w-full mt-auto",
          "bg-background rounded-xl py-4",
          isSidebarOpen ? "lg:max-w-[calc(100%-2rem)]" : "lg:w-full",
          "mx-auto",
        )}
      >
        <Form
          ref={formRef}
          onSubmit={onSubmit}
          inputProps={{
            disabled: streaming,
            value: input,
            onChange: handleInputChange,
          }}
          buttonProps={{
            disabled: streaming,
          }}
        />
        <PoweredBy />
      </div>
    </main>
  )
}

