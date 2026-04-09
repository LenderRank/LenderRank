'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [firstName, setFirstName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', session.user.id)
          .single()
        if (profile) setFirstName(profile.first_name)
      }
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
        setFirstName('')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900">
      <Link href="/" className="text-2xl font-bold text-green-800 dark:text-green-400" style={{fontFamily: 'Georgia, serif'}}>LenderRep</Link>

      <div className="hidden md:flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/loan-officers/raleigh-nc" className="hover:text-green-800 dark:hover:text-green-400">Find a loan officer</Link>
        <Link href="/states" className="hover:text-green-800 dark:hover:text-green-400">Browse by state</Link>
        <Link href="#how-it-works" className="hover:text-green-800 dark:hover:text-green-400">How it works</Link>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        {loading ? (
          <div className="w-20 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        ) : user ? (
          <>
            <span className="text-sm text-gray-600 dark:text-gray-300">Hi, <span className="font-medium text-green-800 dark:text-green-400">{firstName || 'there'}</span></span>
            <Link href="/account" className="text-sm border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:border-green-300 hover:text-green-800 dark:hover:border-green-500 dark:hover:text-green-400">My account</Link>
            <button onClick={handleSignOut} className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">Sign out</button>
          </>
        ) : (
          <>
            <Link href="/sign-in" className="text-sm text-green-800 dark:text-green-400 font-medium">Sign in</Link>
            <Link href="/claim" className="text-sm bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-700">Claim your profile</Link>
          </>
        )}
      </div>
    </nav>
  )
}
