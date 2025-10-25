import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type Tables = Database['public']['Tables']

// Categories Hook
export function useCategories() {
  const [categories, setCategories] = useState<Tables['categories']['Row'][]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchCategories()
    
    // Subscribe to realtime changes
    const channel = supabase
      .channel('categories-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'categories' },
        () => fetchCategories()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchCategories() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('active', true)
        .order('display_order')

      if (error) throw error
      setCategories(data || [])
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return { categories, loading, error, refetch: fetchCategories }
}

// Menu Items Hook
export function useMenuItems(categoryId?: string) {
  const [menuItems, setMenuItems] = useState<Tables['menu_items']['Row'][]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchMenuItems()

    // Subscribe to realtime changes
    const channel = supabase
      .channel('menu-items-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'menu_items' },
        () => fetchMenuItems()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [categoryId])

  async function fetchMenuItems() {
    try {
      setLoading(true)
      let query = supabase
        .from('menu_items')
        .select('*')
        .eq('active', true)

      if (categoryId) {
        query = query.eq('category_id', categoryId)
      }

      const { data, error } = await query

      if (error) throw error
      setMenuItems(data || [])
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return { menuItems, loading, error, refetch: fetchMenuItems }
}

// Orders Hook
export function useOrders(status?: string) {
  const [orders, setOrders] = useState<Tables['orders']['Row'][]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchOrders()

    // Subscribe to realtime changes
    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => fetchOrders()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [status])

  async function fetchOrders() {
    try {
      setLoading(true)
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query

      if (error) throw error
      setOrders(data || [])
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return { orders, loading, error, refetch: fetchOrders }
}

// Inventory Hook
export function useInventory() {
  const [inventory, setInventory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchInventory()

    // Subscribe to realtime changes
    const channel = supabase
      .channel('inventory-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'inventory' },
        () => fetchInventory()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchInventory() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('name_en')

      if (error) throw error
      setInventory(data || [])
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return { inventory, loading, error, refetch: fetchInventory }
}

// Employees Hook
export function useEmployees() {
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchEmployees()
  }, [])

  async function fetchEmployees() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('name')

      if (error) throw error
      setEmployees(data || [])
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return { employees, loading, error, refetch: fetchEmployees }
}

// Audit Log Hook
export function useAuditLog(limit = 50) {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchLogs()

    // Subscribe to realtime changes
    const channel = supabase
      .channel('audit-log-changes')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'audit_log' },
        () => fetchLogs()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [limit])

  async function fetchLogs() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      setLogs(data || [])
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return { logs, loading, error, refetch: fetchLogs }
}

// System Settings Hook
export function useSystemSettings() {
  const [settings, setSettings] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')

      if (error) throw error
      
      const settingsMap: Record<string, any> = {}
      data?.forEach(item => {
        settingsMap[item.key] = item.value
      })
      setSettings(settingsMap)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return { settings, loading, error, refetch: fetchSettings }
}




// Cash Drawer Hook
export function useCashDrawer() {
  const [cashDrawer, setCashDrawer] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchCashDrawer()

    // Subscribe to realtime changes
    const channel = supabase
      .channel('cash-drawer-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'cash_drawer' },
        () => fetchCashDrawer()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchCashDrawer() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('cash_drawer')
        .select('*')
        .order('opened_at', { ascending: false })

      if (error) throw error
      setCashDrawer(data || [])
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return { cashDrawer, loading, error, refetch: fetchCashDrawer }
}

// Accounting Transactions Hook
export function useAccountingTransactions() {
  const [accountingTransactions, setAccountingTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchAccountingTransactions()

    // Subscribe to realtime changes
    const channel = supabase
      .channel('accounting-transactions-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'accounting_transactions' },
        () => fetchAccountingTransactions()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchAccountingTransactions() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('accounting_transactions')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error
      setAccountingTransactions(data || [])
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return { accountingTransactions, loading, error, refetch: fetchAccountingTransactions }
}

