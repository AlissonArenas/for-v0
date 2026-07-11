import type { Metadata } from 'next'
import { AuthGate } from '@/components/auth-gate'
import { ProfileView } from '@/components/profile-view'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'Meu perfil',
  description:
    'Gerencie seu perfil: foto, nome, nível da conta, capítulos lidos e obras favoritas.',
}

export default function ProfilePage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen pt-16">
        <AuthGate title="Entre para ver seu perfil">
          <ProfileView />
        </AuthGate>
      </main>
    </>
  )
}
