import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { order_id } = await req.json()

    // Get order items
    const { data: orderItems, error: orderError } = await supabaseClient
      .from('order_items')
      .select('menu_item_id, quantity')
      .eq('order_id', order_id)

    if (orderError) throw orderError

    // Deduct inventory for each item
    for (const item of orderItems) {
      // This is a simplified example - in production, you'd have a mapping
      // between menu items and inventory items
      const { error: updateError } = await supabaseClient.rpc('deduct_inventory', {
        item_id: item.menu_item_id,
        qty: item.quantity
      })

      if (updateError) {
        console.error('Inventory update error:', updateError)
      }
    }

    // Log the inventory update
    await supabaseClient.from('audit_log').insert({
      action: 'inventory_deducted',
      entity_type: 'order',
      entity_id: order_id,
      details: { items: orderItems }
    })

    return new Response(
      JSON.stringify({ success: true, items_updated: orderItems.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})
