import { EmailOptions } from "@/interfaces/emailOptions";
import nodemailer from "nodemailer";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { users } from "@/schemas/user.schema";
import { generateToken } from "./token"; 

const createVerifyEmailTemplate = (token: string) => `
<!DOCTYPE html>
<html>
<head>
    <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Verify Your Email Address</h2>
        <p>Thank you for registering! Please click the button below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.DOMAIN}/verify?token=${token}" 
               style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px;">
               Verify Email
            </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p>${process.env.DOMAIN}/verify?token=${token}</p>
        <p>This link will expire in 30 minutes.</p>
    </div>
</body>
</html>
`;

const createResetPasswordTemplate = (token: string) => `
<!DOCTYPE html>
<html>
<head>
    <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Reset Your Password</h2>
        <p>You requested to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.DOMAIN}/reset-password?token=${token}" 
               style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px;">
               Reset Password
            </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p>${process.env.DOMAIN}/reset-password?token=${token}</p>
        <p>This link will expire in 30 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
    </div>
</body>
</html>
`;

export const sendEmail = async ({ email, emailType, userId }: EmailOptions) => {
    try {
        let emailTemplate: string;
        let emailSubject: string;

        switch (emailType) {
            case "VERIFY":
                const {token: verifyToken, hashedToken: verifyHashedToken } = generateToken();
                await db
                    .update(users)
                    .set({
                        verifyToken: verifyHashedToken,
                        verifyTokenExpiry: new Date(Date.now() + 30 * 60 * 1000),
                    })
                    .where(eq(users.id, userId))
                    .returning();
                emailTemplate = createVerifyEmailTemplate(verifyToken);
                emailSubject = "Verify Your Email";
                break;

            case "RESET":
                const {token: resetToken, hashedToken: resetHashedToken } = generateToken();
                await db
                    .update(users)
                    .set({
                        forgotPasswordToken: resetHashedToken,
                        forgotPasswordTokenExpiry: new Date(Date.now() + 30 * 60 * 1000),
                    })
                    .where(eq(users.id, userId))
                    .returning();
                emailTemplate = createResetPasswordTemplate(resetToken);
                emailSubject = "Reset Your Password";
                break;

            default:
                throw new Error("Invalid email type");
        }

        const transporter = nodemailer.createTransport({
            service: 'smtp',
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: '"Monexa Support" <support@monexa.com>',
            to: email,
            subject: emailSubject,
            html: emailTemplate,
        };

        const mailResponse = await transporter.sendMail(mailOptions);
        console.log(mailResponse)
        return mailResponse;
    } catch (error) {
        console.log("Error Sending Mail");
        throw new Error(error.message as string);
    }
};
