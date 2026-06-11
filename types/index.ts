export type TransactionType = 'income' | 'expense'
export type TransactionCategory =
  | 'freelance_income'
  | 'project_income'
  | 'other_income'
  | 'tools_software'
  | 'office'
  | 'marketing'
  | 'education'
  | 'travel'
  | 'utilities'
  | 'other_expense'

export type ProjectStatus = 'active' | 'completed' | 'paused' | 'cancelled'

export interface Transaction {
  id: string
  user_id: string
  project_id: string | null
  type: TransactionType
  category: TransactionCategory
  amount: number
  currency: string
  description: string
  date: string
  is_taxable: boolean
  tax_rate: number | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  client_name: string | null
  status: ProjectStatus
  total_budget: number | null
  currency: string
  start_date: string | null
  end_date: string | null
  description: string | null
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  full_name: string | null
  business_name: string | null
  tax_id: string | null
  tax_rate_income: number
  tax_rate_vat: number
  monthly_fixed_expenses: number
  emergency_fund_months: number
  currency: string
  created_at: string
  updated_at: string
}

export interface RunwayResult {
  months: number
  days: number
  monthly_burn_rate: number
  current_balance: number
  projected_end_date: string
}

export interface SafeToSpendResult {
  total_income: number
  total_expenses: number
  tax_reserve_income: number
  tax_reserve_vat: number
  emergency_reserve: number
  safe_to_spend: number
  breakdown: {
    label: string
    amount: number
    color: string
  }[]
}

export interface TaxReserveResult {
  taxable_income: number
  income_tax_reserve: number
  vat_reserve: number
  total_reserve: number
  effective_rate: number
}

export interface DashboardMetrics {
  current_month_income: number
  current_month_expenses: number
  runway: RunwayResult
  safe_to_spend: SafeToSpendResult
  tax_reserves: TaxReserveResult
  recent_transactions: Transaction[]
  active_projects: Project[]
}

export interface CsvRow {
  date: string
  description: string
  amount: string
  type?: string
  category?: string
}
