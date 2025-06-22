import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      }
    })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    )

    const { current_user_id } = await req.json()

    if (!current_user_id) {
      return new Response(
        JSON.stringify({ error: 'Missing user ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // تحويل ID إلى عدد صحيح إذا كان مرسلاً كسلسلة
    const userId = parseInt(current_user_id, 10);
    if (isNaN(userId)) {
      throw new Error('Invalid user ID format');
    }

    const { data, error } = await supabase.rpc('get_latest_messages_per_contact', {
      user_id_input: userId
    })

    if (error) throw error

    return new Response(JSON.stringify(data), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
    })

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.details || 'No additional details'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})