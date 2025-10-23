import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lqrrjotvbmxbuyzjcoiz.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxcnJqb3R2Ym14YnV5empjb2l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTYwMDYsImV4cCI6MjA3NjczMjAwNn0.Q0kZeluRqlGQIZTjfsyV2hVV5huZ7JskcPQcgwbmvYs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Database types (auto-generated from Supabase)
export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name_th: string
          name_en: string
          icon: string | null
          display_order: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name_th: string
          name_en: string
          icon?: string | null
          display_order?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name_th?: string
          name_en?: string
          icon?: string | null
          display_order?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      menu_items: {
        Row: {
          id: string
          category_id: string | null
          name_th: string
          name_en: string
          description_th: string | null
          description_en: string | null
          price: number
          cost: number
          image_url: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          name_th: string
          name_en: string
          description_th?: string | null
          description_en?: string | null
          price: number
          cost?: number
          image_url?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          name_th?: string
          name_en?: string
          description_th?: string | null
          description_en?: string | null
          price?: number
          cost?: number
          image_url?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          table_number: string | null
          total_amount: number
          tax: number
          discount: number
          net_amount: number
          payment_method: 'cash' | 'credit' | 'qr' | null
          status: 'pending' | 'completed' | 'cancelled'
          cashier_id: string | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          order_number: string
          table_number?: string | null
          total_amount: number
          tax?: number
          discount?: number
          net_amount: number
          payment_method?: 'cash' | 'credit' | 'qr' | null
          status?: 'pending' | 'completed' | 'cancelled'
          cashier_id?: string | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          order_number?: string
          table_number?: string | null
          total_amount?: number
          tax?: number
          discount?: number
          net_amount?: number
          payment_method?: 'cash' | 'credit' | 'qr' | null
          status?: 'pending' | 'completed' | 'cancelled'
          cashier_id?: string | null
          created_at?: string
          completed_at?: string | null
        }
      }
      inventory: {
        Row: {
          id: string
          name_th: string
          name_en: string
          quantity: number
          unit: string
          min_stock: number
          supplier_id: string | null
          cost_per_unit: number
          created_at: string
          updated_at: string
        }
      }
      audit_log: {
        Row: {
          id: string
          action: string
          entity_type: string
          entity_id: string | null
          user_id: string | null
          details: any
          ip_address: string | null
          created_at: string
        }
      }
    }
  }
}

