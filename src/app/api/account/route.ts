
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
    try {
       

    } catch (error) {
        return NextResponse.json(
            { message : "Error in Accounts", error: error.message },
            { status: 400 }
        );
    }
}
