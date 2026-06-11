'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  CreditCard,
  FolderOpen,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Zap
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'İşlemler', href: '/transactions', icon: CreditCard },
  { name: 'Projeler', href: '/projects', icon: FolderOpen },
  { name: 'İçe Aktarma', href: '/import', icon: FileText },
  { name: 'Ayarlar', href: '/settings', icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-slate-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">LuminaFlow</span>
          </div>
          
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`group flex gap-x-3 rounded-md p-3 text-sm font-medium transition-colors ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <item.icon className="h-5 w-5 shrink-0" />
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </li>
              
              <li className="mt-auto">
                <button
                  onClick={handleSignOut}
                  className="group -mx-2 flex w-full gap-x-3 rounded-md p-3 text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  Çıkış
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm lg:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="-m-2.5 p-2.5 text-slate-700 lg:hidden"
          aria-label="Menüyü aç"
          aria-expanded={mobileMenuOpen}
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-emerald-500 rounded-md flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900">LuminaFlow</span>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="relative z-50 lg:hidden">
          <div className="fixed inset-0 bg-slate-900/80" onClick={() => setMobileMenuOpen(false)} />
          
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-slate-900/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">LuminaFlow</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-slate-700"
                aria-label="Menüyü kapat"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-slate-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`group flex gap-x-3 rounded-md p-3 text-base font-medium transition-colors ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <item.icon className="h-6 w-6 shrink-0" />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
                
                <div className="py-6">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleSignOut()
                    }}
                    className="group flex w-full gap-x-3 rounded-md p-3 text-base font-medium text-slate-900 hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
                    <LogOut className="h-6 w-6 shrink-0" />
                    Çıkış
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}