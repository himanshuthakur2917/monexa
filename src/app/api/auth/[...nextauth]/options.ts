import "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // connect database first then write the below code
                try {
                    const user = {
                        // user through database by email or username

                        // Sample user object with required fields
                        _id: "1", // This should be the user's unique id from your database
                        email: "hello@gmail.com",
                        username: "hello.2",
                        password:"$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // hashed password for "password"
                        isVerified: true,
                    };

                    if (!user) {
                        throw new Error("No user found with the email");
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify your account first !!");
                    }

                    if (!credentials || !credentials.password) {
                        throw new Error("Credentials are missing");
                    }

                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordCorrect) {
                        throw new Error("Password is incorrect");
                    } else {
                        return user;
                    }
                } catch (err: unknown) {
                    throw new Error(String(err));
                }
            },
        }),
    ],

    callbacks: {
        async session({ session, token }) {
            if(token){
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.username = token.username
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.username = user.username
            }
            return token;
        },
    },

    pages: {
        signIn: "/sign-in",
    },
    secret : process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt" as const
    },
};
