import { db } from "@/lib/db";
import { verifyAccessToken } from "@/lib/utils/token";
import { users } from "@/schemas/user.schema";
import { eq, getTableColumns } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization')
        const token = authHeader.split(" ")[1]
        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = await verifyAccessToken(token);

        const { password, ...rest } = getTableColumns(users);
        const [user] = await db
            .select({
                ...rest,
            })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        return NextResponse.json({ message:"User found",User_Data:user }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
