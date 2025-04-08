// app/api/admin/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'

// Helper function to check admin authorization
async function isAuthorized() {
  const session = await getServerSession(authOptions)
  return session?.user?.role === 'admin'
}

export async function PUT(request: NextRequest) {
  try {
    // Check if user is authorized
    const authorized = await isAuthorized()
    if (!authorized) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized access'
      }, { status: 403 })
    }

    const { action, ...data } = await request.json()

    switch (action) {
      case 'updatePersona':
        return await updatePersona(data)
      case 'updateModelConfig':
        return await updateModelConfig(data)
      case 'updateSystemPrompt':
        return await updateSystemPrompt(data)
      case 'updateUser':
        return await updateUser(data)
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Error in admin API:', error)
    return NextResponse.json({
      success: false,
      error: 'Server error'
    }, { status: 500 })
  }
}

async function updatePersona(formData: any) {
  try {
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

    // Create a new record or update the existing one
    const operation = formData.id 
      ? prisma.personaProfile.update({ where: { id: formData.id }, data: personaData })
      : prisma.personaProfile.create({ data: personaData })

    const result = await operation

    return NextResponse.json({
      success: true,
      data: result
    }, { status: 200 })
  } catch (error) {
    console.error('Error updating persona profile:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update persona profile'
    }, { status: 500 })
  }
}

async function updateModelConfig(data: any) {
  try {
    // If setting as default, clear default status from other models first
    if (data.isDefault) {
      await prisma.modelConfig.updateMany({
        data: { isDefault: false }
      })
    }

    // Create or update model config
    const operation = data.id
      ? prisma.modelConfig.update({
          where: { id: data.id },
          data: {
            name: data.name,
            provider: data.provider,
            modelId: data.modelId,
            isDefault: data.isDefault
          }
        })
      : prisma.modelConfig.create({
          data: {
            name: data.name,
            provider: data.provider,
            modelId: data.modelId,
            isDefault: data.isDefault
          }
        })

    const result = await operation

    return NextResponse.json({
      success: true,
      data: result
    }, { status: 200 })
  } catch (error) {
    console.error('Error updating model config:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update model configuration'
    }, { status: 500 })
  }
}

async function updateSystemPrompt(data: any) {
  try {
    // If setting as active, clear active status from other prompts first
    if (data.isActive) {
      await prisma.systemPrompt.updateMany({
        data: { isActive: false }
      })
    }

    // Create or update system prompt
    const operation = data.id
      ? prisma.systemPrompt.update({
          where: { id: data.id },
          data: {
            content: data.content,
            isActive: data.isActive
          }
        })
      : prisma.systemPrompt.create({
          data: {
            content: data.content,
            isActive: data.isActive
          }
        })

    const result = await operation

    return NextResponse.json({
      success: true,
      data: result
    }, { status: 200 })
  } catch (error) {
    console.error('Error updating system prompt:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update system prompt'
    }, { status: 500 })
  }
}

async function updateUser(data: any) {
  try {
    // Handle user creation/update logic here
    // Note: For security reasons, we'd need proper password handling
    // This is a placeholder for the actual implementation
    const userData = {
      name: data.name,
      email: data.email,
      type: data.type,
      // Password handling would need proper hashing logic
      ...(data.password ? { password: data.password } : {})
    }

    const operation = data.id
      ? prisma.user.update({
          where: { id: data.id },
          data: userData
        })
      : prisma.user.create({
          data: {
            ...userData,
            password: data.password // Assuming password is already hashed by the frontend
          }
        })

    const result = await operation

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        password: undefined // Don't send password back to client
      }
    }, { status: 200 })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update user'
    }, { status: 500 })
  }
}

// GET handler to retrieve various admin data
export async function GET(request: NextRequest) {
  try {
    // Check if user is authorized
    const authorized = await isAuthorized()
    if (!authorized) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized access'
      }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const resource = searchParams.get('resource')

    switch (resource) {
      case 'personas':
        return await getPersonas()
      case 'persona':
        const personaId = searchParams.get('id')
        return await getPersona(personaId ? parseInt(personaId) : null)
      case 'models':
        return await getModels()
      case 'systemPrompts':
        return await getSystemPrompts()
      case 'users':
        return await getUsers()
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid resource'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Error retrieving data:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve data'
    }, { status: 500 })
  }
}

async function getPersonas() {
  const personas = await prisma.personaProfile.findMany({
    orderBy: { updatedAt: 'desc' }
  })
  
  return NextResponse.json({
    success: true,
    data: personas
  }, { status: 200 })
}

async function getPersona(id: number | null) {
  if (!id) {
    const persona = await prisma.personaProfile.findFirst()
    
    if (!persona) {
      return NextResponse.json({
        success: false,
        error: 'No profile found'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: persona
    }, { status: 200 })
  }
  
  const persona = await prisma.personaProfile.findUnique({
    where: { id }
  })
  
  if (!persona) {
    return NextResponse.json({
      success: false,
      error: 'Profile not found'
    }, { status: 404 })
  }
  
  return NextResponse.json({
    success: true,
    data: persona
  }, { status: 200 })
}

async function getModels() {
  const models = await prisma.modelConfig.findMany({
    orderBy: { name: 'asc' }
  })
  
  return NextResponse.json({
    success: true,
    data: models
  }, { status: 200 })
}

async function getSystemPrompts() {
  const prompts = await prisma.systemPrompt.findMany({
    orderBy: { updatedAt: 'desc' }
  })
  
  return NextResponse.json({
    success: true,
    data: prompts
  }, { status: 200 })
}

async function getUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      type: true,
      createdAt: true,
      // Don't include password
    },
    orderBy: { name: 'asc' }
  })
  
  return NextResponse.json({
    success: true,
    data: users
  }, { status: 200 })
}

// DELETE handler to remove resources
export async function DELETE(request: NextRequest) {
  try {
    // Check if user is authorized
    const authorized = await isAuthorized()
    if (!authorized) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized access'
      }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const resource = searchParams.get('resource')
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID is required'
      }, { status: 400 })
    }

    switch (resource) {
      case 'persona':
        return await deletePersona(parseInt(id))
      case 'model':
        return await deleteModel(parseInt(id))
      case 'systemPrompt':
        return await deleteSystemPrompt(parseInt(id))
      case 'user':
        return await deleteUser(id)
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid resource'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Error deleting resource:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete resource'
    }, { status: 500 })
  }
}

async function deletePersona(id: number) {
  await prisma.personaProfile.delete({
    where: { id }
  })
  
  return NextResponse.json({
    success: true,
    message: 'Persona deleted successfully'
  }, { status: 200 })
}

async function deleteModel(id: number) {
  await prisma.modelConfig.delete({
    where: { id }
  })
  
  return NextResponse.json({
    success: true,
    message: 'Model configuration deleted successfully'
  }, { status: 200 })
}

async function deleteSystemPrompt(id: number) {
  await prisma.systemPrompt.delete({
    where: { id }
  })
  
  return NextResponse.json({
    success: true,
    message: 'System prompt deleted successfully'
  }, { status: 200 })
}

async function deleteUser(id: string) {
  await prisma.user.delete({
    where: { id }
  })
  
  return NextResponse.json({
    success: true,
    message: 'User deleted successfully'
  }, { status: 200 })
}