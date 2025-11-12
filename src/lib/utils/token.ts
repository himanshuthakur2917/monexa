import { JwtData } from "@/interfaces/tokens";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import redisClient from "../redisDB";

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

export const generateAccessToken = async (tokenPayload: JwtData) => {
    const {exp,iat,...cleanPayload} = tokenPayload
    const token = jwt.sign(cleanPayload, process.env.ACCESS_SECRET!, {
        expiresIn: process.env.ACCESS_EXPIRES_IN || "15min",
    } as jwt.SignOptions);
    return token;
};

export const generateRefreshToken = async (tokenPayload: JwtData) => {
    const {exp,iat,...cleanPayload} = tokenPayload
    const token = jwt.sign(cleanPayload, process.env.REFRESH_SECRET!, {
        expiresIn: process.env.REFRESH_EXPIRES_IN || "3d",
    } as jwt.SignOptions);
    return token;
};

export async function storeRefreshToken(userId: string, token: string) {
  await redisClient.set(`refresh:${userId}`, token, {EX:7*24*60*60}); // 7 days
}

export const verifyAccessToken = async (token: string) => {
    try {
       const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET!) as JwtData
       return decodedToken.id
    } catch (error) {
        throw new Error("Invalid token :",error);
    }
}

export const verifyRefreshToken = async (token: string) => {
    try {
       const decodedToken = jwt.verify(token, process.env.REFRESH_SECRET!) as JwtData
       const storedToken = await redisClient.get(`refresh:${decodedToken.id}`)
        if (storedToken !== token) throw new Error("Invalid token");
       return decodedToken
    } catch (error) {
        throw new Error(`Verify Token Error : ${error}`);
    }
}
