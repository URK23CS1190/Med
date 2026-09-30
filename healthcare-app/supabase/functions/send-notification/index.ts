// @ts-nocheck
// Supabase Edge Function: send-notification
// Sends push/email notifications via Resend

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

serve(async (req) => {
    try {
        const { type, recipient, subject, body } = await req.json();

        if (type === "email") {
            const response = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${RESEND_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    from: "MedCare <notifications@medcare.health>",
                    to: recipient,
                    subject,
                    html: body,
                }),
            });
            const result = await response.json();
            return new Response(JSON.stringify({ success: true, result }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

        if (type === "push") {
            // TODO: Implement web push via Service Worker
            console.log(`Push notification to ${recipient}: ${subject}`);
            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(
            JSON.stringify({ error: "Invalid notification type" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Notification error:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
});
