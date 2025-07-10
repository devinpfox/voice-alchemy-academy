'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../../lib/supabaseClient'

export default function LoginPage() {
  return (
    <div style={{ maxWidth: 400, margin: '50px auto' }}>
      <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={[]} />
    </div>
  )
}
