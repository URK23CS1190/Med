import { NextResponse } from "next/server";

// In-memory store for OTP codes (Map of phone/email -> { code, expiresAt })
const otpStore = new Map<string, { code: string; expiresAt: number }>();

export function getOtpFromStore(key: string) {
    const data = otpStore.get(key);
    if (!data) return null;
    if (Date.now() > data.expiresAt) {
        otpStore.delete(key);
        return null;
    }
    return data.code;
}

export function deleteOtpFromStore(key: string) {
    otpStore.delete(key);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { phone, email } = body;

        const destination = (phone || email || "").trim();
        if (!destination) {
            return NextResponse.json({ success: false, error: "Phone number or email is required" }, { status: 400 });
        }

        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP with 10-minute expiration
        otpStore.set(destination.toLowerCase(), {
            code: otpCode,
            expiresAt: Date.now() + 10 * 60 * 1000,
        });

        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const apiKeySid = process.env.TWILIO_API_KEY_SID || process.env.TWILIO_ACCOUNT_SID;
        const apiSecret = process.env.TWILIO_API_KEY_SECRET || process.env.TWILIO_AUTH_TOKEN;

        let twilioStatus = "skipped";
        let twilioError: string | null = null;

        if (accountSid && apiKeySid && apiSecret && phone) {
            try {
                // Call Twilio REST API to dispatch SMS
                const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
                const credentials = Buffer.from(`${apiKeySid}:${apiSecret}`).toString("base64");

                const formData = new URLSearchParams();
                formData.append("To", phone);
                formData.append("From", "+18005550199"); // Fallback trial / service sender
                formData.append("Body", `Your MedCare verification code is: ${otpCode}. Valid for 10 minutes.`);

                const twilioRes = await fetch(twilioUrl, {
                    method: "POST",
                    headers: {
                        "Authorization": `Basic ${credentials}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: formData.toString(),
                });

                const twilioJson = await twilioRes.json();
                if (twilioRes.ok) {
                    twilioStatus = "sent";
                } else {
                    twilioStatus = "failed";
                    twilioError = twilioJson.message || "Twilio error";
                    console.warn("Twilio SMS send notification:", twilioJson);
                }
            } catch (err: any) {
                twilioStatus = "error";
                twilioError = err?.message || "Fetch error";
                console.warn("Twilio fetch error:", err);
            }
        }

        console.log(`[OTP Sent] Destination: ${destination} | Code: ${otpCode} | Twilio Status: ${twilioStatus}`);

        return NextResponse.json({
            success: true,
            message: `Verification code sent to ${destination}`,
            otpCode: process.env.NODE_ENV === "development" ? otpCode : undefined,
            twilioStatus,
            twilioError,
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err?.message || "Failed to send OTP" }, { status: 500 });
    }
}
