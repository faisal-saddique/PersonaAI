// types.ts or utils/characters.ts
export interface Character {
  id: number;
  fullName: string;
  age: number;
  residence: string;
  passion: string;
  
  // Character info for sidebar display
  character_universe?: string; // Will be derived from expertise/passion
  description: string; // Will be composed from other fields
  personality: string; // Will be composed from characterTraits and personalValues
  scenario: string; // Will be derived from dailyRoutine or current activities
  
  // Original fields from the form
  characterTraits: string[];
  otherTrait?: string;
  roleModel?: string;
  personalValues: string;
  expertise: string;
  experienceLevel: string;
  achievements: string;
  dailyRoutine: string;
  obstacles: string;
  overcomingChallenges: string;
  handlingPressure: string;
  tenYearVision: string;
  fieldChange: string;
  bestAdvice: string;
  
  // Conversation starters
  conversation_starters: {
    starters: { content: string }[];
  };
  
  avatar?: string;
}

// A function to transform PersonaProfile data to Character format
export function transformProfileToCharacter(profile: any): Character {
  return {
    id: profile.id,
    fullName: profile.fullName,
    age: profile.age,
    residence: profile.residence,
    passion: profile.passion,
    
    // Derived fields for sidebar display
    character_universe: profile.expertise || profile.passion,
    description: `${profile.fullName} is a ${profile.age}-year-old from ${profile.residence} with a passion for ${profile.passion}. ${profile.achievements}`,
    personality: `${profile.characterTraits.join(', ')}${profile.otherTrait ? ', ' + profile.otherTrait : ''}. ${profile.personalValues}`,
    scenario: profile.dailyRoutine,
    
    // Original fields from the form
    characterTraits: profile.characterTraits,
    otherTrait: profile.otherTrait,
    roleModel: profile.roleModel,
    personalValues: profile.personalValues,
    expertise: profile.expertise,
    experienceLevel: profile.experienceLevel,
    achievements: profile.achievements,
    dailyRoutine: profile.dailyRoutine,
    obstacles: profile.obstacles,
    overcomingChallenges: profile.overcomingChallenges,
    handlingPressure: profile.handlingPressure,
    tenYearVision: profile.tenYearVision,
    fieldChange: profile.fieldChange,
    bestAdvice: profile.bestAdvice,
    
    // Conversation starters
    conversation_starters: {
      starters: [
        { content: profile.conversationStarter1 },
        ...(profile.conversationStarter2 ? [{ content: profile.conversationStarter2 }] : []),
        ...(profile.conversationStarter3 ? [{ content: profile.conversationStarter3 }] : []),
        ...(profile.conversationStarter4 ? [{ content: profile.conversationStarter4 }] : [])
      ]
    },
    
    // Use a placeholder avatar if none exists
    avatar: profile.avatar || `/api/placeholder/200/200?text=${encodeURIComponent(profile.fullName)}`
  };
}