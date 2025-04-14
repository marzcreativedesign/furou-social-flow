
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.9";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const receivingEmail = "suportefurou@gmail.com";

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({ error: "Email inválido" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Store email in Supabase
    const { error: dbError } = await supabase
      .from("email_subscriptions")
      .insert([{ email, created_at: new Date().toISOString() }]);

    if (dbError) {
      console.error("Error storing email:", dbError);
      
      // If the error is about duplicate emails, we'll handle it gracefully
      if (dbError.message.includes("duplicate") || dbError.code === "23505") {
        return new Response(
          JSON.stringify({ success: true, message: "Email já registrado" }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
      
      throw dbError;
    }

    console.log(`New subscription from: ${email}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email registrado com sucesso" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error in collect-email function:", error);
    
    return new Response(
      JSON.stringify({ error: "Erro ao processar a solicitação" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
