import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import AdminSidebar from '@/components/admin/Sidebar'

export const metadata = {
  title: 'Admin - Oud Royal',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  // Pas de session = page login (le middleware gère la protection)
  // On affiche juste le contenu sans sidebar
  if (!session) {
    return <>{children}</>
  }

  // Connecté = afficher le layout admin avec sidebar
  return (
    <div className="flex min-h-screen bg-dark-primary">
      <AdminSidebar user={session.user} />
      <main className="flex-1 ml-0 lg:ml-64 p-4 md:p-6 lg:p-8 pt-20 lg:pt-8">
        {children}
      </main>
    </div>
  )
}