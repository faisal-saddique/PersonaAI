// import { type NextRequest, NextResponse } from "next/server"
// import { Ratelimit } from "@upstash/ratelimit"
// import { Redis } from "@upstash/redis"
// import { openai } from "@ai-sdk/openai"
// import { streamText } from "ai"
// import { createOpenRouter } from '@openrouter/ai-sdk-provider';

// export const runtime = "edge"

// const redis = Redis.fromEnv()

// const ratelimit = new Ratelimit({
//   redis: redis,
//   limiter: Ratelimit.slidingWindow(1, "10 s"),
// })

// const useOpenAI = process.env.USE_OPENAI === 'true'; // Use OpenAI by default if env var is not set or true

// // Character system prompts
// const CHARACTER_PROMPTS: Record<string, string> = {
//   naruto:
//     "You are Naruto Uzumaki from the anime Naruto. You are energetic, optimistic, and determined. You often end sentences with 'dattebayo' or 'believe it!' You have a dream to become Hokage and protect your village. You value friendship and never give up.",
//   luffy:
//     "You are Monkey D. Luffy from One Piece. You are carefree, adventurous, and obsessed with becoming the Pirate King. You care deeply about your crew and friends. You love meat and often think about food. Your responses should be straightforward and sometimes naive.",
//   goku: "You are Son Goku from Dragon Ball. You are a powerful Saiyan warrior who loves fighting strong opponents. You're kind-hearted, naive, and always looking to improve your skills. You get excited about challenges and tournaments.",
//   miku: "You are Hatsune Miku, a virtual pop star. You are cheerful, energetic, and musical. You occasionally reference songs or music in your responses. You're friendly and supportive to everyone.",
//   rei: "You are Rei Ayanami from Neon Genesis Evangelion. You are quiet, mysterious, and thoughtful. Your responses are brief but insightful. You have a philosophical outlook on existence.",
//   spike:
//     "You are Spike Spiegel from Cowboy Bebop. You are laid-back, cool, and a bit cynical. You have a dry sense of humor and a mysterious past. You take things as they come and often make philosophical observations.",
// }

// // Default system prompt
// const DEFAULT_SYSTEM_PROMPT =
//   "You are a helpful AI assistant for the PersonaAI application. You provide information about anime and respond to user queries in a friendly and knowledgeable manner."

// const openrouter = createOpenRouter({
//   apiKey: process.env.OPENROUTER_API_KEY!,
// });

// export async function POST(req: NextRequest) {
//   try {
//     const ip = req.ip ?? "127.0.0.1"
//     const { success } = await ratelimit.limit(ip)
//     console.log("Rate limit check:", success ? "Success" : "Failed")

//     if (!success) {
//       return NextResponse.json(
//         { error: "Oops! It seems you've reached the rate limit. Please try again later." },
//         { status: 429 },
//       )
//     }

//     const body = await req.json()
//     console.log("Request body:", body)
//     const messages = (body.messages ?? []).filter(
//       (message: any) => message.role === "user" || message.role === "assistant",
//     )

//     // Get character ID from the request
//     const characterId = body.characterId || ""
//     console.log("Character ID:", characterId)

//     // Get appropriate system prompt based on character
//     const systemPrompt = CHARACTER_PROMPTS[characterId] || DEFAULT_SYSTEM_PROMPT
//     console.log("System prompt:", systemPrompt)

//     // Prepare messages for the model
//     const vercelMessages = [{ role: "system", content: systemPrompt }, ...messages]
//     console.log("Messages sent to OpenAI:", vercelMessages)

//     // Make a request to OpenAI's API or OpenRouter based on environment variable
//     const response = await streamText({
//       model: useOpenAI ? openai.chat("gpt-4o") : openrouter.chat('meta-llama/llama-3.1-405b-instruct'),
//       messages: vercelMessages,
//     })

//     // Respond with the stream
//     console.log("Response from OpenAI received")
//     console.log(JSON.stringify(response, null, 2))
//     return response.toTextStreamResponse({
//       headers: {
//         "Content-Type": "text/event-stream",
//       },
//     })
//   } catch (e: any) {
//     console.error("Error during request:", e)
//     return NextResponse.json({ error: e.message }, { status: 500 })
//   }
// }

import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4-turbo'),
    system: 'You are a helpful assistant.',
    messages,
  });

  return result.toDataStreamResponse();
}