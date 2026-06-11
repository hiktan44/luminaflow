import { z } from 'zod'

export const transactionSchema = z.object({
  project_id: z.string().uuid().nullable().optional(),
  type: z.enum(['income', 'expense']),
  category: z.enum([
    'freelance_income',
    'project_income',
    'other_income',
    'tools_software',
    'office',
    'marketing',
    'education',
    'travel',
    'utilities',
    'other_expense',
  ]),
  amount: z.number().positive('Tutar pozitif olmalıdır'),
  currency: z.string().min(3).max(3).default('TRY'),
  description: z.string().min(1, 'Açıklama zorunludur').max(500),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Geçerli bir tarih giriniz',
  }),
  is_taxable: z.boolean().default(true),
  tax_rate: z.number().min(0).max(100).nullable().optional(),
})

export const projectSchema = z.object({
  name: z.string().min(1, 'Proje adı zorunludur').max(200),
  client_name: z.string().max(200).nullable().optional(),
  status: z.enum(['active', 'completed', 'paused', 'cancelled']).default('active'),
  total_budget: z.number().positive().nullable().optional(),
  currency: z.string().min(3).max(3).default('TRY'),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  description: z.string().max(2000).nullable().optional(),
})

export const userProfileSchema = z.object({
  full_name: z.string().max(200).nullable().optional(),
  business_name: z.string().max(200).nullable().optional(),
  tax_id: z.string().max(20).nullable().optional(),
  tax_rate_income: z.number().min(0).max(100).default(20),
  tax_rate_vat: z.number().min(0).max(100).default(20),
  monthly_fixed_expenses: z.number().min(0).default(0),
  emergency_fund_months: z.number().min(0).max(24).default(3),
  currency: z.string().min(3).max(3).default('TRY'),
})

export const loginSchema = z.object({
  email: z.string().email('Geçerli bir email giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
})

export const registerSchema = z.object({
  email: z.string().email('Geçerli bir email giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
  full_name: z.string().min(1, 'Ad soyad zorunludur').max(200),
})

export type TransactionInput = z.infer<typeof transactionSchema>
export type ProjectInput = z.infer<typeof projectSchema>
export type UserProfileInput = z.infer<typeof userProfileSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
