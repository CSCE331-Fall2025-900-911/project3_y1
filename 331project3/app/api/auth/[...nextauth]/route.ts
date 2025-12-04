import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import type { User } from "next-auth"
import { getDbPool } from "@/lib/db";

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

        authorization: {
            params: {
                prompt: "select_account"
            }
        }
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user }: { user?: User | null }) {
            if (!user || !user.email) {
                return false;
            }

            let client;
            try {
                const pool = getDbPool();
                client = await pool.connect();

                const query = "SELECT 1 FROM allowedemails WHERE email = $1";
                const result = await client.query(query, [user.email]);

                if ((result?.rowCount ?? 0) > 0) {
                    return true;
                } else {
                    return '/auth/error';
                }
            } catch (error) {
                console.error('Database signIn error:', error);
                return false;
            } finally {
                if (client) {
                    client.release();
                }
            }
        }
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }