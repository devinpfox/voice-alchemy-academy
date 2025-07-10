'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState({
    full_name: '',
    username: '',
    avatar_url: ''
  })
  const [message, setMessage] = useState('')
  const [user, setUser] = useState<any>(null)

  // Fetch logged-in user and profile
  useEffect(() => {
    const getProfile = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, username, avatar_url')
        .eq('id', user.id)
        .single()

      if (error) {
        setMessage('No profile found. Please create one by logging in <a href="/login" style="color: #0070f3; text-decoration: underline;">here</a>.')
        setLoading(false)
        return
      }
      setProfile({
        full_name: data.full_name || '',
        username: data.username || '',
        avatar_url: data.avatar_url || ''
      })
      setLoading(false)
    }
    getProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (!user) return

    const updates = {
      id: user.id,
      ...profile,
      updated_at: new Date()
    }

    const { error } = await supabase
      .from('profiles')
      .upsert(updates, { onConflict: 'id' })

    setLoading(false)
    setMessage(error ? 'Error saving profile.' : 'Profile updated!')
  }

  if (loading) return <div>Loading...</div>
  if (!user) return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 12 }}>
      <p style={{ marginBottom: 12 }}>You must be logged in to view or edit your profile.</p>
      <a href="/login" style={{ color: '#0070f3', textDecoration: 'underline' }}>Go to Login</a>
    </div>
  )

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 12 }}>
      <h2>My Profile</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label>
          Name:
          <input
            name="full_name"
            value={profile.full_name}
            onChange={handleChange}
            type="text"
            required
          />
        </label>
        <label>
          Username:
          <input
            name="username"
            value={profile.username}
            onChange={handleChange}
            type="text"
            required
          />
        </label>
        <label>
          Avatar URL:
          <input
            name="avatar_url"
            value={profile.avatar_url}
            onChange={handleChange}
            type="text"
            placeholder="https://example.com/avatar.png"
          />
        </label>
        {profile.avatar_url && (
          <img
            src={profile.avatar_url}
            alt="Avatar Preview"
            style={{ width: 64, height: 64, borderRadius: '50%', margin: '10px 0' }}
          />
        )}
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
        {message && (
          <div
            dangerouslySetInnerHTML={{ __html: message }}
            style={{ marginTop: 12 }}
          />
        )}
      </form>
    </div>
  )
}
