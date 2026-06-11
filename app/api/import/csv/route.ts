import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const csvTransactionSchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Geçerli bir tarih giriniz',
  }),
  description: z.string().min(1).max(500),
  amount: z.number().finite(),
  type: z.enum(['income', 'expense']),
  category: z.string().max(100).optional(),
})

const csvImportSchema = z.object({
  transactions: z.array(csvTransactionSchema).min(1).max(1000),
})

const VALID_CATEGORIES = [
  'freelance_income', 'project_income', 'other_income',
  'tools_software', 'office', 'marketing', 'education',
  'travel', 'utilities', 'other_expense',
]

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: unknown = await request.json()
    const parsed = csvImportSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 })
    }

    const { transactions } = parsed.data

    const toInsert = transactions.map((t) => {
      const defaultCategory = t.type === 'income' ? 'other_income' : 'other_expense'
      const category = t.category && VALID_CATEGORIES.includes(t.category) ? t.category : defaultCategory
      return {
        user_id: user.id,
        type: t.type,
        category,
        amount: Math.abs(t.amount),
        currency: 'TRY',
        description: t.description.slice(0, 500),
        date: t.date,
        is_taxable: true,
        tax_rate: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    })

    const { data, error } = await supabase
      .from('transactions')
      .insert(toInsert)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ imported: data?.length ?? 0, transactions: data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
