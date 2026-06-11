/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const checkMock = async () => {
  try {
    const cookieStore = await cookies()
    const hasMockSession = cookieStore.get('luminaflow-mock-session')?.value === 'true'
    if (hasMockSession) return true
  } catch {
    // cookies() can throw in some edge contexts
  }
  return !process.env.NEXT_PUBLIC_SUPABASE_URL || 
         process.env.NEXT_PUBLIC_SUPABASE_URL.includes("mock") ||
         !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

// Mock Supabase Client Proxy
export const createMockSupabase = () => {
  const queryHandler: any = {
    get(target: any, prop: string): any {
      if (prop === 'then') {
        const mockResult = {
          data: target._data || (target._single ? {} : []),
          error: null,
          count: 0
        }
        return (resolve: any) => resolve(mockResult)
      }
      
      if (['select', 'eq', 'single', 'order', 'limit', 'range', 'insert', 'update', 'upsert', 'delete', 'match', 'or', 'neq', 'gt', 'lt', 'in', 'gte', 'lte'].includes(prop)) {
        return (...args: any[]) => {
          if (prop === 'single') {
            target._single = true
          }
          if (target._table === 'profiles') {
            target._data = {
              id: 'mock-user-id',
              user_id: 'mock-user-id',
              full_name: 'Demo Admin',
              business_name: 'LuminaFlow Enterprise',
              tax_rate_income: 20,
              tax_rate_vat: 20,
              emergency_fund_months: 3,
              currency: 'TRY',
              created_at: new Date().toISOString()
            }
          } else if (target._table === 'projects') {
            target._data = target._single ? {
              id: 'mock-project-id',
              name: 'Demo Proje',
              client_name: 'Stitch Corp',
              status: 'active',
              total_budget: 150000,
              currency: 'TRY'
            } : [
              { id: 'mock-project-id', name: 'Demo Proje', client_name: 'Stitch Corp', status: 'active', total_budget: 150000, currency: 'TRY' }
            ]
          } else if (target._table === 'transactions') {
            target._data = target._single ? {
              id: 'mock-tx-1',
              type: 'income',
              amount: 45000,
              category: 'project_income',
              date: new Date().toISOString().split('T')[0],
              description: 'Proje Hakediş Ödemesi'
            } : [
              {
                id: 'mock-tx-1',
                type: 'income',
                amount: 45000,
                category: 'project_income',
                date: new Date().toISOString().split('T')[0],
                description: 'Proje Hakediş Ödemesi'
              },
              {
                id: 'mock-tx-2',
                type: 'expense',
                amount: 12000,
                category: 'tools_software',
                date: new Date().toISOString().split('T')[0],
                description: 'AWS Sunucu ve SaaS Giderleri'
              },
              {
                id: 'mock-tx-3',
                type: 'expense',
                amount: 8000,
                category: 'office',
                date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString().split('T')[0],
                description: 'Ofis Kira ve Stopaj'
              }
            ]
          }
          return new Proxy(target, queryHandler)
        }
      }
      return new Proxy(target, queryHandler)
    }
  }

  const client = {
    auth: {
      getUser: async () => ({
        data: { user: { id: 'mock-user-id', email: 'admin@example.com' } },
        error: null
      }),
      getSession: async () => ({
        data: { session: { user: { id: 'mock-user-id', email: 'admin@example.com' } } },
        error: null
      }),
      signOut: async () => ({ error: null }),
      signInWithPassword: async () => ({
        data: { user: { id: 'mock-user-id', email: 'admin@example.com' } },
        error: null
      })
    },
    from(table: string) {
      return new Proxy({ _table: table, _single: false }, queryHandler)
    },
    storage: {
      from(bucket: string) {
        return {
          upload: async () => ({ data: { path: 'mock-path' }, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe' } })
        }
      }
    }
  }
  return client as any
}

export async function createClient() {
  if (await checkMock()) return createMockSupabase()

  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server component cookie setting - ignore errors
          }
        },
      },
    }
  )
}
