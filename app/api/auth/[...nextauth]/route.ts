import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {},

            async authorize(credentials: any) {
                const { email, password } = credentials;

                try {
                    await connectMongoDB();

                    const user = await User.findOne({ email })

                    if (!user) {
                        return null;
                    }

                    const authenticated = await bcrypt.compare(password, user.password);

                    if (!authenticated) {
                        return null;
                    }

                    return user;

                } catch (error) {
                    console.error(error);
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/"
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };