export type UserRole = "user" | "admin"

export interface User {
  username: string
  password: string
  role: UserRole
  name?: string
  email?: string
}

export const USERS: User[] = [
  {
    username: "john",
    password: "1234",
    role: "user",
    name: "John Doe",
    email: "john@example.com",
  },
  {
    username: "admin",
    password: "admin123",
    role: "admin",
    name: "Admin User",
    email: "admin@PersonaAI.com",
  },
  {
    username: "sarah",
    password: "pass123",
    role: "user",
    name: "Sarah Johnson",
    email: "sarah@example.com",
  },
  {
    username: "mike",
    password: "mike2023",
    role: "admin",
    name: "Mike Wilson",
    email: "mike@PersonaAI.com",
  },
]

export const authenticateUser = (username: string, password: string): User | null => {
  const user = USERS.find((u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password)

  return user || null
}

