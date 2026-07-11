import type { Metadata } from 'next'
import { AuthGate } from '@/components/auth-gate'
import { ProfileView } from '@/components/profile-view'
import { SiteFooter } from '@/components/site-footer'
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
      <main className="mx-auto max-w-5xl px-4 pb-20 pt-24 md:px-6 md:pt-28">
        <AuthGate title="Entre para ver seu perfil">
          <ProfileView />
        </AuthGate>
      </main>
      <SiteFooter />
    </>
  )
}
