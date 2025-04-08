// prisma/seed-alt.ts
import { PrismaClient, UserType } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

// Simple password hashing function using Node's crypto module
function hashPassword(password: string): string {
  return crypto
    .createHash('sha256')
    .update(password + 'some-salt-value')
    .digest('hex')
}

async function main() {
  // Default users to create
  const users = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: hashPassword('1234'),
      type: 'user' as UserType,
    },
    {
      name: 'Admin User',
      email: 'admin@personaai.com',
      password: hashPassword('admin123'),
      type: 'admin' as UserType,
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      password: hashPassword('pass123'),
      type: 'user' as UserType,
    },
    {
      name: 'Mike Wilson',
      email: 'mike@personaai.com',
      password: hashPassword('mike2023'),
      type: 'admin' as UserType,
    },
  ]

  console.log('Starting to seed users...')

  // Create users (handle potential conflicts)
  for (const user of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    })

    if (existingUser) {
      console.log(`User with email ${user.email} already exists, updating...`)
      await prisma.user.update({
        where: { email: user.email },
        data: user,
      })
    } else {
      await prisma.user.create({
        data: user,
      })
      console.log(`Created user: ${user.name} (${user.email})`)
    }
  }

  console.log('Seeding completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })