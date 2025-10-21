import { registerSchema } from "@/schemas/auth.schema";
import { registerUser } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";
import {sendEmail} from "@/lib/utils/mailer"
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const data = registerSchema.parse(body);

        const newUser = await registerUser(data);
        
        // send email verification mail
        await sendEmail({email:data.email,emailType:'VERIFY',userId : newUser.id})

        return NextResponse.json(
            { message : "User Created Successfully", user: newUser },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { message : "Error in Creating User", error: error.message },
            { status: 500 }
        );
    }
}
