// @ts-nocheck
// Supabase Edge Function: verify-provider
// Validates provider documents and updates verification status

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
    try {
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        const { provider_id, action, reason } = await req.json();

        if (!provider_id || !action) {
            return new Response(
                JSON.stringify({ error: "provider_id and action required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const status = action === "approve" ? "verified" : "rejected";

        const { error } = await supabase
            .from("providers")
            .update({
                verification_status: status,
                rejection_reason: action === "reject" ? reason : null,
            })
            .eq("id", provider_id);

        if (error) throw error;

        // TODO: Send notification to provider about verification result
        // TODO: Log audit event

        return new Response(
            JSON.stringify({ success: true, status }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Verification error:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
});
