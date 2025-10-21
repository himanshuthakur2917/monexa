import { JwtData } from "@/interfaces/tokens";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export const generateToken = () => {
    const token = crypto.randomBytes(32).toString("base64");
    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("base64");
    return { token, hashedToken };
};

export const hashToken = (token: string) => {
    const newHashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("base64");
    return newHashedToken;
};

export const generateJwtToken = async (tokenPayload: JwtData) => {
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    } as jwt.SignOptions);
    return token;
};

export const verifyJwtToken = async (token: string) => {
    try {
       const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as JwtData
       return decodedToken.id
    } catch (error) {
        throw new Error("Invalid token");
    }
}
