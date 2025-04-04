import "next-auth";
import { UserType } from "@prisma/client";

declare module "next-auth" {
  interface User {
    role?: UserType;
    id?: string;
  }
  
  interface Session {
    user: {
      id?: string;
      role?: UserType;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserType;
    id?: string;
  }
}