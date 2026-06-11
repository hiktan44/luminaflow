import { Navigation } from './Navigation'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Navigation />
      <main className="flex-1 lg:ml-0">
        <div className="pt-16 lg:pt-0">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
