import { db } from "@/lib/db"
import { comparePassword, hashPassword } from "@/lib/utils/hash"
import { generateJwtToken } from "@/lib/utils/token";
import { LoginInput, RegisterInput } from "@/schemas/auth.schema"
import {users} from "@/schemas/user.schema"
import { and, eq, gt } from "drizzle-orm";


export const registerUser = async (data:RegisterInput) => { 
    try {
        const existingUser = await db.query.users.findFirst({
            where: (fields, { eq }) => eq(fields.email, data.email)
        })

        if (existingUser) {
            throw new Error("Email already exists")
        }

        const hashedPassword = await hashPassword(data.password)
        const { firstName, lastName, email } = data
        const newUser = await db.insert(users).values({
            firstName,
            lastName,
            email,
            password: hashedPassword
        }).returning()

        return newUser[0]

    } catch (error) {
        throw new Error("Failed to create user :", error.message)
    }
 }

export const loginUser = async (data:LoginInput) => {
    try {
        const { email, password } = data
        const existingUser = await db.query.users.findFirst({
            where: (fields, { eq }) => eq(fields.email, email)
        })

        if (!existingUser) {
            throw new Error("Invalid email or password")
        }

        const passwordMatch = await comparePassword(password, existingUser.password)

        if (!passwordMatch) {
            throw new Error("Invalid email or password")
        }

        const tokenPayload = {
            id: existingUser.id,
        }
        const jwtToken = await generateJwtToken(tokenPayload)

        return jwtToken

    } catch (error) {
        throw new Error("Failed to login user :", error.message)
    }
 }
 
export const verifyUser = async (hashedToken:string) => {
    try {
        const [user] = await db
            .select()
            .from(users)
            .where(
                and(
                    eq(users.verifyToken, hashedToken),
                    gt(users.verifyTokenExpiry, new Date(Date.now()))
                )
            );

        // Update user verification status
        const [updatedUser] = await db
            .update(users)
            .set({
                isVerified: "true",
                verifyToken: null,
                verifyTokenExpiry: null,
                updatedAt: new Date()
            })
            .where(eq(users.id, user.id))
            .returning();

        return {user,updatedUser};

    } catch (error) {
        throw new Error("Failed to verify user :", error.message)
    }
 }