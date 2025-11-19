import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import type { User } from "next-auth"

const ALLOWED_EMAILS = [
    "martin00dan@gmail.com",
    "reveille.bubbletea@gmail.com"
]

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("Missing GOOGLE_CLIENT_ID environment variable")
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing GOOGLE_CLIENT_SECRET environment variable")
}
if (!process.env.NEXTAUTH_SECRET) {
    throw new Error("Missing NEXTAUTH_SECRET environment variable")
}

export const authOptions = {
    //auth providers
    providers: [
        GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user }: { user?: User | null }) {
            if (!user || !user.email) {
                return false;
            }

            if (ALLOWED_EMAILS.includes(user.email)) {  
                return true;
            }
            return '/auth/error';
        }
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }