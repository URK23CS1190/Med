// @ts-nocheck
// Supabase Edge Function: send-otp
// Sends OTP via Twilio for phone-based authentication

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// const TWILIO_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
// const TWILIO_AUTH = Deno.env.get("TWILIO_AUTH_TOKEN");
// const TWILIO_FROM = Deno.env.get("TWILIO_PHONE_NUMBER");

serve(async (req) => {
    try {
        const { phone } = await req.json();
        if (!phone) {
            return new Response(JSON.stringify({ error: "Phone number required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // TODO: Store OTP in database with expiry
        // TODO: Send via Twilio Verify API
        console.log(`OTP ${otp} generated for ${phone}`);

        return new Response(
            JSON.stringify({ success: true, message: "OTP sent successfully" }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("OTP generation error:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
});
