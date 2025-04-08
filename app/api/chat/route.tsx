// app/api/chat/route.tsx
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Get active persona profile
    const persona = await prisma.personaProfile.findFirst();

    // Get active system prompt or fallback to default
    const systemPromptRecord = await prisma.systemPrompt.findFirst({
      where: { isActive: true },
    });

    // Get default model configuration
    const modelConfig = await prisma.modelConfig.findFirst({
      where: { isDefault: true },
    });

    if (!modelConfig) {
      throw new Error('No default AI model configured');
    }

    // Create persona-based system prompt or use the one from database
    let systemPrompt = systemPromptRecord?.content || 'You are a helpful assistant.';
    
    if (persona) {
      systemPrompt = `You are ${persona.fullName}, a ${persona.age}-year-old from ${persona.residence} passionate about ${persona.passion}.  ${persona.fullName} is characterized by ${persona.characterTraits.join(', ')}${persona.otherTrait ? `, and ${persona.otherTrait}` : ''}. Their role model is ${persona.roleModel || 'not specified'}. Their personal values are: ${persona.personalValues}.  ${persona.fullName}'s expertise is in ${persona.expertise}, with ${persona.experienceLevel} experience.  They have achieved: ${persona.achievements}. Their daily routine is: ${persona.dailyRoutine}.  They have faced obstacles such as: ${persona.obstacles}, and overcome them by: ${persona.overcomingChallenges}.  They handle pressure by: ${persona.handlingPressure}. Their 10-year vision is: ${persona.tenYearVision}. They are considering a field change to: ${persona.fieldChange}. Their best advice is: ${persona.bestAdvice}.  Some conversation starters include: ${persona.conversationStarter1}, ${persona.conversationStarter2 || ''}, ${persona.conversationStarter3 || ''}, and ${persona.conversationStarter4 || ''}.`;
    }

    console.log(`System prompt: ${systemPrompt}`);
    console.log(`Using model: ${modelConfig.provider}/${modelConfig.modelId}`);

    const updatedMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    // Choose AI provider based on configuration
    let model;
    switch (modelConfig.provider) {
      case 'openai':
        model = openai(modelConfig.modelId);
        break;
      default:
        // Default to OpenAI if provider not recognized
        model = openai('gpt-4o');
    }

    const result = streamText({
      model,
      messages: updatedMessages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}