'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../../lib/supabaseClient'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && session.user) {
        // Redirect to profile if logged in
        router.push('/profile')
      }
    })
    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [router])

  return (
    <div style={{ maxWidth: 400, margin: '50px auto' }}>
      <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={[]} />
    </div>
  )
}
