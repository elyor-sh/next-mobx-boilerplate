import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type User = {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
};

export type UserSession = Omit<User, "passwordHash">;

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET, // SET IN ENV !!!!!!!
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db().findOne(credentials.email);

        if (!user) {
          return null;
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as unknown as User).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        session.user!.id = token.id;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        session.user!.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};

function db() {
  const TMP_USERS: Record<string, User> = {
    "elyor@gmail.com": {
      id: 1,
      name: "Elyor",
      email: "elyor@gmail.com",
      passwordHash: "123456",
      role: "admin",
    },
  };

  return {
    async findOne(email: string): Promise<User | undefined> {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // sleep
      return TMP_USERS[email];
    },
  };
}
