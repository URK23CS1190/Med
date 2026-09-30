import { NextResponse } from "next/server";
import { getOtpFromStore, deleteOtpFromStore } from "../send-otp/route";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { phone, email, code } = body;

        const destination = (phone || email || "").trim();
        const inputCode = (code || "").trim();

        if (!destination || !inputCode) {
            return NextResponse.json({ success: false, error: "Destination and verification code are required" }, { status: 400 });
        }

        const storedCode = getOtpFromStore(destination.toLowerCase());

        // Accept stored OTP, or demo master codes 123456 / 654321
        const isValid = (storedCode && storedCode === inputCode) || inputCode === "123456" || inputCode === "654321";

        if (!isValid) {
            return NextResponse.json({
                success: false,
                error: "Invalid verification code. Please check the code sent to your phone/email or use demo code 123456."
            }, { status: 400 });
        }

        // Clean up OTP after successful verification
        deleteOtpFromStore(destination.toLowerCase());

        return NextResponse.json({
            success: true,
            verified: true,
            message: "OTP verified successfully!",
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err?.message || "OTP verification failed" }, { status: 500 });
    }
}
