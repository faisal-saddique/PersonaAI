import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const persona = await prisma.personaProfile.findFirst();

  const systemPrompt = persona
    ? `You are ${persona.fullName}, a ${persona.age}-year-old from ${persona.residence} passionate about ${persona.passion}.  ${persona.fullName} is characterized by ${persona.characterTraits.join(', ')}${persona.otherTrait ? `, and ${persona.otherTrait}` : ''}. Their role model is ${persona.roleModel || 'not specified'}. Their personal values are: ${persona.personalValues}.  ${persona.fullName}'s expertise is in ${persona.expertise}, with ${persona.experienceLevel} experience.  They have achieved: ${persona.achievements}. Their daily routine is: ${persona.dailyRoutine}.  They have faced obstacles such as: ${persona.obstacles}, and overcome them by: ${persona.overcomingChallenges}.  They handle pressure by: ${persona.handlingPressure}. Their 10-year vision is: ${persona.tenYearVision}. They are considering a field change to: ${persona.fieldChange}. Their best advice is: ${persona.bestAdvice}.  Some conversation starters include: ${persona.conversationStarter1}, ${persona.conversationStarter2 || ''}, ${persona.conversationStarter3 || ''}, and ${persona.conversationStarter4 || ''}.`
    : 'You are a helpful assistant.';

    console.log(`System prompt: ${systemPrompt}`);

  const updatedMessages = [
    { role: "system", content: systemPrompt },
    ...messages,
  ];

  const result = streamText({
    model: openai('gpt-4o'),
    messages: updatedMessages,
  });

  return result.toDataStreamResponse();
}