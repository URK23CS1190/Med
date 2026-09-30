// @ts-nocheck
// Supabase Edge Function: process-payment
// Handles Razorpay/Stripe payment processing

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID");
const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");

serve(async (req) => {
    try {
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        const { amount, currency, patient_id, description } = await req.json();

        // Create Razorpay order
        const orderResponse = await fetch("https://api.razorpay.com/v1/orders", {
            method: "POST",
            headers: {
                Authorization: `Basic ${btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                amount: amount * 100, // Razorpay expects paise
                currency: currency || "INR",
                notes: { patient_id, description },
            }),
        });

        const order = await orderResponse.json();

        // Save payment record
        const { data, error } = await supabase.from("payments").insert({
            patient_id,
            amount,
            currency: currency || "INR",
            gateway: "razorpay",
            gateway_order_id: order.id,
            status: "pending",
        }).select().single();

        if (error) throw error;

        return new Response(
            JSON.stringify({ success: true, order_id: order.id, payment_id: data.id }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Payment processing error:", error);
        return new Response(
            JSON.stringify({ error: "Payment processing failed" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
});
