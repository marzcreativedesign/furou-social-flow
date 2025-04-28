
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Tratar requisições OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Obter parâmetros da requisição
    const { limit_count = 10 } = await req.json();
    
    // Criar cliente Supabase usando variáveis de ambiente
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Consulta SQL para buscar ranking de ausências (furões)
    const { data, error } = await supabaseClient
      .from('event_confirmations')
      .select(`
        user_id,
        count(*),
        profiles:user_id (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('status', 'declined')
      .group('user_id, profiles.id, profiles.full_name, profiles.avatar_url')
      .order('count', { ascending: false })
      .limit(limit_count);
    
    if (error) throw error;
    
    // Formatar dados para o formato esperado pelo frontend
    const rankingData = data.map(item => ({
      id: item.user_id,
      full_name: item.profiles.full_name,
      avatar_url: item.profiles.avatar_url,
      count: item.count
    }));
    
    // Retornar os dados com cabeçalhos CORS
    return new Response(
      JSON.stringify(rankingData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    // Retornar erro com cabeçalhos CORS
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  }
});
