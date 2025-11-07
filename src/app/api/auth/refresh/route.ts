import { generateAccessToken, generateRefreshToken, storeRefreshToken, verifyRefreshToken } from "@/lib/utils/token";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const cookie = req.headers.get("cookie");
  const refreshToken = cookie?.split("refreshToken=")[1];
  if (!refreshToken) return NextResponse.json({ error: "No token" }, { status: 401 });

  try {
    const decodedToken = await verifyRefreshToken(refreshToken);
    const accessToken = await generateAccessToken(decodedToken);
    const newRefreshToken = await generateRefreshToken(decodedToken);
    await storeRefreshToken(decodedToken.id, newRefreshToken);

    const res = NextResponse.json({ accessToken });
    res.cookies.set("refresh_token", newRefreshToken, { httpOnly: true, secure: true});
    return res;
  } catch (e) {
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
  }
}
