import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.json()
    
    // Format the data to match Prisma schema
    const personaData = {
      // Basic Information
      fullName: formData.fullName,
      age: parseInt(formData.age),
      residence: formData.residence,
      passion: formData.passion,

      // Personality & Traits
      characterTraits: formData.characterTraits,
      otherTrait: formData.otherTrait || null,
      roleModel: formData.roleModel || null,
      personalValues: formData.personalValues,

      // Skills & Experience
      expertise: formData.expertise,
      experienceLevel: formData.experienceLevel,
      achievements: formData.achievements,
      dailyRoutine: formData.dailyRoutine,

      // Challenges & Growth
      obstacles: formData.obstacles,
      overcomingChallenges: formData.overcomingChallenges,
      handlingPressure: formData.handlingPressure,

      // Future Goals & Aspirations
      tenYearVision: formData.tenYearVision,
      fieldChange: formData.fieldChange,
      bestAdvice: formData.bestAdvice,

      // Conversation Starters
      conversationStarter1: formData.conversationStarter1,
      conversationStarter2: formData.conversationStarter2 || null,
      conversationStarter3: formData.conversationStarter3 || null,
      conversationStarter4: formData.conversationStarter4 || null,
    }

    // Get the first record or create one if it doesn't exist (upsert)
    const updatedProfile = await prisma.personaProfile.upsert({
      where: { id: 1 }, // Always update the first record
      update: personaData,
      create: { id: 1, ...personaData } // Force ID to be 1 for the first record
    })

    return NextResponse.json({ 
      success: true, 
      data: updatedProfile 
    }, { status: 200 })
  } catch (error) {
    console.error('Error updating persona profile:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update persona profile' 
    }, { status: 500 })
  }
}

// GET handler to retrieve the profile
export async function GET() {
  try {
    // Get the first profile or null if none exists
    const profile = await prisma.personaProfile.findFirst()
    
    if (!profile) {
      return NextResponse.json({ 
        success: false, 
        error: 'No profile found' 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      data: profile 
    }, { status: 200 })
  } catch (error) {
    console.error('Error retrieving persona profile:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to retrieve persona profile' 
    }, { status: 500 })
  }
}