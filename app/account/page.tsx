'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'

export default function AccountPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/sign-in')
        return
      }
      setEmail(session.user.email ?? '')
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      if (data) {
        setProfile(data)
        setFirstName(data.first_name ?? '')
        setLastName(data.last_name ?? '')
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    await supabase
      .from('profiles')
      .update({ first_name: firstName, last_name: lastName })
      .eq('id', profile.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-900 font-sans">
        <Navbar />
        <div className="flex items-center justify-center py-24">
          <p className="text-sm text-gray-400 dark:text-gray-500">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 font-sans">
      <Navbar />

      <div className="max-w-lg mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8" style={{ fontFamily: 'Georgia, serif' }}>My account</h1>

        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-6 mb-4">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Profile</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">First name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none focus:border-green-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Last name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none focus:border-green-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Role</label>
              <p className="text-sm text-gray-700 dark:text-gray-300 capitalize">{profile?.role ?? '—'}</p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-green-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? 'Saving…' : saved ? 'Saved!' : 'Save changes'}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Security</h2>
          <Link href="/forgot-password" className="text-sm text-green-800 dark:text-green-400 hover:underline">
            Change password →
          </Link>
        </div>
      </div>

      <footer className="border-t border-gray-100 dark:border-gray-700 px-6 py-5 flex justify-between items-center">
        <Link href="/" className="text-green-800 dark:text-green-400 font-bold" style={{ fontFamily: 'Georgia, serif' }}>LenderRep</Link>
        <span className="text-xs text-gray-400 dark:text-gray-500">Not affiliated with NMLS or any government agency</span>
      </footer>
    </main>
  )
}
