import type { DefaultUser } from 'next-auth';
import type { UserType } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user?: DefaultUser & {
      id: string;
      role?: UserType;
    };
  }
  
  interface User {
    id: string;
    type?: UserType;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: UserType;
  }
}